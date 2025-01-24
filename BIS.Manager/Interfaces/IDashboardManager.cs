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
        public DashboardInputCount GetInputCounts(int corpsId,int divisionId);
        public DashboardChart GetAllFmnOrAspectData(long corpsId,long divisionId,RoleType roleType, FilterModel filterModel,bool isFrmn = true);
        public DashboardChart Get30DaysFmnOrAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel,bool isFrmn = true);
        public DashboardChart GetTodayFmnOrAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isFrmn = true);
        public DashboardChart Get12MonthsFmnOrAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isFrmn = true);
        public DashboardChart GetIndicatorData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isTopTen = true);

        public DashboardChart GetTopFiveLocation(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isTopFive7Days = true);
    }
}
