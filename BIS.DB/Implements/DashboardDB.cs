﻿using System;
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
	public class DashboardDB : IDashboardDB
	{
		private readonly AppDBContext _dbContext;
		public DashboardDB(AppDBContext dbContext)
		{
			_dbContext = dbContext;
		}
		public DashboardInputCount GetInputCounts(int corpsId, int divisionId = 0)
		{
			var result = new DashboardInputCount();
			var currentTime = DateTime.Now;
			var last7Days = currentTime.AddDays(-7);

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.Status == Status.Approved);
			if (divisionId > 0)
			{
				query = query.Where(ms => ms.DivisionId == divisionId);
			}

			var counts = query
				.GroupBy(ms => new
				{
					IsToday = ms.CreatedOn.Value.Date >= currentTime.Date,
					IsLast7Days = ms.CreatedOn.Value.Date >= last7Days.Date
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

			return result;
		}

		public DashboardChart GetFrmnChart(long corpsId, long divisionId, DaysMonthFilter daysMonthFilter, FilterModel filterModel)
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

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.Status == Status.Approved);
			// handling Today, last30Days and All
			if (filterDate.HasValue)
			{
				query = daysMonthFilter == DaysMonthFilter.Today
					? query.Where(ms => ms.CreatedOn.Value.Date == DateTime.UtcNow.Date)
					: query.Where(ms => ms.CreatedOn >= filterDate.Value);
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
				result = query.Where(m => (long)m.CorpsId == corpsId && (long?)m.DivisionId == divisionId).Where(m => m.CreatedOn >= filterDate)
								.GroupBy(m => new { Year = m.CreatedOn.Value.Year, Month = m.CreatedOn.Value.Month })
								.Select(g => new
								{
									MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM") + " " + g.Key.Year,
									Count = g.Count(),
									Year = g.Key.Year,
									Month = g.Key.Month
								})
								.OrderBy(e0 => e0.Year)
								.ThenBy(e0 => e0.Month)
								.Select(e0 => new
								{
									MonthYear = e0.MonthYear,
									Count = e0.Count
								}).ToList();

				foreach (var item in result)
				{
					if (item.MonthYear != "" && item.MonthYear != null)
					{
						chart.Name.Add(item.MonthYear);
						chart.Count.Add(item.Count);
					}
				}
				return chart;
			}
		}

		public DashboardChart GetAspectChart(long corpsId, long divisionId, DaysMonthFilter daysMonthFilter, FilterModel filterModel)
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

			var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.Status == Status.Approved);
			// handling Today, last30Days and All
			if (filterDate.HasValue)
			{
				query = daysMonthFilter == DaysMonthFilter.Today
					? query.Where(ms => ms.CreatedOn.Value.Date == DateTime.UtcNow.Date)
					: query.Where(ms => ms.CreatedOn >= filterDate.Value);
			}
			// handling sector filter
			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(ms => filterModel.Sector.Contains(ms.Sector));
			}
			IEnumerable<dynamic> result;
			if (daysMonthFilter == DaysMonthFilter.Months12)
			{
				result = query.Where(m => m.Aspect != null && m.Aspect != "" && m.CreatedOn >= filterDate)
								.GroupBy(m => new { Year = m.CreatedOn.Value.Year, Month = m.CreatedOn.Value.Month })
								.Select(g => new
								{
									MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM") + " " + g.Key.Year,
									Count = g.Count(),
									Year = g.Key.Year,
									Month = g.Key.Month,
								})
								.OrderBy(e => e.Year)
								.ThenBy(e => e.Month)
								.Select(e => new
								{
									MonthYear = e.MonthYear,
									Count = e.Count,
								}).ToList();

				foreach (var item in result)
				{
					if (item.MonthYear != "" && item.MonthYear != null)
					{
						chart.Name.Add(item.MonthYear);
						chart.Count.Add(item.Count);
					}
				}
				return chart;
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
		public DashboardChart GetSectorWiseData(long corpsId, long divisionId, FilterModel filterModel, DaysMonthFilter daysMonthFilter)
		{
			var chart = new DashboardChart();
			var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.Sector != null && m.Sector != "" && m.Status == Status.Approved);
			DateTime today = DateTime.UtcNow;

			// Apply filters based on `daysMonthFilter`
			if (daysMonthFilter == DaysMonthFilter.Today)
			{
				query = query.Where(m => m.CreatedOn.Value.Date == today.Date);
			}
			else if (daysMonthFilter == DaysMonthFilter.Days30)
			{
				DateTime past30Days = today.AddDays(-30);
				query = query.Where(m => m.CreatedOn.Value.Date >= past30Days.Date);
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
		public DashboardChart Get12MonthsSectorData(long corpsId, long divisionId, FilterModel filterModel)
		{
			var chart = new DashboardChart();
			DateTime today = DateTime.UtcNow;
			DateTime filterDate = today.AddMonths(-12);

			var query = _dbContext.MasterDatas
				.Where(m => m.CorpsId == corpsId &&
							m.DivisionId == divisionId &&
							!string.IsNullOrEmpty(m.Sector) &&
							m.CreatedOn >= filterDate && m.Status == Status.Approved);

			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(m => filterModel.Sector.Contains(m.Sector));
			}

			var result = query.GroupBy(m => new { m.CreatedOn.Value.Year, m.CreatedOn.Value.Month, m.Sector })
				.Select(g => new
				{
					Sector = g.Key.Sector,
					MonthYear = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
					Count = g.Count(),
					Year = g.Key.Year,
					Month = g.Key.Month
				})
				.OrderBy(e => e.Year).ThenBy(e => e.Month)
				.ToList();

			chart.Name = result
				.Select(r => r.MonthYear)
				.Distinct()
				.OrderBy(m => DateTime.ParseExact(m, "MMM yyyy", System.Globalization.CultureInfo.InvariantCulture))
				.ToList();

			var uniqueSectors = result.Select(r => r.Sector).Distinct().ToList();
			chart.SectorData = uniqueSectors.Select(sector => new DashboardSectorData
			{
				Sector = sector,
				Count = chart.Name.Select(month =>
					result.FirstOrDefault(r => r.MonthYear == month && r.Sector == sector)?.Count ?? 0
				).ToList()
			}).ToList();
			return chart;
		}

		public DashboardChart GetTop10Indicator(long corpsId, long divisionId, FilterModel filterModel)
		{
			var chart = new DashboardChart();
			var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.Indicator != null && m.Indicator != "" && m.Status == Status.Approved);

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
		public DashboardChart GetTop5IndicatorLast7Days(long corpsId, long divisionId, FilterModel filterModel)
		{
			var chart = new DashboardChart();

			var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.Indicator != null && m.Indicator != "" && m.CreatedOn.Value.Date >= DateTime.UtcNow.AddDays(-7).Date && m.Status == Status.Approved);

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
		public DashboardChart GetTopFiveLocation(long corpsId, long divisionId, FilterModel filterModel, bool isTopFive7Days = true)
		{
			var chart = new DashboardChart();

			var query = _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.EnLocName != null && m.EnLocName != "" && m.Status == Status.Approved);

			if (isTopFive7Days)
			{
				query = query.Where(m => m.CreatedOn.Value.Date >= DateTime.UtcNow.AddDays(-7).Date);
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
