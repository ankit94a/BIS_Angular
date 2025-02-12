using BIS.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
	public interface ICdrDashboardDB
	{
		public List<GenerateReport> GetReportByDate(FilterModel filterModel, int corpsId, int roleId, int divisionId = 0);
		public int GetUserIdByDivisonOrCorps(int corpsId, RoleType roleType, int divisonId = 0);
		public int AddInference(ApprovedReports inference);
		public List<ApprovedReports> GetInference(int corpsId, int divisionId);
		
	}
}
