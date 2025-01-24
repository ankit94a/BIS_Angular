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
        public DashboardInputCount GetInputCounts(int corpsId, int divisionId = 0)
        {
            return _dashboardDB.GetInputCounts(corpsId, divisionId);
        }
        public DashboardChart GetAllFmnOrAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel,bool isFrmn)
        {
            //case 1 role is belonging to division
            if (divisionId > 0)
            {
                // case 1.1 sector and aspect is empty any of one
                // case 1.2 sector and aspect any of have value
                // case 1.3 handling frmn and aspect base chart
                var result = new DashboardChart();
                if (isFrmn)
                {
                    return _dashboardDB.GetFrmnChart(corpsId, divisionId, DaysMonthFilter.All, filterModel);
                }
                else
                {
                    return _dashboardDB.GetAspectChart(corpsId, divisionId, DaysMonthFilter.All, filterModel);
                }
                
            }
            else
            {
                return null;
            }
        }
        public DashboardChart Get30DaysFmnOrAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isFrmn)
        {
            //case 1 role is belonging to division
            if (divisionId > 0)
            {
                // case 1.1 sector and aspect is empty any of one
                // case 1.2 sector and aspect any of have value
                // case 1.3 handling frmn and aspect base chart
                var result = new DashboardChart();
                if (isFrmn)
                {
                    return _dashboardDB.GetFrmnChart(corpsId, divisionId, DaysMonthFilter.Days30, filterModel);
                }
                else
                {
                    return _dashboardDB.GetAspectChart(corpsId, divisionId, DaysMonthFilter.Days30, filterModel);
                }
                
            }
            else
            {
                return null;
            }
        }

        public DashboardChart GetTodayFmnOrAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isFrmn=true)
        {
            //case 1 role is belonging to division
            if (divisionId > 0)
            {
                // case 1.1 sector and aspect is empty any of one
                // case 1.2 sector and aspect of have value
                // case 1.3 handling frmn and aspect base chart
                var result = new DashboardChart();
                if (isFrmn)
                {
                    return _dashboardDB.GetFrmnChart(corpsId, divisionId, DaysMonthFilter.Today, filterModel);
                }
                else
                {
                    return _dashboardDB.GetAspectChart(corpsId, divisionId, DaysMonthFilter.Today, filterModel);
                }
            }
            else
            {
                return null;
            }
        }

        public DashboardChart Get12MonthsFmnOrAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isFrmn)
        {
            //case 1 role is belonging to division
            if (divisionId > 0)
            {
                // case 1.1 sector and aspect is empty any of one
                // case 1.2 sector and aspect any of have value
                // case 1.3 handling frmn and aspect base chart
                var result = new DashboardChart();
                if (isFrmn)
                {
                    return _dashboardDB.GetFrmnChart(corpsId, divisionId, DaysMonthFilter.Months12, filterModel);
                }
                else
                {
                    return _dashboardDB.GetAspectChart(corpsId, divisionId, DaysMonthFilter.Months12, filterModel);
                }

            }
            // case 2 role is belonging to corps
            else
            {
                return null;
            }
        }
        public DashboardChart GetIndicatorData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel,bool isTopTen = true)
        {
            if (isTopTen)
            {
                return _dashboardDB.GetTop10Indicator(corpsId, divisionId, filterModel);
            }
            else
            {
                return _dashboardDB.GetTop5IndicatorLast7Days(corpsId, divisionId, filterModel);
            }
        }
        public DashboardChart GetTopFiveLocation(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isTopFive7Days = true)
        {
                return _dashboardDB.GetTopFiveLocation(corpsId, divisionId, filterModel, isTopFive7Days);
            
        }
    }
}
