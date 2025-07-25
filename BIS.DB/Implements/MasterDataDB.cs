﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.DB;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using static BIS.Common.Enum.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace BIS.DB.Implements
{
	public class MasterDataDB : IMasterDataDB, IBaseDB<MasterData>
	{
		private readonly AppDBContext _dbContext;
		public MasterDataDB(AppDBContext dbContext)
		{
			_dbContext = dbContext;
		}
		public List<MasterData> GetAll(long corpsId, long DivisonId)
		{
			return _dbContext.MasterDatas.Where(m => m.CorpsId == corpsId && m.DivisionId == DivisonId).ToList();
		}
		
		public List<MasterData> GetByUserId(int userId)
		{
			var result = _dbContext.MasterDatas.Where(m => m.CreatedBy == userId).ToList();
			return result;
		}
		public List<MasterData> GetByIds(List<int> idsList)
		{
			var result = _dbContext.MasterDatas.Where(m => idsList.Contains(m.ID)).ToList();
			return result;
		}
		public List<MasterData> GetAllMasterData()
		{
			return _dbContext.MasterDatas.ToList();
		}
		public long Add(MasterData masterData)
		{
			masterData.IsActive = true;
			_dbContext.MasterDatas.Add(masterData);
			_dbContext.SaveChanges();
			return masterData.ID;
		}

		public List<MasterData> GetBetweenDateRange(FilterModelEntries model, int corpsId, int divisionId = 0)
		{
			if (model.startDate == null || model.endDate == null)
			{
				throw new ArgumentException("StartDate and EndDate must be provided.");
			}

			var startDate = model.startDate.Value.Date;
			var endDate = model.endDate.Value.Date.AddDays(1).AddTicks(-1);
			if (model.FilterType == FilterType.Monthly)
			{
				endDate = model.startDate.Value.AddMonths(1).AddDays(-1);
			}
			var query = _dbContext.MasterDatas
				.Where(ms => ms.CorpsId == corpsId && ms.DivisionId == divisionId
						  && ms.ReportedDate.Date >= startDate
						  && ms.ReportedDate.Date <= endDate && ms.Status == Status.Approved);

			return query.ToList();
		}
		public List<MasterSector> GetSectorByCorpsId(int corpsId)
		{
			if (corpsId == 1)
				return _dbContext.Sector.ToList();
			return _dbContext.Sector.Where(ms => ms.CorpsId == corpsId).ToList();
		}
		public List<MasterInputLevel> GetInputLevels()
		{
			return _dbContext.MasterInputLevels.Where(mi => mi.IsActive).ToList();
		}
		public List<Source> GetSources()
		{
			return _dbContext.MasterSources.Where(ms => ms.IsActive).ToList();
		}
		public bool AddSource(Source source)
		{
			var result = _dbContext.MasterSources.Add(source);
			_dbContext.SaveChanges();
			if (result != null)
			{
				return true;
			}
			return false;
		}
		public List<MasterLocation> GetLocation(bool isSourceLoc)
		{
			if (isSourceLoc)
			{
				return _dbContext.MasterLocations.Where(ms => ms.IsActive && ms.CategoryLoc == Common.Enum.Enum.CategoryLoc.SourceLoc).ToList();
			}
			else
			{
				return _dbContext.MasterLocations.Where(ms => ms.IsActive && ms.CategoryLoc == Common.Enum.Enum.CategoryLoc.TypeOfLoc).ToList();
			}
		}
		public bool AddLocation(MasterLocation location)
		{
			var result = _dbContext.MasterLocations.Add(location);
			_dbContext.SaveChanges();
			if (result != null)
			{
				return true;
			}
			return false;
		}
		public async Task<long> UpdateStatus(int id, Status status)
		{
			var result = _dbContext.MasterDatas.Where(ms => ms.ID == id).FirstOrDefault();

			if (result != null)
			{
				result.Status = status;
				_dbContext.SaveChanges();
			}

			return result?.ID ?? 0;
		}
		public List<MasterData> GetUpto30MinForm()
		{
			var befor30Min = DateTime.Now.AddMinutes(-30);
			var query = _dbContext.MasterDatas.Where(ms => ms.CreatedOn >= befor30Min && ms.Status == Status.Created);
			return query.ToList();
		}
		public int GetUserIdByMasterDataId(int id)
		{
			var result = _dbContext.MasterDatas.Where(ms => ms.ID == id).FirstOrDefault();
			return result.CreatedBy;
		}
		public bool Deactive(long id, string tableName)
		{
			string query = $"UPDATE {tableName} SET isActive = 0 WHERE Id = @id";
			int rowsAffected = _dbContext.Database.ExecuteSqlRaw(query, new SqlParameter("@id", id));

			return rowsAffected > 0;
		}


		public List<EnemyLocation> GetAllEnemyLocation()
		{
			return _dbContext.MasterEnLocName.Where(ms => ms.IsActive).ToList();
		}
		public bool AddEnemyLocation(EnemyLocation enemyLocation)
		{
			var result = _dbContext.MasterEnLocName.Add(enemyLocation);
			_dbContext.SaveChanges();
			if (result != null)
			{
				return true;
			}
			return false;
		}

		public long Update(MasterData masterData)
		{
			var existing = _dbContext.MasterDatas.FirstOrDefault(ms => ms.ID == masterData.ID && ms.Status == Status.Created);
			if (existing != null)
			{
				_dbContext.Entry(existing).CurrentValues.SetValues(masterData);

				_dbContext.Entry(existing).Property(x => x.CreatedOn).IsModified = false;
				_dbContext.Entry(existing).Property(x => x.CreatedBy).IsModified = false;
				_dbContext.Entry(existing).Property(x => x.CorpsId).IsModified = false;
				_dbContext.Entry(existing).Property(x => x.DivisionId).IsModified = false;
				_dbContext.Entry(existing).Property(x => x.IsActive).IsModified = false;
				_dbContext.Entry(existing).Property(x => x.IsDeleted).IsModified = false;
				_dbContext.Entry(existing).Property(x => x.Status).IsModified = false;
				return _dbContext.SaveChanges();
			}

			return 0;
		}


		public MasterData GetBy(long Id, long CorpsId)
		{
			return _dbContext.MasterDatas.Where(ms => ms.ID == Id && ms.CorpsId == CorpsId).FirstOrDefault();
		}

		public async Task<(List<List<int>> Id, List<string> Labels, List<double> Data, List<double> Data2, List<string> Alerts, List<List<string>> FrmnsList, List<List<string>> SectorsList, List<List<string>> AspectsList, List<List<string>> IndicatorsList)> GetDailyAverageEntriesAsync(string frmn = null, string sector = null, string Aspects = null, string Indicator = null, DateTime? filterStartDate = null, DateTime? filterEndDate = null, int? Id = null)
		{
			var earliestEntryDate = await _dbContext.MasterDatas
				.OrderBy(m => m.ReportedDate)
				.Select(m => m.ReportedDate)
				.FirstOrDefaultAsync();

			var latestEntryDate = await _dbContext.MasterDatas
			.OrderByDescending(m => m.ReportedDate)
			.Select(m => m.ReportedDate)
			.FirstOrDefaultAsync();

			if (earliestEntryDate == default || latestEntryDate == default)
			{
				return (new List<List<int>>(), new List<string>(), new List<double>(), new List<double>(), new List<string>(), new List<List<string>>(), new List<List<string>>(), new List<List<string>>(), new List<List<string>>());
			}

			var startDate = filterStartDate ?? earliestEntryDate;
			var endDate = filterEndDate ?? latestEntryDate;

			if (endDate < startDate)
			{
				throw new ArgumentException("End date must be after or equal to the start date.");
			}

			var query = _dbContext.MasterDatas.AsQueryable();

			if (!string.IsNullOrEmpty(sector))
			{
				query = query.Where(m => m.Sector == sector);
			}
			if (!string.IsNullOrEmpty(Aspects))
			{
				query = query.Where(m => m.Aspect == Aspects);
			}
			if (!string.IsNullOrEmpty(Indicator))
			{
				query = query.Where(m => m.Indicator == Indicator);
			}
			if (!string.IsNullOrEmpty(frmn)) 
			{
				query = query.Where(m => m.Frmn == frmn);
			}

			var dailyData = await query
				.Where(m => m.ReportedDate >= startDate && m.ReportedDate <= endDate)
				.GroupBy(e => e.ReportedDate.Date)
				.OrderBy(g => g.Key)
				.Select(g => new
				{
					Date = g.Key.ToString("yyyy-MM-dd"),  
					Count = g.Count(),
					Frmns = g.Select(e => e.Frmn).Distinct().ToList(),
					Sectors = g.Select(e => e.Sector).Distinct().ToList(),
					Aspects = g.Select(e => e.Aspect).Distinct().ToList(),
					Indicators = g.Select(e => e.Indicator).Distinct().ToList(),
					Id = g.Select(e => e.ID).ToList()
				})
				.ToListAsync();

			var totalEntries = await query.CountAsync();
			var totalDays = await query.Select(m => m.ReportedDate.Date).Distinct().CountAsync();

			if (totalDays == 0)
			{
				throw new ArgumentException("Total days cannot be zero.");
			}

			var meanValue = (double)totalEntries / totalDays;

			var labels = dailyData.Select(d => d.Date).ToList();
			var data = dailyData.Select(d => (double)d.Count).ToList();
			var data2 = dailyData.Select(d => meanValue).ToList();
			var alerts = new List<string>();
			var frmnsList = dailyData.Select(d => d.Frmns).ToList();
			var sectorsList = dailyData.Select(d => d.Sectors).ToList();
			var aspectsList = dailyData.Select(d => d.Aspects).ToList();
			var indicatorsList = dailyData.Select(d => d.Indicators).ToList();
			var id = dailyData.Select(d => d.Id).ToList();

			foreach (var entry in dailyData)
			{
				double percentageOfMean = (double)entry.Count / meanValue * 100;

				if (percentageOfMean <= 100)
				{
					alerts.Add("green");
				}
				else if (percentageOfMean <= 200)
				{
					alerts.Add("yellow");
				}
				else if (percentageOfMean <= 400)
				{
					alerts.Add("orange");
				}
				else
				{
					alerts.Add("red");
				}
			}
			return (id, labels, data, data2, alerts, frmnsList, sectorsList, aspectsList, indicatorsList);
		}
	}
}
