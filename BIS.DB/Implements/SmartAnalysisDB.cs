using System;
using System.Collections.Generic;
using System.Globalization;
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

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date && ms.Status == Status.Approved);

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

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date && ms.Status == Status.Approved);

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

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date && ms.Status == Status.Approved);

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
		
		public async Task<MeanValueModel> GetEntries(long corpsId, long divisionId, RoleType roleType, FilterModelEntries filterModel)
		{
			var chart = new MeanValueModel();
			try
			{
				var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.IsActive && ms.Status == Status.Approved);

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
						.Where(ms => ms.Status == Status.Approved)
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
					var allData = await query
						.Where(ms => ms.CreatedOn.HasValue && ms.Status == Status.Approved)
						.ToListAsync(); // Fetch data first

					if (allData.Any())
					{
						groupedQuery = allData
							.GroupBy(ms => new {
								Year = ms.CreatedOn.Value.Year,
								Week = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
									ms.CreatedOn.Value,
									CalendarWeekRule.FirstFourDayWeek,
									DayOfWeek.Monday
								)
							})
							.Select(group => new GroupedData
							{
								Date = $"{group.Key.Year}-W{group.Key.Week:D2}",
								Count = group.Count()
							})
							.ToList();
					}
				}
				else if (filterModel.FilterType == FilterType.Monthly)
				{
					groupedQuery = await query
						.Where(ms => ms.Status == Status.Approved)
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
					if (groupedQuery.Any()) // ✅ Prevents First() error
					{
						var firstEntry = groupedQuery.First().Date; // Example: "2025-W06"
						var firstYear = int.Parse(firstEntry.Split('-')[0]); // "2025"
						var firstWeek = int.Parse(firstEntry.Split('W')[1]); // "06"

						// ✅ Convert Year + Week Number to a Real Date
						DateTime firstWeekDate = FirstDateOfWeekISO8601(firstYear, firstWeek);

						totalDays = (today - firstWeekDate).Days / 7;
					}
					else
					{
						totalDays = 1; // Avoid division by zero
					}
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
			catch (Exception ex)
			{
				Console.WriteLine($"ERROR in GetEntries: {ex.Message}");
				Console.WriteLine($"STACK TRACE: {ex.StackTrace}");
				throw;
			}
		}
		private static DateTime FirstDateOfWeekISO8601(int year, int weekNumber)
		{
			DateTime jan1 = new DateTime(year, 1, 1);
			int daysOffset = DayOfWeek.Thursday - jan1.DayOfWeek;

			DateTime firstThursday = jan1.AddDays(daysOffset);
			var calendar = CultureInfo.CurrentCulture.Calendar;

			int firstWeek = calendar.GetWeekOfYear(firstThursday, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
			int weekNum = (weekNumber == 1 && firstWeek > 1) ? weekNumber - 1 : weekNumber;

			return firstThursday.AddDays((weekNum - 1) * 7 - 3);
		}
		
		public DashboardChart GetVariationData(long corpsId, long divisionId, RoleType roleType, FilterModel filterModel)
		{
			var chart = new DashboardChart();

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.Status == Status.Approved);

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
