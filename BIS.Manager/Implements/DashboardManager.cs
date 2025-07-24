using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class DashboardManager : IDashboardManager
	{
		private readonly IDashboardDB _dashboardDB;
		public DashboardManager(IDashboardDB dashboardDB)
		{
			_dashboardDB = dashboardDB;
		}
		public List<FmnModel> GetFmnDetails(int corpsId, int divisionId)
		{
			return _dashboardDB.GetFmnDetails(corpsId, divisionId);
		}

		public DashboardInputCount GetInputCounts(FilterModel filterModel, int corpsId, int divisionId)
		{
			return _dashboardDB.GetInputCounts(filterModel, corpsId, divisionId);
		}
		public DashboardChart GetSectorWiseData(RoleType roleType, FilterModel filterModel, DaysMonthFilter daysMonthFilter)
		{
			return _dashboardDB.GetSectorWiseData(filterModel, daysMonthFilter);
		}

		public DashboardChart GetAllFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn = true)
		{
			var result = new DashboardChart();
			if (isFrmn)
			{
				return _dashboardDB.GetFrmnChart(DaysMonthFilter.All, filterModel);
			}
			else
			{
				return _dashboardDB.GetAspectChart(DaysMonthFilter.All, filterModel);
			}
		}
		public DashboardChart Get30DaysFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn)
		{
			var result = new DashboardChart();
			if (isFrmn)
			{
				return _dashboardDB.GetFrmnChart(DaysMonthFilter.Days30, filterModel);
			}
			else
			{
				return _dashboardDB.GetAspectChart(DaysMonthFilter.Days30, filterModel);
			}
		}

		public DashboardChart GetTodayFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn = true)
		{
			var result = new DashboardChart();
			if (isFrmn)
			{
				return _dashboardDB.GetFrmnChart(DaysMonthFilter.Today, filterModel);
			}
			else
			{
				return _dashboardDB.GetAspectChart(DaysMonthFilter.Today, filterModel);
			}


		}
		public DashboardChart Get12MonthsSectorData(RoleType roleType, FilterModel filterModel)
		{
			return _dashboardDB.Get12MonthsSectorData(filterModel);
		}

		public DashboardChart Get12MonthsFmnOrAspectData(RoleType roleType, FilterModel filterModel, bool isFrmn)
		{
			var result = new DashboardChart();
			if (isFrmn)
			{
				return _dashboardDB.GetFrmnChart(DaysMonthFilter.Months12, filterModel);
			}
			else
			{
				return _dashboardDB.GetAspectChart(DaysMonthFilter.Months12, filterModel);
			}
		}
		public DashboardChart GetIndicatorData(RoleType roleType, FilterModel filterModel, bool isTopTen = true)
		{
			if (isTopTen)
			{
				return _dashboardDB.GetTop10Indicator(filterModel);
			}
			else
			{
				return _dashboardDB.GetTop5IndicatorLast7Days(filterModel);
			}
		}
		public DashboardChart GetTopFiveLocation(RoleType roleType, FilterModel filterModel, bool isTopFive7Days = true)
		{
			return _dashboardDB.GetTopFiveLocation(filterModel, isTopFive7Days);

		}
	}
}
