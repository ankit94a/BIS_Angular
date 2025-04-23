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
		public GenerateReportManager(IGenerateReportDB generateReportDB, IServiceScopeFactory serviceScopeFactory,IMasterDataManager masterDataManager)
		{
			_generateReportDB = generateReportDB;
			_serviceScopeFactory = serviceScopeFactory;
			_masterDataManager = masterDataManager;
		}
		public List<GenerateReport> GetReportByUser(long corpsId, long divisionId, int userId)
		{
			return _generateReportDB.GetReportByUser(corpsId, divisionId, userId);
		}
		public List<GenerateReport> GetAll(int corpsId, int divisonId)
		{
			return _generateReportDB.GetAll(corpsId, divisonId);
		}
        public MergeReports GetRoleViewReport(GenerateReport generateReport, int corpsId, int divisionId, RoleType roleType)
		{
            var masterReport = new MergeReports();
            if (roleType == RoleType.MggsEc)
            {
                var mggsReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
                var mggsGraphs = GetGraphs(mggsReport.GraphIds);
                var brigIntReport = _generateReportDB.GetById(mggsReport.RptId.Value, corpsId, divisionId);
                var brigIntGraphs = GetGraphs(brigIntReport.GraphIds);
                var colIntReport = _generateReportDB.GetById(brigIntReport.RptId.Value, corpsId, divisionId);
                var colIntGraphs = GetGraphs(colIntReport.GraphIds);
                var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
                var g1Graphs = GetGraphs(g1Report.GraphIds);

                masterReport.masterData = new List<MasterData>();
                masterReport.Graphs = new List<GraphImages>();
                masterReport.Graphs = g1Graphs;
                masterReport.ReportTitle = g1Report.ReportTitle;
                masterReport.startDate = g1Report.startDate;
                masterReport.endDate = g1Report.endDate;
                masterReport.ReportType = g1Report.ReportType;
                masterReport.Id = mggsReport.Id;
                masterReport.Notes = g1Report.Notes;
                masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

                masterReport.ColGraphs = new List<GraphImages>();
                masterReport.BgsGraphs = new List<GraphImages>();
                masterReport.MggsGraphs = new List<GraphImages>();
                masterReport.ColGraphs = colIntGraphs;
                masterReport.ColNotes = colIntReport.Notes;
                masterReport.BgsGraphs = brigIntGraphs;
                masterReport.BgsNotes = brigIntReport.Notes;
                masterReport.MggsGraphs = mggsGraphs;
                masterReport.MggsNotes = mggsReport.Notes;

            }
            else if (roleType == RoleType.BrigInt || roleType == RoleType.Bgs)
            {
                var bgsReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
                var bgsGraphs = GetGraphs(bgsReport.GraphIds);
                var colIntReport = _generateReportDB.GetById(bgsReport.RptId.Value, corpsId, divisionId);
                var colIntGraphs = GetGraphs(colIntReport.GraphIds);
                var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
                var g1Graphs = GetGraphs(g1Report.GraphIds);

                masterReport.masterData = new List<MasterData>();
                masterReport.Graphs = new List<GraphImages>();
                masterReport.Graphs = g1Graphs;
                masterReport.ReportTitle = g1Report.ReportTitle;
                masterReport.startDate = g1Report.startDate;
                masterReport.endDate = g1Report.endDate;
                masterReport.ReportType = g1Report.ReportType;
                masterReport.Id = bgsReport.Id;
                masterReport.Notes = g1Report.Notes;
                masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

                masterReport.ColGraphs = new List<GraphImages>();
                masterReport.BgsGraphs = new List<GraphImages>();
                masterReport.ColGraphs = colIntGraphs;
                masterReport.ColNotes = colIntReport.Notes;
                masterReport.BgsGraphs = bgsGraphs;
                masterReport.BgsNotes = bgsReport.Notes;
            }
            else if(roleType == RoleType.ColIntEc || roleType == RoleType.Colgs || roleType == RoleType.ColInt)
            {
                var colIntReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
                var colIntGraphs = GetGraphs(colIntReport.GraphIds);
                var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
                var g1Graphs = GetGraphs(g1Report.GraphIds);

                masterReport.masterData = new List<MasterData>();
                masterReport.Graphs = new List<GraphImages>();
                masterReport.Graphs = g1Graphs;
                masterReport.ReportTitle = g1Report.ReportTitle;
                masterReport.startDate = g1Report.startDate;
                masterReport.endDate = g1Report.endDate;
                masterReport.ReportType = g1Report.ReportType;
                masterReport.Id = colIntReport.Id;
                masterReport.Notes = g1Report.Notes;
                masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

                masterReport.ColGraphs = new List<GraphImages>();
                masterReport.ColGraphs = colIntGraphs;
                masterReport.ColNotes = colIntReport.Notes;
            }
            else 
            {
                var g1Report = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
                var g1Graphs = GetGraphs(g1Report.GraphIds);

                masterReport.masterData = new List<MasterData>();
                masterReport.Graphs = new List<GraphImages>();
                masterReport.Graphs = g1Graphs;
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
			var masterReport = new MergeReports();
			if(roleType == RoleType.MggsEc || roleType == RoleType.Mggs)
			{
				var brigIntReport = _generateReportDB.GetById(notification.DataId, corpsId, divisionId);
				var brigGraphs = GetGraphs(brigIntReport.GraphIds);
				var colIntReport = _generateReportDB.GetById(brigIntReport.RptId.Value, corpsId, divisionId);
				var colGraphs = GetGraphs(colIntReport.GraphIds);
				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				var g1Graphs = GetGraphs(g1Report.GraphIds);

				// filling g1 data
				masterReport.masterData = new List<MasterData>();
				masterReport.Graphs = new List<GraphImages>();
				masterReport.Graphs = g1Graphs;
				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = brigIntReport.Id;
				masterReport.Notes = g1Report.Notes;
                masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

				// filling Col data
				masterReport.ColGraphs = new List<GraphImages>();
				masterReport.BgsGraphs = new List<GraphImages>();
				masterReport.ColGraphs = colGraphs;
				masterReport.ColNotes = colIntReport.Notes;
				masterReport.BgsGraphs = brigGraphs;
				masterReport.BgsNotes = brigIntReport.Notes;
				return masterReport;
			}
            else if (roleType == RoleType.BrigInt || roleType == RoleType.Bgs)
			{
                var colIntReport = _generateReportDB.GetById(notification.DataId, corpsId, divisionId);
                var colGraphs = GetGraphs(colIntReport.GraphIds);
                var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
                var g1Graphs = GetGraphs(g1Report.GraphIds);
                var masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

                masterReport.masterData = new List<MasterData>();
                masterReport.Graphs = new List<GraphImages>();
                masterReport.Graphs = g1Graphs;
                masterReport.ReportTitle = g1Report.ReportTitle;
                masterReport.startDate = g1Report.startDate;
                masterReport.endDate = g1Report.endDate;
                masterReport.ReportType = g1Report.ReportType;
                masterReport.Id = colIntReport.Id;
                masterReport.Notes = g1Report.Notes;
                masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

                masterReport.ColGraphs = new List<GraphImages>();
                masterReport.ColGraphs = colGraphs;
                masterReport.ColNotes = colIntReport.Notes;
            }
            else if (roleType == RoleType.ColIntEc || roleType == RoleType.ColInt || roleType == RoleType.Colgs)
			{
                var g1Report = _generateReportDB.GetById(notification.DataId, corpsId, divisionId);
                var g1Graphs = GetGraphs(g1Report.GraphIds);
                var masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

                masterReport.masterData = new List<MasterData>();
                masterReport.Graphs = new List<GraphImages>();
                masterReport.Graphs = g1Graphs;
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
						DataId = Convert.ToInt32(reportId)
					};

					using (var scope = _serviceScopeFactory.CreateScope())
					{
						var userDB = scope.ServiceProvider.GetRequiredService<UserDB>();
						var notificationDB = scope.ServiceProvider.GetRequiredService<NotificationDB>();

						//foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
						//{
						//	if (roleType != RoleType.Colgs)
						//	{
						//		if ((int)item == (int)roleType + 1)
						//		{
						//			notification.ReceiverId = await userDB.GetUserIdByRoleType(item, generateReport.CorpsId, generateReport.DivisionId);
						//			notification.ReceiverEntityType = item;
						//			await notificationDB.AddNotification(notification);
						//			break;
						//		}
						//	}
						//	else
						//	{
						//		if ((int)item == (int)roleType + 4)
						//		{
						//			notification.ReceiverId = await userDB.GetUserIdByRoleType(item, generateReport.CorpsId, generateReport.DivisionId);
						//			notification.ReceiverEntityType = item;
						//			await notificationDB.AddNotification(notification);
						//			break;
						//		}
						//	}
						//}
                        
						// finding user is from which facility
						if(generateReport.CorpsId == 1 && roleType != RoleType.MggsEc)
						{
							// command user
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
						}else if(generateReport.CorpsId > 1 && generateReport.DivisionId == 0 && roleType != RoleType.Bgs)
						{
                            // corps user
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
                        else if(generateReport.CorpsId > 0 && generateReport.DivisionId > 0 && roleType != RoleType.Colgs)
						{
                            // division user
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
						if(notification.ReceiverId > 0 && notification.ReceiverId != default(int))
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
