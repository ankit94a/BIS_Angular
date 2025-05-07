using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
	public interface IGenerateReportDB : IBaseDB<GenerateReport>
	{
		public List<GenerateReport> GetReportByUser(long corpsId, long divisionId, int userId);
		public GenerateReport GetById(int id, int corpsId, int divisionId);
		public string AddGraphs(List<GraphImages> Graphs);
		public List<GraphImages> GetGraphs(List<int> ids);
		public Tuple<int, int?> GetUserIdAndRptId(int reportId);
		public Task<long> UpdateStatus(int id, Status status);
		public List<GenerateReport> GetPreviousUserReport(int userId);
		public List<GenerateReport> GetAllReports(List<int> idsList);

	}
}
