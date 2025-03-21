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
				result = query.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId))
								.GroupBy(m => new { Year = m.ReportedDate.Year, Month = m.ReportedDate.Month })
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
				result = query.Where(m => m.Aspect != null && m.Aspect != "" && m.CreatedOn >= filterDate)
								.GroupBy(m => new { Year = m.ReportedDate.Year, Month = m.ReportedDate.Month })
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

			//var query = _dbContext.MasterDatas
			//	.Where(m => m.CorpsId == corpsId &&
			//				m.DivisionId == divisionId &&
			//				!string.IsNullOrEmpty(m.Sector) &&
			//				m.CreatedOn >= filterDate && m.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && !string.IsNullOrEmpty(ms.Sector) && ms.ReportedDate >= filterDate).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

			if (filterModel != null && filterModel.Sector.Count > 0)
			{
				query = query.Where(m => filterModel.Sector.Contains(m.Sector));
			}

			var result = query.GroupBy(m => new { m.ReportedDate.Year, m.ReportedDate.Month, m.Sector })
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
