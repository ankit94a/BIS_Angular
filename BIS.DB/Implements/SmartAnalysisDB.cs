using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using Microsoft.EntityFrameworkCore;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
    public class SmartAnalysisDB : ISmartAnalysisDB
    {
        private readonly AppDBContext _dbContext;
        public SmartAnalysisDB(AppDBContext appDBContext) 
        { 
            _dbContext = appDBContext;
        }
        public DashboardChart Get30DaysFmnData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel,bool isLastYear = false)
        {
            var chart = new DashboardChart();

            var endDate = DateTime.UtcNow;
            var startDate = DateTime.UtcNow.AddMonths(-1);
            if (isLastYear)
            {
                endDate = DateTime.UtcNow.AddYears(-1);
                startDate = endDate.AddMonths(-1);
            }

            var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn >= startDate.Date && ms.CreatedOn <= endDate.Date);

            // handling filter arrays 
            if (filterModel != null && filterModel.Sector?.Count > 0)
            {
                query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
            }
            if (filterModel != null && filterModel.Aspects?.Count > 0)
            {
                query = query.Where(ms => filterModel.Aspects.Contains(ms.Aspect));
            }
            if (filterModel != null && filterModel.Indicator?.Count > 0)
            {
                query = query.Where(ms => filterModel.Indicator.Contains(ms.Indicator));
            }

            var result = query.GroupBy(ms => ms.CreatedOn.Value.Date).Select(group => new
            {
                Date = group.Key,
                Count = group.Count()
            }).ToList();

            foreach (var item in result)
            {
              chart.Name.Add(item.Date.ToString("dd-MM-yyyy"));
              chart.Count.Add(item.Count);
            }
            return chart;
        }
        public DashboardChart Get30DaysAspectData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isLastYear = false)
        {
            var chart = new DashboardChart();
            var endDate = DateTime.UtcNow;
            var startDate = DateTime.UtcNow.AddMonths(-1);
            if (isLastYear)
            {
                endDate = DateTime.UtcNow.AddYears(-1);
                startDate = endDate.AddMonths(-1);
            }

            var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn >= startDate.Date && ms.CreatedOn <= endDate.Date);

            // handling filter arrays 
            if (filterModel != null && filterModel.Sector?.Count > 0)
            {
                query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
            }
            if (filterModel != null && filterModel.Aspects?.Count > 0)
            {
                query = query.Where(ms => filterModel.Aspects.Contains(ms.Aspect));
            }
            if (filterModel != null && filterModel.Indicator?.Count > 0)
            {
                query = query.Where(ms => filterModel.Indicator.Contains(ms.Indicator));
            }

            var result = query.GroupBy(ms => ms.Aspect).Select(group => new
            {
                Aspect = group.Key,
                Count = group.Count()
            }).ToList();

            foreach (var item in result)
            {
                chart.Name.Add(item.Aspect);
                chart.Count.Add(item.Count);
            }
            return chart;
        }
        public DashboardChart Get30DaysIndicatorData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isLastYear = false)
        {
            var chart = new DashboardChart();
            var endDate = DateTime.UtcNow;
            var startDate = DateTime.UtcNow.AddMonths(-1);
            if (isLastYear)
            {
                endDate = DateTime.UtcNow.AddYears(-1);
                startDate = endDate.AddMonths(-1);
            }

            var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn >= startDate.Date && ms.CreatedOn <= endDate.Date);

            // handling filter arrays 
            if (filterModel != null && filterModel.Sector?.Count > 0)
            {
                query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
            }
            if (filterModel != null && filterModel.Aspects?.Count > 0)
            {
                query = query.Where(ms => filterModel.Aspects.Contains(ms.Aspect));
            }
            if (filterModel != null && filterModel.Indicator?.Count > 0)
            {
                query = query.Where(ms => filterModel.Indicator.Contains(ms.Indicator));
            }

            var result = query.GroupBy(ms => ms.Indicator).Select(group => new
            {
                Indicator = group.Key,
                Count = group.Count()
            }).ToList();

            foreach (var item in result)
            {
                chart.Name.Add(item.Indicator);
                chart.Count.Add(item.Count);
            }
            return chart;
        }

    }
}
