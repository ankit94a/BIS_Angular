using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.DB;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
    public class MasterDataDB : IMasterDataDB, IBaseDB<MasterData>
    {
        private readonly AppDBContext _dbContext;
        public MasterDataDB(AppDBContext dbContext) 
        {
            _dbContext = dbContext;
        }
        public List<MasterData> GetAll(long corpsId,long DivisonId)
        {
            return  _dbContext.MasterDatas.Where(m => m.ID == corpsId && m.DivisionId == DivisonId) .ToList();
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
            _dbContext.MasterDatas.Add(masterData);
            _dbContext.SaveChanges();
            return masterData.ID;
        }
        public List<MasterData> GetBetweenDateRange(FilterModel model, int corpsId, int divisionId = 0)
        {
            if (model.startDate == null || model.endDate == null)
            {
                throw new ArgumentException("StartDate and EndDate must be provided.");
            }

            var startDate = model.startDate.Value.Date; // Truncate time for the start date
            var endDate = model.endDate.Value.Date.AddDays(1).AddTicks(-1); // End of the day for end date

            var query = _dbContext.MasterDatas
                .Where(ms => ms.CorpsId == corpsId
                          && ms.CreatedOn >= startDate
                          && ms.CreatedOn <= endDate);


            if (divisionId > 0)
            {
                query = query.Where(ms => ms.DivisionId == divisionId);
            }

            return query.ToList();
        }
        public List<MasterSector> GetSectorByCorpsId(int corpsId)
        {
            return _dbContext.MasterSectors.Where(ms => ms.CorpsId == corpsId).ToList();
        }
        public List<MasterInputLevel> GetInputLevels()
        {
            return _dbContext.MasterInputLevels.Where(mi => mi.IsActive).ToList();
        }
        public List<Source> GetSources()
        {
            return _dbContext.MasterSources.Where(ms => ms.IsActive).ToList();
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
        public long UpdateStatus(int id)
        {
            var result = _dbContext.MasterDatas.Where(ms => ms.ID == id).FirstOrDefault(); 

            if (result != null)
            {
                result.Status = Status.Approved;
                _dbContext.SaveChanges();
            }

            return result?.ID ?? 0;
        }

        public List<EnemyLocation> GetAllEnemyLocation()
        {
            return _dbContext.MasterEnLocName.Where(ms => ms.IsActive).ToList();
        }
        public long Update(MasterData masterData)
        {
            throw new NotImplementedException();
        }
        public MasterData GetBy(long Id, long CorpsId)
        {
            return _dbContext.MasterDatas.Where(ms => ms.ID == Id && ms.CorpsId == CorpsId).FirstOrDefault();
        }
    }
}
