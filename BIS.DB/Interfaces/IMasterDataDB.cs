using System;
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

        public List<MasterData> GetBetweenDateRange(FilterModel model, int corpsId, int divisionId = 0);
        public List<MasterSector> GetSectorByCorpsId(int corpsId);
        public List<MasterInputLevel> GetInputLevels();
        public List<Source> GetSources();
        public List<MasterLocation> GetLocation(bool isSourceLoc = true);
        public List<EnemyLocation> GetAllEnemyLocation();
        public long UpdateStatus(int id);
    }
}
