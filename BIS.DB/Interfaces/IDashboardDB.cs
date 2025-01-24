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
        public DashboardInputCount GetInputCounts(int corpsId, int divisionId);
        public List<MasterData> GetDivisionFrmChart(long corpsId, long divisionId, FilterModel filterModel);
        public DashboardChart GetAllMasterDataCount(long corpsId,long divisionId);
        public DashboardChart GetFrmnChart(long corpsId, long divisionId, DaysMonthFilter daysMonthFilter, FilterModel filterModel);
        public DashboardChart GetAspectChart(long corpsId, long divisionId, DaysMonthFilter daysMonthFilter, FilterModel filterModel);
        public DashboardChart GetTop10Indicator(long corpsId, long divisionId, FilterModel filterModel);
        public DashboardChart GetTop5IndicatorLast7Days(long corpsId, long divisionId, FilterModel filterModel);
        public DashboardChart GetTopFiveLocation(long corpsId, long divisionId, FilterModel filterModel, bool isTopFive7Days = true);
    }
}
