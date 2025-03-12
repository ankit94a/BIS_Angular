using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
	public interface IDashboardDB
	{
		public List<FmnModel> GetFmnDetails(int corpsId, int divisionId);
		public DashboardInputCount GetInputCounts(FilterModel filterModel, int corpsId, int divisionId);
		public DashboardChart Get12MonthsSectorData(FilterModel filterModel);
		public DashboardChart GetFrmnChart(DaysMonthFilter daysMonthFilter, FilterModel filterModel);
		public DashboardChart GetAspectChart(DaysMonthFilter daysMonthFilter, FilterModel filterModel);
		public DashboardChart GetTop10Indicator(FilterModel filterModel);
		public DashboardChart GetSectorWiseData(FilterModel filterModel, DaysMonthFilter daysMonthFilter);
		public DashboardChart GetTop5IndicatorLast7Days(FilterModel filterModel);
		public DashboardChart GetTopFiveLocation(FilterModel filterModel, bool isTopFive7Days = true);
	}
}
