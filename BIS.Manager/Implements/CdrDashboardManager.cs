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
	public class CdrDashboardManager : ICdrDashboardManager
	{
		private readonly ICdrDashboardDB _cdrDashboardDB;
		private readonly IGenerateReportDB _generateReportDB;
		private readonly INotificationDB _notificationDB;
		private readonly IMasterDataDB _masterDataDB;
		private readonly IMasterDataManager _masterDataManager;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public CdrDashboardManager(ICdrDashboardDB cdrDashboardDB, IGenerateReportDB generateReportDB, INotificationDB notificationDB, IMasterDataDB masterDataDB,IMasterDataManager masterDataManager,IServiceScopeFactory serviceScopeFactory)
		{
			_cdrDashboardDB = cdrDashboardDB;
			_generateReportDB = generateReportDB;
			_notificationDB = notificationDB;
			_masterDataDB = masterDataDB;
			_masterDataManager = masterDataManager;
			_serviceScopeFactory = serviceScopeFactory;
		}
		public List<GenerateReport> GetReportByDate(FilterModel filterModel, int corpsId, RoleType roleType, int divisionId = 0)
		{
            var roleId = 0;
            if (corpsId == 1)
            {
                roleId = GetUserIdByDivisonOrCorps(corpsId, divisionId, RoleType.MggsEc);
            }
            else if(corpsId > 1 && divisionId == 0)
			{
                roleId = GetUserIdByDivisonOrCorps(corpsId, divisionId, RoleType.Bgs);
            }
			else
			{
                roleId = GetUserIdByDivisonOrCorps(corpsId, divisionId, RoleType.Colgs);
            }
            return _cdrDashboardDB.GetReportByDate(filterModel, corpsId, roleId, divisionId);
            if (divisionId > 0)
			{

				//foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
				//{
				//if ((int)item == (int)roleType + 1)
				//{
				//notification.ReceiverId = _userDB.GetUserIdByRoleType(item);
				//notification.ReceiverEntityType = item;
				//notification.NotificationType = NotificationType.MasterData;
				//notification.Title = "Master Form Submitted";
				//notification.Content = $"Input filled by {roleType}. Please review and respond!";
				//notification.CreatedBy = masterData.CreatedBy;
				//notification.CreatedOn = DateTime.UtcNow;
				//notification.CorpsId = masterData.CorpsId;
				//notification.DivisionId = masterData.DivisionId;
				//notification.DataId = Convert.ToInt32(id);
				//return _notificationDB.AddNotification(notification);
				//}
				//}
				
				return _cdrDashboardDB.GetReportByDate(filterModel, corpsId, roleId, divisionId);
			}
			else
			{
				return new List<GenerateReport>();
			}

			
		}

		private int GetUserIdByDivisonOrCorps(int corpsId, int divisionId, RoleType roleType)
		{
			return _cdrDashboardDB.GetUserIdByDivisonOrCorps(corpsId, roleType, divisionId);
		}
		public async Task<bool> AddInference(ApprovedReports inference, RoleType roleType)
		{
			if (inference.Graphs.Count > 0)
			{
				foreach (var graph in inference.Graphs)
				{
					graph.CreatedBy = inference.CreatedBy;
					graph.CorpsId = inference.CorpsId;
					graph.DivisionId = inference.DivisionId;
					graph.CreatedOn = inference.CreatedOn;
				}
				inference.GraphIds = _generateReportDB.AddGraphs(inference.Graphs);
			}
			inference.Graphs.Clear();
			var inferenceId = _cdrDashboardDB.AddInference(inference);


			if (inferenceId > 0)
			{       
                // Get all linked users dynamically
                var linkedUsers = new List<(int receiverId, int dataId)>();

                int? currentDataId = inference.GenerateReportId;
                int maxDepth = 4; // maximum 4 users
                int depth = 0;

                while (currentDataId.HasValue && depth < maxDepth)
                {
                    var userInfo = _generateReportDB.GetUserIdAndRptId(currentDataId.Value);
                    if (userInfo.Item1 > 0)
                    {
                        linkedUsers.Add((userInfo.Item1, currentDataId.Value));
                    }

                    currentDataId = userInfo.Item2; // move to next linked report id
                    depth++;
                }
                foreach (var user in linkedUsers)
                {
                    var notification = new Notification
                    {
                        SenderId = inference.CreatedBy,
                        SenderEntityType = roleType,
                        ReceiverId = user.receiverId,
                        //ReceiverEntityType = GetReceiverRoleType(user.receiverId), 
                        NotificationType = NotificationType.ApprovedReport,
                        Title = "Generate Report Approved",
                        Content = $"Your report has been successfully reviewed and approved by {roleType}",
                        CreatedBy = inference.CreatedBy,
                        CreatedOn = DateTime.UtcNow,
                        CorpsId = inference.CorpsId,
                        DivisionId = inference.DivisionId,
                        DataId = user.dataId
                    };

                    await _notificationDB.AddNotification(notification);
                }


                // getting colgs id based on generate report id also if there is g1 generate report is exist then fetch the id;
    //            var ColgsIdAndRptId = _generateReportDB.GetUserIdAndRptId(inference.GenerateReportId);
				//var clogsUpdateStatus = _generateReportDB.UpdateStatus(inference.GenerateReportId, Status.Approved);
				//if (ColgsIdAndRptId.Item2.HasValue)
				//{
				//	var G1IntId = _generateReportDB.GetUserIdAndRptId(ColgsIdAndRptId.Item2.Value);
    //                var G1UpdateStatus = _generateReportDB.UpdateStatus(ColgsIdAndRptId.Item2.Value, Status.Approved);
    //                var notif = new Notification();
				//	notif.SenderId = inference.CreatedBy;
				//	notif.SenderEntityType = roleType;
				//	notif.ReceiverId = G1IntId.Item1;
				//	notif.ReceiverEntityType = RoleType.G1Int;
				//	notif.NotificationType = NotificationType.ApprovedReport;
				//	notif.Title = "Generate Report Approved";
				//	notif.Content = $"Your report has been successfully reviewed and approved by {roleType}";
				//	notif.CreatedBy = inference.CreatedBy;
				//	notif.CreatedOn = DateTime.UtcNow;
				//	notif.CorpsId = inference.CorpsId;
				//	notif.DivisionId = inference.DivisionId;
				//	notif.DataId = ColgsIdAndRptId.Item2.Value;
				//	_notificationDB.AddNotification(notif);
				//}
				//var notification = new Notification();
				//notification.SenderId = inference.CreatedBy;
				//notification.SenderEntityType = roleType;
				//notification.ReceiverId = ColgsIdAndRptId.Item1;
				//notification.ReceiverEntityType = RoleType.Colgs;
				//notification.NotificationType = NotificationType.ApprovedReport;
				//notification.Title = "Generate Report Approved";
				//notification.Content = $"Your report has been successfully reviewed and approved by {roleType}";
				//notification.CreatedBy = inference.CreatedBy;
				//notification.CreatedOn = DateTime.UtcNow;
				//notification.CorpsId = inference.CorpsId;
				//notification.DivisionId = inference.DivisionId;
				//notification.DataId = inference.GenerateReportId;
				//_notificationDB.AddNotification(notification);
			}
			return true;
		}

	
		public List<ApprovedReports> GetInference(int corpsId, int divisionId)
		{
			return _cdrDashboardDB.GetInference(corpsId, divisionId);
		}
        public List<GraphImages> GetGraphs(string idsList)
        {
            var idsArray = idsList.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
            return _generateReportDB.GetGraphs(idsArray);
        }
        public MergeReports GetCdrViewReport(GenerateReport generateReport, int corpsId, int divisionId)
		{
            var masterReport = new MergeReports();
			if(corpsId == 1)
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
            else if(corpsId > 1 && divisionId == 0)
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
            else
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
			return masterReport;
        }

        public FullReport GetFullReport(ApprovedReports inference, int corpsId, RoleType roleType, int divisionId)
		{
			var fullReport = new FullReport();
            //// first getting GOC graphs
            //var gocGraphIds = inference.GraphIds.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
            //inference.Graphs = _generateReportDB.GetGraphs(gocGraphIds);
            //fullReport.Inference = inference;
            //// then get's ColGs report;
            //var colGsReport = _generateReportDB.GetById(inference.GenerateReportId, corpsId, divisionId);
            //var colGsGraphIds = colGsReport.GraphIds.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
            //colGsReport.Graphs = _generateReportDB.GetGraphs(colGsGraphIds);
            //fullReport.ColGsReport = colGsReport;
            //// then get's G1Int report
            //if (colGsReport.RptId.HasValue)
            //{
            //	var g1IntReport = _generateReportDB.GetById(colGsReport.RptId.Value, corpsId, divisionId);
            //	var g1IntGraphIds = g1IntReport.GraphIds.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
            //	g1IntReport.Graphs = _generateReportDB.GetGraphs(g1IntGraphIds);
            //	fullReport.G1IntReport = g1IntReport;

            //	if (g1IntReport.MasterDataIds.Length > 0)
            //	{
            //		var masterDataIds = g1IntReport.MasterDataIds.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
            //		var masterDataList = _masterDataDB.GetByIds(masterDataIds);
            //		fullReport.MasterDatas = masterDataList;
            //	}
            //}
            var gocGraphIds = inference.GraphIds.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
            inference.Graphs = _generateReportDB.GetGraphs(gocGraphIds);
            fullReport.Inference = inference;
			var generateReport = new GenerateReport();
			generateReport.Id = inference.GenerateReportId;
            fullReport.MergeReport = GetCdrViewReport(generateReport, corpsId, divisionId);

            return fullReport;
		}
	}
}
