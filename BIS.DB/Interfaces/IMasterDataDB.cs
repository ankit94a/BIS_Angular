﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;

namespace BIS.DB.Interfaces
{
	public interface IMasterDataDB : IBaseDB<MasterData>
	{
		public List<MasterData> GetAllMasterData();
		public List<MasterData> GetByUserId(int userId);
		public List<MasterData> GetByIds(List<int> idsList);

		public List<MasterData> GetBetweenDateRange(FilterModelEntries model, int corpsId, int divisionId = 0);
		public List<MasterSector> GetSectorByCorpsId(int corpsId);
		public List<MasterInputLevel> GetInputLevels();
		public List<Source> GetSources();
		public List<MasterLocation> GetLocation(bool isSourceLoc = true);
		public List<EnemyLocation> GetAllEnemyLocation();
		public long UpdateStatus(int id, bool isApproved);
		public List<MasterData> GetUpto30MinForm();
		public Task<(List<List<int>> Id, List<string> Labels, List<double> Data, List<double> Data2, List<string> Alerts, List<List<string>> FrmnsList, List<List<string>> SectorsList, List<List<string>> AspectsList, List<List<string>> IndicatorsList)> GetDailyAverageEntriesAsync(string frmn = null, string sector = null, string Aspects = null, string Indicator = null, DateTime? filterStartDate = null, DateTime? filterEndDate = null, int? Id = null);
	}
}
