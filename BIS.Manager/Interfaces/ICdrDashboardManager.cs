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

	}
}
