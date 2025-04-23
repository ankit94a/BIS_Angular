using BIS.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Interfaces
{
	public interface ICdrDashboardManager
	{
		public List<GenerateReport> GetReportByDate(FilterModel filterModel, int corpsId, RoleType roleType, int divisionId);
		public Task<bool> AddInference(ApprovedReports inference,RoleType roleType);
		public List<ApprovedReports> GetInference(int corpsId, int divisionId);

		public FullReport GetFullReport(ApprovedReports inference, int corpsId, RoleType roleType, int divisionId);
		public MergeReports GetCdrViewReport(GenerateReport generateReport, int corpsId, int divisionId);
       
    }
}
