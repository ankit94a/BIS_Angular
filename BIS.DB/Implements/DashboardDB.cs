using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
	public class DashboardDB : IDashboardDB
	{
		private readonly AppDBContext _dbContext;
		private readonly ICorpsDB _corpsDB;
		public DashboardDB(ICorpsDB corpsDB, AppDBContext dbContext)
		{
			_dbContext = dbContext;
			_corpsDB = corpsDB;
		}
		public List<FmnModel> GetFmnDetails(int corpsId, int divisionId)
		{
			var Fmn = new List<FmnModel>();
			if (divisionId == 0)
			{
				//var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId).FirstOrDefault();

				var corps = _corpsDB.GetCorpsById(corpsId);
				var divisionList = _corpsDB.GetDivisonByCorps(corpsId);

				foreach (var f in divisionList)
				{
					var frmn = new FmnModel();
					frmn.Name = f.Name;
					frmn.CorpsId = f.CorpsId;
					frmn.DivisionId = f.Id;
					Fmn.Add(frmn);
				}
				var temp = new FmnModel();
				temp.Name = corps.Name;
				temp.CorpsId = corps.Id;
				temp.DivisionId = 0;
				Fmn.Add(temp);

			}
			else
			{

				var division = _corpsDB.GetDivisonDetails(corpsId, divisionId);
				var temp = new FmnModel();
				temp.DivisionId = division.Id;
				temp.CorpsId = division.CorpsId;
				temp.Name = division.Name;
				Fmn.Add(temp);
			}
			return Fmn;
		}
		public DashboardInputCount GetInputCounts(FilterModel filterModel, int corpsId, int divisionId)
		{
			var result = new DashboardInputCount();
			var currentTime = DateTime.Now;
			var last7Days = currentTime.AddDays(-7);

			if (divisionId == 0)
			{
				var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved).ToList();
				var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId)).ToList();

				var counts = query
					.GroupBy(ms => new
					{
						IsToday = ms.ReportedDate.Date >= currentTime.Date,
						IsLast7Days = ms.ReportedDate.Date >= last7Days.Date
					})
					.Select(g => new
					{
						g.Key.IsToday,
						g.Key.IsLast7Days,
						Count = g.Count()
					})
					.ToList();

				// Extract counts from the grouped data
				result.TotalInputCount = query.Count();
				result.Last7DaysCount = counts.Where(c => c.IsLast7Days).Sum(c => c.Count);
				result.TodayCount = counts.Where(c => c.IsToday).Sum(c => c.Count);
			}
			else
			{
				var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.Status == Status.Approved && ms.DivisionId == divisionId);
				var counts = query
					.GroupBy(ms => new
					{
						IsToday = ms.ReportedDate.Date >= currentTime.Date,
						IsLast7Days = ms.ReportedDate.Date >= last7Days.Date
					})
					.Select(g => new
					{
						g.Key.IsToday,
						g.Key.IsLast7Days,
						Count = g.Count()
					})
					.ToList();

				// Extract counts from the grouped data
				result.TotalInputCount = query.Count();
				result.Last7DaysCount = counts.Where(c => c.IsLast7Days).Sum(c => c.Count);
				result.TodayCount = counts.Where(c => c.IsToday).Sum(c => c.Count);
			}

			return result;
		}
		//public DashboardChart GetFrmnChart(DaysMonthFilter daysMonthFilter, FilterModel filterModel)
		//{
		//	var chart = new DashboardChart();
		//	DateTime? filterDate = null;
		//	switch (daysMonthFilter)
		//	{
		//		case DaysMonthFilter.Days30:
		//			filterDate = DateTime.UtcNow.AddDays(-30);
		//			break;
		//		case DaysMonthFilter.Today:
		//			filterDate = DateTime.UtcNow.Date;
		//			break;
		//		case DaysMonthFilter.Months12:
		//			filterDate = DateTime.UtcNow.AddMonths(-12);
		//			break;
		//	}
		//	var query = _dbContext.MasterDatas
		//				.Where(ms => ms.Status == Status.Approved && ms.ReportedDate >= filterDate.Value);

		//	if (filterModel.Frmn.Any())
		//	{
		//		query = query.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));
		//	}

		//	var result = query
		//		.GroupBy(m => new { m.Frmn, Year = m.ReportedDate.Year, Month = m.ReportedDate.Month })
		//		.Select(g => new
		//		{
		//			Frmn = g.Key.Frmn,
		//			MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
		//			Count = g.Count(),
		//			Year = g.Key.Year,
		//			Month = g.Key.Month
		//		})
		//		.OrderBy(e0 => e0.Year)
		//		.ThenBy(e0 => e0.Month)
		//		.ToList();

		//	var uniqueMonths = result.Select(x => x.MonthYear).Distinct().ToList();
		//	chart.Name.AddRange(uniqueMonths);

		//	var groupedFrmn = result.GroupBy(x => x.Frmn);

		//	foreach (var group in groupedFrmn)
		//	{
		//		var frmnName = group.Key ?? "Unknown";
		//		var frmnCounts = uniqueMonths.Select(m => group.FirstOrDefault(g => g.MonthYear == m)?.Count ?? 0).ToList();

		//		chart.FrmnData[frmnName] = frmnCounts;
		//	}

		//	return chart;
		//}


		public DashboardChart GetFrmnChart(DaysMonthFilter daysMonthFilter, FilterModel filterModel)
		{
			var chart = new DashboardChart();
			DateTime? filterDate = null;
			switch (daysMonthFilter)
			{
				case DaysMonthFilter.Days30:
					filterDate = DateTime.UtcNow.AddDays(-30);
					break;
				case DaysMonthFilter.Today:
					filterDate = DateTime.UtcNow.Date;
					break;
				case DaysMonthFilter.Months12:
					filterDate = DateTime.UtcNow.AddMonths(-12);
					break;
			}

			//var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));
			// handling Today, last30Days and All
			if (filterDate.HasValue)
			{
				query = daysMonthFilter == DaysMonthFilter.Today
					? query.Where(ms => ms.ReportedDate.Date == DateTime.UtcNow.Date)
					: query.Where(ms => ms.ReportedDate >= filterDate.Value);
			}
			// handling sector filter
			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
			}
			IEnumerable<dynamic> result;
			if (daysMonthFilter != DaysMonthFilter.Months12)
			{
				result = query.GroupBy(ms => ms.Frmn).Select(group => new
				{
					Frmn = group.Key,
					Count = group.Count()
				}).ToList();

				foreach (var item in result)
				{
					if (item.Frmn != "" && item.Frmn != null)
					{
						chart.Name.Add(item.Frmn);
						chart.Count.Add(item.Count);
					}
				}
				return chart;
			}
			else
			{
				result = query.GroupBy(m => new { m.Frmn, Year = m.ReportedDate.Year, Month = m.ReportedDate.Month })
						   .Select(g => new
						   {
							   Frmn = g.Key.Frmn ?? "Unknown",
							   MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
							   Count = g.Count(),
							   Year = g.Key.Year,
							   Month = g.Key.Month
						   }).OrderBy(e0 => e0.Year).ThenBy(e0 => e0.Month).ToList();

				// Get unique months from the dataset
				var uniqueMonths = result.Select(x => x.MonthYear).Distinct().ToList();
				chart.Name.AddRange(uniqueMonths);

				// Initialize FrmnData dictionary
				chart.FrmnData = new Dictionary<dynamic, List<int>>();

				var groupedFrmn = result.GroupBy(x => x.Frmn);

				foreach (var group in groupedFrmn)
				{
					var frmnName = group.Key;

					// Ensure frmnCounts is of type List<int>
					var frmnCounts = uniqueMonths
						.Select(m => group.FirstOrDefault(g => g.MonthYear == m)?.Count ?? 0)
						.Cast<int>() // Explicitly cast to int
						.ToList();

					chart.FrmnData[frmnName] = frmnCounts;
				}

				return chart;



			}
		}

		public DashboardChart GetAspectChart(DaysMonthFilter daysMonthFilter, FilterModel filterModel)
		{
			var chart = new DashboardChart();
			DateTime? filterDate = null;
			switch (daysMonthFilter)
			{
				case DaysMonthFilter.Days30:
					filterDate = DateTime.UtcNow.AddDays(-30);
					break;
				case DaysMonthFilter.Today:
					filterDate = DateTime.UtcNow.Date;
					break;
				case DaysMonthFilter.Months12:
					filterDate = DateTime.UtcNow.AddMonths(-12);
					break;
			}

			//var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));
			// handling Today, last30Days and All
			if (filterDate.HasValue)
			{
				query = daysMonthFilter == DaysMonthFilter.Today
					? query.Where(ms => ms.ReportedDate.Date == DateTime.UtcNow.Date)
					: query.Where(ms => ms.ReportedDate >= filterDate.Value);
			}
			// handling sector filter
			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
			}
			IEnumerable<dynamic> result;
			if (daysMonthFilter == DaysMonthFilter.Months12)
			{
				// Fetch the data
				result = query
				   .Where(m => !string.IsNullOrEmpty(m.Aspect) && m.CreatedOn >= filterDate)
				   .GroupBy(m => new { m.Aspect, Year = m.ReportedDate.Year, Month = m.ReportedDate.Month })
				   .Select(g => new
				   {
					   Aspect = g.Key.Aspect ?? "Unknown", // Handle null values
					   MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
					   Count = g.Count(),
					   Year = g.Key.Year,
					   Month = g.Key.Month
				   })
				   .OrderBy(e => e.Year)
				   .ThenBy(e => e.Month)
				   .ToList();

				// Step 1: Extract unique Month-Year values **as List<string>**
				List<dynamic> monthNames = result.Select(e => (dynamic)e.MonthYear).Distinct().ToList();

				// Step 2: Ensure Aspect is always a **string** and count mapping is consistent
				var frmnData = result
					.GroupBy(e => e.Aspect) // Group by Aspect
					.ToDictionary(g => g.Key.ToString(), g => // Convert Aspect to string
					{
						// Create a dictionary of Month-Year with default count = 0
						var monthMap = monthNames.ToDictionary(m => m, _ => 0);

						// Populate actual counts from the result
						foreach (var entry in g)
						{
							monthMap[entry.MonthYear] = entry.Count;
						}

						return monthMap.Values.ToList(); // Ensure List<int>
					});

				// Step 3: Return the data in correct type
				return new DashboardChart
				{
					Name = monthNames, // List<string>
					FrmnData = frmnData // Dictionary<string, List<int>>
				};
			}

			else
			{
				result = query.Where(m => m.Aspect != null && m.Aspect != "").GroupBy(ms => ms.Aspect).Select(group => new
				{
					Aspect = group.Key,
					Count = group.Count()
				}).ToList();
				foreach (var item in result)
				{
					//if (item.Aspect != "" && item.Aspect != null)
					//{
					chart.Name.Add(item.Aspect);
					chart.Count.Add(item.Count);
					//}
				}
				return chart;
			}
		}
		public DashboardChart GetSectorWiseData(FilterModel filterModel, DaysMonthFilter daysMonthFilter)
		{
			var chart = new DashboardChart();
			//var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.Sector != null && m.Sector != "" && m.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.Sector != null && ms.Sector != "").ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

			DateTime today = DateTime.UtcNow;

			// Apply filters based on `daysMonthFilter`
			if (daysMonthFilter == DaysMonthFilter.Today)
			{
				query = query.Where(m => m.ReportedDate.Date == today.Date);
			}
			else if (daysMonthFilter == DaysMonthFilter.Days30)
			{
				DateTime past30Days = today.AddDays(-30);
				query = query.Where(m => m.ReportedDate.Date >= past30Days.Date);
			}
			// handling sector filter
			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
			}
			var result = query.GroupBy(ms => ms.Sector).Select(g => new { Sector = g.Key, Count = g.Count() })
					.OrderByDescending(g => g.Count)
					.Take(10).ToList();
			foreach (var item in result)
			{
				chart.Name.Add(item.Sector);
				chart.Count.Add(item.Count);
			}
			return chart;
		}
		public DashboardChart Get12MonthsSectorData(FilterModel filterModel)
		{
			var chart = new DashboardChart();
			DateTime today = DateTime.UtcNow;
			DateTime filterDate = today.AddMonths(-12);

			var filteredMasterData = _dbContext.MasterDatas
				.Where(ms => ms.Status == Status.Approved && !string.IsNullOrEmpty(ms.Sector) && ms.ReportedDate >= filterDate)
				.ToList();

			var query = filteredMasterData
				.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(m => filterModel.Sector.Contains(m.Sector));
			}

			// Group and process data
			var result = query.GroupBy(m => new { m.ReportedDate.Year, m.ReportedDate.Month, m.Sector })
				.Select(g => new
				{
					Sector = (dynamic)g.Key.Sector,  // Explicitly cast to dynamic
					MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
					Count = g.Count(),
					Year = g.Key.Year,
					Month = g.Key.Month
				})
				.OrderBy(e => e.Year).ThenBy(e => e.Month)
				.ToList();

			// Ensure Month-Year is treated as dynamic
			chart.Name = result
				.Select(r => (dynamic)r.MonthYear) // Convert to dynamic explicitly
				.Distinct()
				.OrderBy(m => DateTime.ParseExact((string)m, "MMM yyyy", System.Globalization.CultureInfo.InvariantCulture))
				.ToList();

			// Populate FrmnData with aspect-wise counts
			chart.FrmnData = result
				.GroupBy(r => r.Sector)
				.ToDictionary(
					g => g.Key, // Sector Name (dynamic)
					g =>
					{
						var monthMap = chart.Name.ToDictionary(m => m, m => 0); // Initialize all months with 0 counts

						foreach (var entry in g)
						{
							if (monthMap.ContainsKey(entry.MonthYear))
							{
								monthMap[entry.MonthYear] = entry.Count;
							}
						}

						return monthMap.Values.ToList(); // Return counts in correct order
					}
				);

			return chart;
		}


		public DashboardChart GetTop10Indicator(FilterModel filterModel)
		{
			var chart = new DashboardChart();
			//var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.Indicator != null && m.Indicator != "" && m.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.Indicator != null && ms.Indicator != "").ToList();

			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

			// handling sector filter
			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
			}
			var result = query.GroupBy(ms => ms.Indicator).Select(g => new { Indicator = g.Key, Count = g.Count() })
					.OrderByDescending(g => g.Count)
					.Take(10).ToList();
			foreach (var item in result)
			{
				chart.Name.Add(item.Indicator);
				chart.Count.Add(item.Count);
			}
			return chart;
		}
		public DashboardChart GetTop5IndicatorLast7Days(FilterModel filterModel)
		{
			var chart = new DashboardChart();

			//var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.Indicator != null && m.Indicator != "" && m.CreatedOn.Value.Date >= DateTime.UtcNow.AddDays(-7).Date && m.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.Indicator != null && ms.Indicator != "" && ms.ReportedDate.Date >= DateTime.UtcNow.AddDays(-7).Date).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
			}

			var result = query.GroupBy(ms => ms.Indicator).Select(g => new
			{
				Indicator = g.Key,
				Count = g.Count()
			})
				.OrderByDescending(g => g.Count).Take(5).ToList();

			foreach (var item in result)
			{
				chart.Name.Add(item.Indicator);
				chart.Count.Add(item.Count);
			}

			return chart;
		}
		public DashboardChart GetTopFiveLocation(FilterModel filterModel, bool isTopFive7Days = true)
		{
			var chart = new DashboardChart();
			if (filterModel == null || filterModel.Frmn == null || !filterModel.Frmn.Any())
			{
				// Handle the case where filterModel or filterModel.Frmn is null or empty
				return chart; // Return an empty chart or handle accordingly
			}
			//var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.EnLocName != null && m.EnLocName != "" && m.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.EnLocName != null && ms.EnLocName != "").ToList();
			if (filteredMasterData == null || !filteredMasterData.Any())
			{
				// Handle the case where filteredMasterData is empty (maybe return an empty chart)
				return chart;
			}
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

			if (isTopFive7Days)
			{
				query = query.Where(m => m.ReportedDate.Date >= DateTime.UtcNow.AddDays(-7).Date);
			}
			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
			}

			var result = query.GroupBy(ms => ms.EnLocName).Select(g => new
			{
				EnLocName = g.Key,
				Count = g.Count()
			})
				.OrderByDescending(g => g.Count).Take(5).ToList();

			foreach (var item in result)
			{
				chart.Name.Add(item.EnLocName);
				chart.Count.Add(item.Count);
			}

			return chart;
		}

	}
}
