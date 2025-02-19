using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class GenerateReportManager : IGenerateReportManager
	{
		private readonly IGenerateReportDB _generateReportDB;
		private readonly IServiceScopeFactory _serviceScopeFactory;
		public GenerateReportManager(IGenerateReportDB generateReportDB, IServiceScopeFactory serviceScopeFactory)
		{
			_generateReportDB = generateReportDB;
			_serviceScopeFactory = serviceScopeFactory;
		}
		public List<GenerateReport> GetReportByUser(long corpsId, long divisionId, int userId)
		{
			return _generateReportDB.GetReportByUser(corpsId, divisionId, userId);
		}
		public List<GenerateReport> GetAll(int corpsId, int divisonId)
		{
			return _generateReportDB.GetAll(corpsId, divisonId);
		}
		public long AddReport(GenerateReport generateReport, RoleType roleType)
		{
			// Add graphs to the report if any
			if (generateReport.Graphs.Count > 0)
			{
				foreach (var graph in generateReport.Graphs)
				{
					graph.CreatedBy = generateReport.CreatedBy;
					graph.CorpsId = generateReport.CorpsId;
					graph.DivisionId = generateReport.DivisionId;
					graph.CreatedOn = generateReport.CreatedOn;
				}
				generateReport.GraphIds = _generateReportDB.AddGraphs(generateReport.Graphs);
			}

			generateReport.Status = Status.Created;
			generateReport.Graphs.Clear();
			var reportId = _generateReportDB.Add(generateReport);

			if (reportId > 0)
			{
				Task.Run(async () =>
				{
					await Task.Delay(TimeSpan.FromMinutes(2));
					var notification = new Notification
					{
						SenderId = generateReport.CreatedBy,
						SenderEntityType = roleType,
						NotificationType = NotificationType.GenerateReport,
						Title = "Generate Report Submitted",
						Content = $"{roleType} just filled out the report. Please review and respond!",
						CreatedBy = generateReport.CreatedBy,
						CreatedOn = DateTime.UtcNow,
						CorpsId = generateReport.CorpsId,
						DivisionId = generateReport.DivisionId,
						DataId = Convert.ToInt32(reportId)
					};

					using (var scope = _serviceScopeFactory.CreateScope())
					{
						var userDB = scope.ServiceProvider.GetRequiredService<UserDB>();
						var notificationDB = scope.ServiceProvider.GetRequiredService<NotificationDB>();

						foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
						{
							if (roleType != RoleType.Colgs)
							{
								if ((int)item == (int)roleType + 1)
								{
									notification.ReceiverId = await userDB.GetUserIdByRoleType(item, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = item;
									await notificationDB.AddNotification(notification);
									break;
								}
							}
							else
							{
								if ((int)item == (int)roleType + 4)
								{
									notification.ReceiverId = await userDB.GetUserIdByRoleType(item, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = item;
									await notificationDB.AddNotification(notification);
									break;
								}
							}
						}
                        var generateReportDB = scope.ServiceProvider.GetRequiredService<GenerateReportDB>();
                        await generateReportDB.UpdateStatus(generateReport.Id, Status.Progress);
                    }
				});
			}
			return reportId;
		}


		public GenerateReport GetById(int id, int corpsId, int divisionId)
		{
			return _generateReportDB.GetById(id, corpsId, divisionId);
		}
		public List<GraphImages> GetGraphs(string idsList)
		{
			var idsArray = idsList.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
			return _generateReportDB.GetGraphs(idsArray);
		}
		public long Add(GenerateReport report)
		{
			throw new NotImplementedException();
		}
		public long Update(GenerateReport report)
		{
			throw new NotImplementedException();
		}
		public GenerateReport GetBy(int Id, int CorpsId)
		{
			throw new NotImplementedException();
		}
	}
}
