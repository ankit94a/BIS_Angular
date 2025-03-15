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

			//var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date && ms.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.ReportedDate.Date >= startDate.Date && ms.ReportedDate.Date <= endDate.Date).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));
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

			//var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date && ms.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.ReportedDate.Date >= startDate.Date && ms.ReportedDate.Date <= endDate.Date).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

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

			//var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.CreatedOn.Value.Date >= startDate.Date && ms.CreatedOn.Value.Date <= endDate.Date && ms.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved  && ms.ReportedDate.Date >= startDate.Date && ms.ReportedDate.Date <= endDate.Date).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));
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
				var query = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.CreatedOn.HasValue && ms.IsActive);

				var filteredMasterData = await query.ToListAsync(); // Ensures we fetch data asynchronously

				// Ensure filterModel.Frmn exists before calling Any()
				if (filterModel?.Frmn != null && filterModel.Frmn.Any())
				{
					filteredMasterData = filteredMasterData
						.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId))
						.ToList();
				}

				// Apply additional filters
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

				// Grouping logic remains unchanged
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

				// Avoid First() errors by checking if data exists before accessing it
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

		public DashboardChart GetVariationData(RoleType roleType, FilterModel filterModel)
		{
			var chart = new DashboardChart();

			//var query = _dbContext.MasterDatas.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId && ms.Status == Status.Approved);
			var filteredMasterData = _dbContext.MasterDatas.Where(ms => ms.Status == Status.Approved && ms.IsActive).ToList();
			var query = filteredMasterData.Where(ms => filterModel.Frmn.Any(f => f.CorpsId == ms.CorpsId && f.DivisionId == ms.DivisionId));

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
					ms.ReportedDate.Date >= filterModel.startDate.Value.Date &&
					ms.ReportedDate.Date <= filterModel.endDate.Value.Date
				);
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


	}
}
