using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Interfaces
{
	// Handling both Frmn & Aspect Chart in One Method
	public interface IDashboardManager
	{
		public List<FmnModel> GetFmnDetails(int corpsId, int divisionId);
		public DashboardInputCount GetInputCounts(FilterModel filterModel, int corpsId, int divisionId);
		public DashboardChart GetSectorWiseData(RoleType roleType, FilterModel filterModel, DaysMonthFilter daymonth);
		public DashboardChart GetAllFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn = true);
		public DashboardChart Get30DaysFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn = true);
		public DashboardChart GetTodayFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn = true);
		public DashboardChart Get12MonthsSectorData(RoleType roleType, FilterModel filterModel);

		public DashboardChart Get12MonthsFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn = true);
		public DashboardChart GetIndicatorData(RoleType roleType, FilterModel filterModel, bool isTopTen = true);

		public DashboardChart GetTopFiveLocation(RoleType roleType, FilterModel filterModel, bool isTopFive7Days = true);
	}
}
