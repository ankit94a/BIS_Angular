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
    public class SmartAnalysisManager : ISmartAnalysisManager
    {
        private readonly ISmartAnalysisDB _smartAnalysisDB;
        public SmartAnalysisManager(ISmartAnalysisDB smartAnalysisDB) 
        { 
            _smartAnalysisDB = smartAnalysisDB;
        }
        public DashboardChart Get30DaysFmnData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel,bool isLastYear = false)
        {
            if(divisionId > 0)
            {
                return _smartAnalysisDB.Get30DaysFmnData(corpsId,divisionId,roleType,filterModel,isLastYear);
            }
            else
            {
                return new DashboardChart();
            }
        }
        public DashboardChart Get30DaysAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isLastYear = false)
        {
            if (divisionId > 0)
            {
                return _smartAnalysisDB.Get30DaysAspectData(corpsId, divisionId, roleType, filterModel, isLastYear);
            }
            else
            {
                return new DashboardChart();
            }
        }
        public DashboardChart Get30DaysIndicatorData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isLastYear = false)
        {
            if (divisionId > 0)
            {
                return _smartAnalysisDB.Get30DaysIndicatorData(corpsId, divisionId, roleType, filterModel, isLastYear);
            }
            else
            {
                return new DashboardChart();
            }
        }
    }
}
