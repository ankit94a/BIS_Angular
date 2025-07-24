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
		public DashboardChart Get30DaysFmnData(RoleType roleType, FilterModel filterModel, bool isLastYear = false)
		{
			var chart = new DashboardChart();

			var endDate = DateTime.UtcNow;
			var startDate = DateTime.UtcNow.AddMonths(-1);
			if (isLastYear)
			{
				endDate = DateTime.UtcNow.AddYears(-1);
				startDate = endDate.AddMonths(-1);
			}

			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.ReportedDate.Date >= startDate.Date && ms.ReportedDate.Date <= endDate.Date).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));
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

			var result = query.GroupBy(ms => ms.ReportedDate.Date).Select(group => new
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
		public DashboardChart Get30DaysAspectData(RoleType roleType, FilterModel filterModel, bool isLastYear = false)
		{
			var chart = new DashboardChart();
			var endDate = DateTime.UtcNow;
			var startDate = DateTime.UtcNow.AddMonths(-1);
			if (isLastYear)
			{
				endDate = DateTime.UtcNow.AddYears(-1);
				startDate = endDate.AddMonths(-1);
			}

			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.ReportedDate.Date >= startDate.Date && ms.ReportedDate.Date <= endDate.Date).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

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

			var result = query.GroupBy(ms => ms.ReportedDate.Date).Select(group => new
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
		public DashboardChart Get30DaysIndicatorData(RoleType roleType, FilterModel filterModel, bool isLastYear = false)
		{
			var chart = new DashboardChart();
			var endDate = DateTime.UtcNow;
			var startDate = DateTime.UtcNow.AddMonths(-1);
			if (isLastYear)
			{
				endDate = DateTime.UtcNow.AddYears(-1);
				startDate = endDate.AddMonths(-1);
			}

			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.ReportedDate.Date >= startDate.Date && ms.ReportedDate.Date <= endDate.Date).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));
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

			var result = query.GroupBy(ms => ms.ReportedDate.Date).Select(group => new
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

		public async Task<MeanValueModel> GetEntries(RoleType roleType, FilterModelEntries filterModel)
		{
			var chart = new MeanValueModel();
			try
			{
				var query = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.IsActive);

				var filteredMasterData = await query.ToListAsync(); // Ensures we fetch data asynchronously

				if (filterModel?.Frmn != null && filterModel.Frmn.Any())
				{
					filteredMasterData = filteredMasterData
						.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId)).OrderBy(ms => ms.ReportedDate)
						.ToList();
				}

				if (filterModel?.Sector?.Any() == true)
				{
					filteredMasterData = filteredMasterData.Where(ms => filterModel.Sector.Contains(ms.Sector)).ToList();
				}
				if (filterModel?.Aspects?.Any() == true)
				{
					filteredMasterData = filteredMasterData.Where(ms => filterModel.Aspects.Contains(ms.Aspect)).ToList();
				}
				if (filterModel?.Indicator?.Any() == true)
				{
					filteredMasterData = filteredMasterData.Where(ms => filterModel.Indicator.Contains(ms.Indicator)).ToList();
				}

				var groupedQuery = new List<GroupedData>();

				if (filterModel?.FilterType == FilterType.Daily)
				{
					groupedQuery = filteredMasterData
						.GroupBy(ms => ms.ReportedDate.Date)
						.Select(group => new GroupedData
						{
							Date = group.Key.ToString("yyyy-MM-dd"),
							Count = group.Count()
						})
						.ToList();
				}
				else if (filterModel?.FilterType == FilterType.Weekly)
				{
					groupedQuery = filteredMasterData
						.GroupBy(ms => new
						{
							Year = ms.ReportedDate.Year,
							Week = System.Globalization.CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
								ms.ReportedDate, System.Globalization.CalendarWeekRule.FirstDay, DayOfWeek.Monday)
						})
						.Select(group => new GroupedData
						{
							Date = $"Week {group.Key.Week}, {group.Key.Year}",
							Count = group.Count()
						})
						.ToList();
				}
				else if (filterModel?.FilterType == FilterType.Monthly)
				{
					groupedQuery = filteredMasterData
						.GroupBy(ms => new { Year = ms.ReportedDate.Year, Month = ms.ReportedDate.Month })
						.Select(group => new GroupedData
						{
							Date = $"{group.Key.Year}-{group.Key.Month:D2}",
							Count = group.Count()
						})
						.ToList();
				}

				var totalDays = groupedQuery.Any() ? groupedQuery.Count() : 1;
				var totalEntries = filteredMasterData.Count;
				var meanValue = totalDays > 0 ? (double)totalEntries / totalDays : 0;

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

		public VaritaionChart GetVariationData(RoleType roleType, List<VaritaionFilter> filterModels)
		{
			var chart = new VaritaionChart();
			var allDates = new HashSet<DateTime>();

			// Load master data once
			var filteredMasterData = _dbContext.MasterDatas
				.Where(ms => ms.Status == Status.Approved && ms.IsActive)
				.ToList();

			foreach (var filter in filterModels)
			{
				if (filter?.Frmn == null)
					continue;

				var frmnItem = filter.Frmn;

				var query = filteredMasterData
					.Where(ms => ms.CorpsId == frmnItem.CorpsId && ms.DivisionId == frmnItem.DivisionId);

				if (filter.Sector?.Any() == true)
					query = query.Where(ms => filter.Sector.Contains(ms.Sector));

				if (filter.Aspects?.Any() == true)
					query = query.Where(ms => filter.Aspects.Contains(ms.Aspect));

				if (filter.Indicator?.Any() == true)
					query = query.Where(ms => filter.Indicator.Contains(ms.Indicator));

				if (filter.startDate.HasValue && filter.endDate.HasValue)
				{
					var start = filter.startDate.Value.Date;
					var end = filter.endDate.Value.Date;
					query = query.Where(ms => ms.ReportedDate.Date >= start && ms.ReportedDate.Date <= end);
				}

				var grouped = query
					.GroupBy(ms => ms.ReportedDate.Date)
					.Select(g => new { Date = g.Key, Count = g.Count() })
					.ToList();

				foreach (var item in grouped)
					allDates.Add(item.Date);

				var dateCountMap = grouped.ToDictionary(g => g.Date.ToString("dd-MM-yyyy"), g => g.Count);

				var series = new ChartSeries
				{
					Frmn = $"{frmnItem.Name}", 
					Data = new List<int>(),
					Tag = dateCountMap 
				};

				chart.Series.Add(series);
			}

			chart.Labels = allDates.OrderBy(d => d).Select(d => d.ToString("dd-MM-yyyy")).ToList();

			foreach (var series in chart.Series)
			{
				var dateCountMap = series.Tag as Dictionary<string, int>;
				series.Data = chart.Labels.Select(label => dateCountMap?.GetValueOrDefault(label) ?? 0).ToList();
				series.Tag = null; // Clear tag
			}

			return chart;
		}


		public List<MasterData> GetSingleEntriesChartData(RoleType roleType, FilterModelEntries filterModel)
		{
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.IsActive).ToList();

			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

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
				if (filterModel.FilterType == FilterType.Daily || filterModel.FilterType == FilterType.Weekly)
				{
					query = query.Where(ms =>
						ms.ReportedDate.Date >= filterModel.startDate.Value.Date &&
						ms.ReportedDate.Date <= filterModel.endDate.Value.Date
					);
				}

				else if (filterModel.FilterType == FilterType.Monthly)
				{
					filterModel.endDate = new DateTime(filterModel.startDate.Value.Year, filterModel.startDate.Value.Month, DateTime.DaysInMonth(filterModel.startDate.Value.Year, filterModel.startDate.Value.Month));

					query = query.Where(ms =>
						ms.ReportedDate.Date >= filterModel.startDate.Value.Date &&
						ms.ReportedDate.Date <= filterModel.endDate.Value.Date
					);
				}
			}
			return query.ToList();
		}
	}
}
