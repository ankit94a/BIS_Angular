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
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class GenerateReportManager : IGenerateReportManager
	{
		private readonly IGenerateReportDB _generateReportDB;
		private readonly IUserDB _userDB;
		private readonly INotificationDB _notificationDB;
		private readonly IMasterDataDB _masterDataDB;
		public GenerateReportManager(IGenerateReportDB generateReportDB, IUserDB userDB, INotificationDB notificationDB, IMasterDataDB masterDataDB)
		{
			_generateReportDB = generateReportDB;
			_userDB = userDB;
			_notificationDB = notificationDB;
			_masterDataDB = masterDataDB;
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
			//generateReport.MasterDataIds = "[" + string.Join(",", generateReport.MasterData.Select(item => item.ID)) + "]";
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
			generateReport.Graphs.Clear();
			var reportId = _generateReportDB.Add(generateReport);
			if (reportId > 0)
			{
				var notification = new Notification();
				notification.SenderId = generateReport.CreatedBy;
				notification.SenderEntityType = roleType;
				foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
				{
					// also check for user is belonging from division or not ------------>   ToDo
					if (roleType != RoleType.Colgs)
					{
						if ((int)item == (int)roleType + 1)
						{
							notification.ReceiverId = _userDB.GetUserIdByRoleType(item, generateReport.CorpsId, generateReport.DivisionId);
							notification.ReceiverEntityType = item;
							notification.NotificationType = NotificationType.GenerateReport;
							notification.Title = "Generate Report Submitted";
							notification.Content = $"{roleType} just filled out the report. Please review and respond!";
							notification.CreatedBy = generateReport.CreatedBy;
							notification.CreatedOn = DateTime.UtcNow;
							notification.CorpsId = generateReport.CorpsId;
							notification.DivisionId = generateReport.DivisionId;
							notification.DataId = Convert.ToInt32(reportId);
							return _notificationDB.AddNotification(notification);
						}
					}
					else
					{
						if ((int)item == (int)roleType + 4)
						{
							notification.ReceiverId = _userDB.GetUserIdByRoleType(item, generateReport.CorpsId, generateReport.DivisionId);
							notification.ReceiverEntityType = item;
							notification.NotificationType = NotificationType.GenerateReport;
							notification.Title = "Generate Report Submitted";
							notification.Content = $"{roleType} just filled out the report. Please review and respond!";
							notification.CreatedBy = generateReport.CreatedBy;
							notification.CreatedOn = DateTime.UtcNow;
							notification.CorpsId = generateReport.CorpsId;
							notification.DivisionId = generateReport.DivisionId;
							notification.DataId = Convert.ToInt32(reportId);
							return _notificationDB.AddNotification(notification);
						}
					}

				}
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
