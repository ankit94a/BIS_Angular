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
    public interface IMasterDataManager:IBaseManager<MasterData>
    {
        public long AddMasterData(MasterData masterData, RoleType roleType);
        public List<MasterData> GetAllMasterData(int corpsId, RoleType roleType, int divisionId = 0);
        public List<MasterData> GetByIds(string idsList);

        public List<MasterData> GetBetweenDateRange(FilterModel model, int corpsId,int divisionId = 0);
        public List<MasterSector> GetSectorByCorpsId(int corpsId);
        public List<MasterInputLevel> GetInputLevels();
        public List<Source> GetSources();
        public List<MasterLocation> GetLocation(bool isSourceLoc = true);
        public List<EnemyLocation> GetAllEnemyLocation();
    }
}
