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
		public CdrDashboardManager(ICdrDashboardDB cdrDashboardDB, IGenerateReportDB generateReportDB, INotificationDB notificationDB, IMasterDataDB masterDataDB, IMasterDataManager masterDataManager, IServiceScopeFactory serviceScopeFactory)
		{
			_cdrDashboardDB = cdrDashboardDB;
			_generateReportDB = generateReportDB;
			_notificationDB = notificationDB;
			_masterDataDB = masterDataDB;
			_masterDataManager = masterDataManager;
			_serviceScopeFactory = serviceScopeFactory;
		}
		public List<GenerateReport> GetReport(int corpsId, RoleType roleType, int divisionId = 0)
		{
			var roleId = 0;
			if (corpsId == 1)
			{
				roleId = GetUserIdByDivisonOrCorps(corpsId, divisionId, RoleType.MggsEc);
			}
			else if (corpsId > 1 && divisionId == 0)
			{
				roleId = GetUserIdByDivisonOrCorps(corpsId, divisionId, RoleType.Bgs);
			}
			else
			{
				roleId = GetUserIdByDivisonOrCorps(corpsId, divisionId, RoleType.Colgs);
			}
			return _cdrDashboardDB.GetReportByDate(corpsId, roleId, divisionId);

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
				var linkedUsers = new List<(int receiverId, int dataId)>();

				int? currentDataId = inference.GenerateReportId;
				int maxDepth = 4; 
				int depth = 0;

				while (currentDataId.HasValue && depth < maxDepth)
				{
					var userInfo = _generateReportDB.GetUserIdAndRptId(currentDataId.Value);
					if (userInfo.Item1 > 0)
					{
						linkedUsers.Add((userInfo.Item1, currentDataId.Value));
					}

					currentDataId = userInfo.Item2; 
					depth++;
				}
				foreach (var user in linkedUsers)
				{
					var notification = new Notification
					{
						SenderId = inference.CreatedBy,
						SenderEntityType = roleType,
						ReceiverId = user.receiverId,
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
				await _generateReportDB.UpdateStatus(inference.GenerateReportId, Status.Approved);
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

			if (corpsId == 1)
			{
				var mggsReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
				if (mggsReport.GraphIds != null)
				{
					mggsGraphs = GetGraphs(mggsReport.GraphIds);
					masterReport.MggsGraphs = mggsGraphs;
				}

				var brigIntReport = _generateReportDB.GetById(mggsReport.RptId.Value, corpsId, divisionId);
				if (brigIntReport.GraphIds != null)
				{
					brigIntGraphs = GetGraphs(brigIntReport.GraphIds);
					masterReport.BgsGraphs = brigIntGraphs;
				}

				var colIntReport = _generateReportDB.GetById(brigIntReport.RptId.Value, corpsId, divisionId);
				if (colIntReport.GraphIds != null)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}

				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null)
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
			else if (corpsId > 1 && divisionId == 0)
			{
				var bgsReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
				if (bgsReport.GraphIds != null)
				{
					brigIntGraphs = GetGraphs(bgsReport.GraphIds);
					masterReport.BgsGraphs = brigIntGraphs;
				}
				var colIntReport = _generateReportDB.GetById(bgsReport.RptId.Value, corpsId, divisionId);
				if (colIntReport.GraphIds != null)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}

				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				masterReport.Graphs = g1Graphs;
				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = bgsReport.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);
				masterReport.ColGraphs = colIntGraphs;
				masterReport.ColNotes = colIntReport.Notes;
				masterReport.BgsNotes = bgsReport.Notes;
			}
			else
			{
				var colIntReport = _generateReportDB.GetById(generateReport.Id, corpsId, divisionId);
				if (colIntReport.GraphIds != null)
				{
					colIntGraphs = GetGraphs(colIntReport.GraphIds);
					masterReport.ColGraphs = colIntGraphs;
				}

				var g1Report = _generateReportDB.GetById(colIntReport.RptId.Value, corpsId, divisionId);
				if (g1Report.GraphIds != null)
				{
					g1Graphs = GetGraphs(g1Report.GraphIds);
					masterReport.Graphs = g1Graphs;
				}

				masterReport.Graphs = g1Graphs;
				masterReport.ReportTitle = g1Report.ReportTitle;
				masterReport.startDate = g1Report.startDate;
				masterReport.endDate = g1Report.endDate;
				masterReport.ReportType = g1Report.ReportType;
				masterReport.Id = colIntReport.Id;
				masterReport.Notes = g1Report.Notes;
				masterReport.masterData = _masterDataManager.GetByIds(g1Report.MasterDataIds);

				masterReport.ColGraphs = colIntGraphs;
				masterReport.ColNotes = colIntReport.Notes;
			}
			return masterReport;
		}

		public FullReport GetFullReport(ApprovedReports inference, int corpsId, RoleType roleType, int divisionId)
		{
			var fullReport = new FullReport();
			
			if (inference.GraphIds != null)
			{
				var gocGraphIds = inference.GraphIds.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
				inference.Graphs = _generateReportDB.GetGraphs(gocGraphIds);
			}

			fullReport.Inference = inference;
			var generateReport = new GenerateReport();
			generateReport.Id = inference.GenerateReportId;
			fullReport.MergeReport = GetCdrViewReport(generateReport, corpsId, divisionId);
			return fullReport;
		}
	}
}
