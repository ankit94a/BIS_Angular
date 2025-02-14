using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Interfaces
{
	public interface IMasterDataManager : IBaseManager<MasterData>
	{
		public long AddMasterData(MasterData masterData, RoleType roleType);
		public Task<List<MasterData>> GetAllMasterData(int corpsId, RoleType roleType, int divisionId = 0);
		public List<MasterData> GetByIds(string idsList);

		public List<MasterData> GetBetweenDateRange(FilterModelEntries model, int corpsId, int divisionId = 0);
		public List<MasterSector> GetSectorByCorpsId(int corpsId);
		public List<MasterInputLevel> GetInputLevels();
		public List<Source> GetSources();
		public List<MasterLocation> GetLocation(bool isSourceLoc = true);
		public List<EnemyLocation> GetAllEnemyLocation();
		Task<(List<List<int>> Id, List<string> Labels, List<double> Data, List<double> Data2, List<string> Alerts, List<List<string>> FrmnsList, List<List<string>> SectorsList, List<List<string>> AspectsList, List<List<string>> IndicatorsList)> GetDailyAverageEntriesAsync(string frmn = null, string sector = null, string Aspects = null, string Indicator = null, DateTime? filterStartDate = null, DateTime? filterEndDate = null, int? Id = null);
		//Task<List<MasterData>> GetByIds(List<int> ids);
	}

}

