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
		public DashboardChart Get30DaysFmnData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel, bool isLastYear = false)
		{
			var chart = new DashboardChart();

			var endDate = DateTime.UtcNow;
			var startDate = DateTime.UtcNow.AddMonths(-1);
			if (isLastYear)
			{
				endDate = DateTime.UtcNow.AddYears(-1);
				startDate = endDate.AddMonths(-1);
			}

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date);

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

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date);

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

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date);

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
		//public async Task<MeanValueModel> GetEntries(long corpsId, long divisionId, RoleType roleType, FilterModelEntries filterModel)
		//{
		//	var chart = new MeanValueModel();
		//	var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId);
		//	if (filterModel != null && filterModel.Sector?.Count > 0)
		//	{
		//		query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
		//	}
		//	if (filterModel != null && filterModel.Aspects?.Count > 0)
		//	{
		//		query = query.Where(ms => filterModel.Aspects.Contains(ms.Aspect));
		//	}
		//	if (filterModel != null && filterModel.Indicator?.Count > 0)
		//	{
		//		query = query.Where(ms => filterModel.Indicator.Contains(ms.Indicator));
		//	}
		//	var result = query.GroupBy(ms => ms.CreatedOn.Value.Date).Select(group => new
		//	{
		//		Date = group.Key,
		//		Count = group.Count()
		//	}).ToList();

		//	var totalEntries = await query.CountAsync();
		//	var totalDays = 0;
		//	var today = DateTime.Today;
		//	if (filterModel.FilterType == FilterType.Daily)
		//	{
		//		totalDays = result.Count();
		//	}
		//	else if (filterModel.FilterType == FilterType.Weekly)
		//	{
		//		totalDays = (today - result[0].Date).Days / 7;
		//	}
		//	else
		//	{
		//		totalDays = ((today.Year - result[0].Date.Year) * 12 + today.Month - result[0].Date.Month);

		//	}

		//	var meanValue = totalDays > 0 ? (double)totalEntries / totalDays : 0;


		//	foreach (var item in result)
		//	{
		//		chart.Name.Add(item.Date.ToString("dd-MM-yyyy"));
		//		chart.Count.Add(item.Count);
		//		chart.MeanValue.Add(meanValue);
		//	}
		//	return chart;
		//}

		public async Task<MeanValueModel> GetEntries(long corpsId, long divisionId, RoleType roleType, FilterModelEntries filterModel)
		{
			var chart = new MeanValueModel();
			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.IsActive);

			// Handling filter arrays
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

			// Dynamically group by filter type (Daily, Weekly, Monthly)
			var groupedQuery = new List<GroupedData>();
			if (filterModel.FilterType == FilterType.Daily)
			{
				groupedQuery = await query
					.GroupBy(ms => ms.CreatedOn.Value.Date)
					.Select(group => new GroupedData
					{
						Date = group.Key.ToString("yyyy-MM-dd"),
						Count = group.Count()
					})
					.ToListAsync();
			}
			else if (filterModel.FilterType == FilterType.Weekly)
			{
				var week = GetWeekOfYear(DateTime.Now);
				groupedQuery = await query
					.GroupBy(ms => new { Year = ms.CreatedOn.Value.Year, Week = GetWeekOfYear(ms.CreatedOn.Value) })
					.Select(group => new GroupedData
					{
						Date = $"{group.Key.Year}-W{group.Key.Week:D2}",
						Count = group.Count()
					})
					.ToListAsync();
			}
			else if (filterModel.FilterType == FilterType.Monthly)
			{
				groupedQuery = await query
					.GroupBy(ms => new { Year = ms.CreatedOn.Value.Year, Month = ms.CreatedOn.Value.Month })
					.Select(group => new GroupedData
					{
						Date = $"{group.Key.Year}-{group.Key.Month:D2}",
						Count = group.Count()
					})
					.ToListAsync();
			}

			var totalEntries = await query.CountAsync();
			var totalDays = 0;
			var today = DateTime.Today;

			// Calculate totalDays based on the filter type (Daily, Weekly, Monthly)
			if (filterModel.FilterType == FilterType.Daily)
			{
				totalDays = groupedQuery.Count();
			}
			else if (filterModel.FilterType == FilterType.Weekly)
			{
				// Calculate weeks difference between today and the first week in the result
				totalDays = (today - DateTime.Parse(groupedQuery.First().Date.Split('-')[0])).Days / 7;
			}
			else if (filterModel.FilterType == FilterType.Monthly)
			{
				// Calculate months difference between today and the first month in the result
				totalDays = ((today.Year - int.Parse(groupedQuery.First().Date.Split('-')[0])) * 12
							  + today.Month - int.Parse(groupedQuery.First().Date.Split('-')[1]));
			}

			// Avoid division by zero in case no valid days are found
			var meanValue = totalDays > 0 ? (double)totalEntries / totalDays : 0;

			// Add chart data
			foreach (var item in groupedQuery)
			{
				chart.Name.Add(item.Date);
				chart.Count.Add(item.Count);
				chart.MeanValue.Add(meanValue);
			}

			return chart;
		}

		// Helper function to get the week number of the year from a DateTime
		public int GetWeekOfYear(DateTime date)
		{
			var calendar = System.Globalization.CultureInfo.CurrentCulture.Calendar;
			var dayOfYear = calendar.GetDayOfYear(date);
			return (dayOfYear / 7) + 1;  // Calculate week of year
		}

		public DashboardChart GetVariationData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel)
		{
			var chart = new DashboardChart();

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId);

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
			if (filterModel != null && filterModel.startDate.HasValue && filterModel.endDate.HasValue && filterModel.endDate >= filterModel.startDate)
			{
				query = query.Where(ms =>
					ms.CreatedOn.Value.Date >= filterModel.startDate.Value.Date &&
					ms.CreatedOn.Value.Date <= filterModel.endDate.Value.Date
				);
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


	}
}
