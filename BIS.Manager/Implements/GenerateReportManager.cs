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
		private readonly IMasterDataManager _masterDataManager;
		private readonly ICdrDashboardDB _cdrDashboardDb;
		private readonly INotificationDB _notificationDB;
		public GenerateReportManager(IGenerateReportDB generateReportDB, INotificationDB notificationDB, IServiceScopeFactory serviceScopeFactory, IMasterDataManager masterDataManager, ICdrDashboardDB cdrDashboardDB)
		{
			_generateReportDB = generateReportDB;
			_serviceScopeFactory = serviceScopeFactory;
			_masterDataManager = masterDataManager;
			_cdrDashboardDb = cdrDashboardDB;
			_notificationDB = notificationDB;
		}
		public List<GenerateReport> GetReportByUser(int corpsId, int divisionId, int userId, RoleType roleType)
		{
			var mergeReprot = new List<GenerateReport>();
			var currentUserReports = _generateReportDB.GetReportByUser(corpsId, divisionId, userId);
			mergeReprot.AddRange(currentUserReports);
			var values = Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderBy(r => (int)r).ToList();
			int index = values.IndexOf(roleType);
			var dataId = new List<int>();
			if (index > 1)
			{
				var previousRole = values[index - 1]; 
				var previousUserId = _cdrDashboardDb.GetUserIdByDivisonOrCorps(corpsId, previousRole, divisionId);
				var notificationList = _notificationDB.GetAllUserNotification(previousUserId);
				foreach (var notification in notificationList)
				{
					dataId.Add(notification.DataId);
				}

				var previousUserReports = _generateReportDB.GetAllReports(dataId);
				foreach (var rpt in previousUserReports)
				{
					rpt.IsRead = true;
				}
				mergeReprot.AddRange(previousUserReports);
			}

			return mergeReprot;

		}
		public List<GenerateReport> GetPreviousUserReport(int userId)
		{
			return _generateReportDB.GetPreviousUserReport(userId);
		}
		public List<GenerateReport> GetAll(int corpsId, int divisonId)
		{
			return _generateReportDB.GetAll(corpsId, divisonId);
		}

		public MergeReports GetRoleViewReport(GenerateReport generateReport, int corpsId, int divisionId, RoleType roleType)
		{
			var masterReport = new MergeReports()
			{
				masterData = new List<MasterData>(),
				Graphs = new List<GraphImages>(),
				ColGraphs = new List<GraphImages>(),
				BgsGraphs = new List<GraphImages>(),
				MggsGraphs = new List<GraphImages>()
			};
			var mggsGraphs = new List<GraphImages>();
			var brigIntGraphs = new List<GraphImages>();
			var colIntGraphs = new List<GraphImages>();
			var g1Graphs = new List<GraphImages>();
			var bgsGraphs = new List<GraphImages>();

			if (roleType == RoleType.MggsEc)
			{
				var mggsReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
				if (mggsReport.GraphIds != null && mggsReport.GraphIds.Length > 0)
				{
					mggsGraphs = GetGraphs(mggsReport.GraphIds);
					masterReport.MggsGraphs = mggsGraphs;
				}
				var brigIntReport = _generateReportDB.GetById(mggsReport.RptId.Value, corpsId, divisionId);
				if (brigIntReport.GraphIds != null && brigIntReport.GraphIds.Length > 0)
				{
					brigIntGraphs = GetGraphs(brigIntReport.GraphIds);
					masterReport.BgsGraphs = brigIntGraphs;
				}
				var colIntReport = _generateReportDB.GetById(brigIntReport.RptId.Value, corpsId, divisionId);
				if (colIntReport.GraphIds != null && colIntReport.GraphIds.Length > 0)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}
				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null && g1Report.GraphIds.Length > 0)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = mggsReport.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ColNotes = colIntReport.Notes;
				masterReport.BgsNotes = brigIntReport.Notes;
				masterReport.MggsNotes = mggsReport.Notes;

			}
			else if (roleType == RoleType.BrigInt || roleType == RoleType.Bgs)
			{
				var bgsReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
				if (bgsReport.GraphIds != null && bgsReport.GraphIds.Length > 0)
				{
					bgsGraphs = GetGraphs(bgsReport.GraphIds);
					masterReport.BgsGraphs = bgsGraphs;
				}
				var colIntReport = _generateReportDB.GetById(bgsReport.RptId.Value, corpsId, divisionId);
				if (colIntReport.GraphIds != null && colIntReport.GraphIds.Length > 0)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}
				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null && g1Report.GraphIds.Length > 0)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = bgsReport.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ColNotes = colIntReport.Notes;
				masterReport.BgsNotes = bgsReport.Notes;
			}
			else if (roleType == RoleType.ColIntEc || roleType == RoleType.Colgs || roleType == RoleType.ColInt)
			{
				var colIntReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
				if (colIntReport.GraphIds != null && colIntReport.GraphIds.Length > 0)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}
				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null && g1Report.GraphIds.Length > 0)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}
				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = colIntReport.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ColNotes = colIntReport.Notes;
			}
			else
			{
				var g1Report = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
				if (g1Report.GraphIds != null && g1Report.GraphIds.Length > 0)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = g1Report.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

			}
			return masterReport;
		}
		public MergeReports GetByRole(Notification notification, int corpsId, int divisionId, RoleType roleType)
		{
			var masterReport = new MergeReports()
			{
				masterData = new List<MasterData>(),
				Graphs = new List<GraphImages>(),
				ColGraphs = new List<GraphImages>(),
				BgsGraphs = new List<GraphImages>(),
				MggsGraphs = new List<GraphImages>(),
				IsRead = notification.IsRead
			};
			var mggsGraphs = new List<GraphImages>();
			var brigIntGraphs = new List<GraphImages>();
			var colIntGraphs = new List<GraphImages>();
			var g1Graphs = new List<GraphImages>();
			var bgsGraphs = new List<GraphImages>();
			if (roleType == RoleType.MggsEc || roleType == RoleType.Mggs)
			{
				var brigIntReport = _generateReportDB.GetById(notification.DataId, corpsId, divisionId);
				if (brigIntReport.GraphIds != null && brigIntReport.GraphIds.Length > 0)
				{
					brigIntGraphs = GetGraphs(brigIntReport.GraphIds);
					masterReport.BgsGraphs = brigIntGraphs;
				}

				var colIntReport = _generateReportDB.GetById(brigIntReport.RptId.Value, corpsId, divisionId);
				if (colIntReport.GraphIds != null && colIntReport.GraphIds.Length > 0)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}

				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null && g1Report.GraphIds.Length > 0)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = brigIntReport.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ColNotes = colIntReport.Notes;
				masterReport.BgsNotes = brigIntReport.Notes;
				return masterReport;
			}
			else if (roleType == RoleType.BrigInt || roleType == RoleType.Bgs)
			{
				var colIntReport = _generateReportDB.GetById(notification.DataId, corpsId, divisionId);
				if (colIntReport.GraphIds != null && colIntReport.GraphIds.Length > 0)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}

				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null && g1Report.GraphIds.Length > 0)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				var masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = colIntReport.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ColNotes = colIntReport.Notes;
			}
			else if (roleType == RoleType.ColIntEc || roleType == RoleType.ColInt || roleType == RoleType.Colgs)
			{
				var g1Report = _generateReportDB.GetById(notification.DataId, corpsId, divisionId);
				if (g1Report.GraphIds != null && g1Report.GraphIds.Length > 0)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				var masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = g1Report.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
			}

			return masterReport;
		}

		public long AddReport(GenerateReport generateReport, RoleType roleType)
		{
			if (generateReport.IsRead.HasValue)
			{
				_notificationDB.NotificationActionTaken(generateReport.RptId.Value, generateReport.CorpsId, generateReport.DivisionId.Value);
			}

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
					await Task.Delay(TimeSpan.FromMinutes(1));
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
						DataId = Convert.ToInt32(reportId),
						IsActionTaken = false
					};

					using (var scope = _serviceScopeFactory.CreateScope())
					{
						var userDB = scope.ServiceProvider.GetRequiredService<UserDB>();
						var notificationDB = scope.ServiceProvider.GetRequiredService<NotificationDB>();

						if (generateReport.CorpsId == 1 && roleType != RoleType.MggsEc)
						{
							switch (roleType)
							{
								case RoleType.G1IntEc:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.ColIntEc, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.ColIntEc;
									break;
								case RoleType.ColIntEc:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.BrigInt, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.BrigInt;
									break;
								case RoleType.BrigInt:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.MggsEc, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.MggsEc;
									break;
								case RoleType.MggsEc:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.GocEc, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.GocEc;
									break;
							}
						}
						else if (generateReport.CorpsId > 1 && generateReport.DivisionId == 0 && roleType != RoleType.Bgs)
						{
							switch (roleType)
							{
								case RoleType.G1Int:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.ColInt, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.ColInt;
									break;
								case RoleType.ColInt:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.Bgs, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.Bgs;
									break;
								case RoleType.Bgs:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.Goc, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.Goc;
									break;
							}
						}
						else if (generateReport.CorpsId > 0 && generateReport.DivisionId > 0 && roleType != RoleType.Colgs)
						{
							switch (roleType)
							{
								case RoleType.G1Int:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.Colgs, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.Colgs;
									break;
								case RoleType.Colgs:
									notification.ReceiverId = await userDB.GetUserIdByRoleType(RoleType.Goc, generateReport.CorpsId, generateReport.DivisionId);
									notification.ReceiverEntityType = RoleType.Goc;
									break;
							}
						}
						if (notification.ReceiverId > 0 && notification.ReceiverId != default(int))
							await notificationDB.AddNotification(notification);
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
