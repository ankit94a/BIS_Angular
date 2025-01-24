using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using Microsoft.EntityFrameworkCore;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
    public class MasterDataManager : IMasterDataManager
    {
        private IMasterDataDB _masterDataDB;
        private readonly IUserDB _userDB;
        private readonly INotificationDB _notificationDB;
        public MasterDataManager(IMasterDataDB masterDataDB, IUserDB userDB, INotificationDB notificationDB)
        {
            _masterDataDB = masterDataDB;
            _userDB = userDB;
            _notificationDB = notificationDB;
        }
        public List<MasterData> GetAll(int corpsId,int divisionId)
        {
            return _masterDataDB.GetAll(corpsId,divisionId);
        }
        public List<MasterData> GetAllMasterData(int corpsId, RoleType roleType, int divisionId = 0)
        {
            var masterDataList = new List<MasterData>();
            if (roleType == RoleType.SuperAdmin)
            {

            }
            else if (roleType == RoleType.Admin)
            {

            }
            else
            {

                foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
                {
                    if ((int)item <= (int)roleType)
                    {
                        var userId = _userDB.GetUserIdByRoleType(item);
                        // checking that user fill any masterdata or not
                        if(userId > 0)
                        {
                            var dataList = _masterDataDB.GetByUserId(userId);
                            masterDataList.AddRange(dataList);
                        }                      
                    }
                }
            }
            return masterDataList;
        }
        public List<MasterData> GetByIds(string idsList)
        {
            var idsArray = idsList.Trim('[', ']').Split(',')  .Select(id => int.Parse(id)).ToList();
            return _masterDataDB.GetByIds(idsArray);
        }

        public List<MasterData> GetBetweenDateRange(FilterModel model,int corpsId, int divisionId = 0)
        {
            // for division roles
            if(divisionId > 0)
            {
                return _masterDataDB.GetBetweenDateRange(model,corpsId, divisionId);
            }
            // for corps roles
            else
            {
                return new List<MasterData>();
            }
        }
        public List<MasterSector> GetSectorByCorpsId(int corpsId)
        {
            return _masterDataDB.GetSectorByCorpsId(corpsId);
        }
        public List<MasterInputLevel> GetInputLevels()
        {
            return _masterDataDB.GetInputLevels();
        }
        public List<Source> GetSources()
        {
            return _masterDataDB.GetSources();
        }
        public List<MasterLocation> GetLocation(bool isSourceLoc = true)
        {
            return _masterDataDB.GetLocation(isSourceLoc);
        }
        public List<EnemyLocation> GetAllEnemyLocation()
        {
            return _masterDataDB.GetAllEnemyLocation();
        }
        public long AddMasterData(MasterData masterData,RoleType roleType)
        {
            masterData.Status = Status.Progress;
            masterData.CreatedOn = DateTime.Now;
            var id = _masterDataDB.Add(masterData);
            if (id > 0)
            {
                var notification = new Notification();
                notification.SenderId = masterData.CreatedBy;
                notification.SenderEntityType = roleType;
                foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
                {
                    if ((int)item == (int)roleType + 1)
                    {
                        notification.ReceiverId = _userDB.GetUserIdByRoleType(item);
                        notification.ReceiverEntityType = item;
                        notification.NotificationType = NotificationType.MasterData;
                        notification.Title = "Master Form Submitted";
                        notification.Content = $"Input filled by {roleType}. Please review and respond!";
                        notification.CreatedBy = masterData.CreatedBy;
                        notification.CreatedOn = DateTime.UtcNow;
                        notification.CorpsId = masterData.CorpsId;
                        notification.DivisionId = masterData.DivisionId;
                        notification.DataId = Convert.ToInt32(id);
                        return _notificationDB.AddNotification(notification);
                    }
                }
            }
            return 0;
        }
        public long Add(MasterData masterData)
        {
            throw new NotImplementedException();
        }
        public long Update(MasterData masterData)
        {
            throw new NotImplementedException();
        }
        public MasterData GetBy(int Id, int CorpsId)
        {
            return _masterDataDB.GetBy(Id, CorpsId);
        }

    }
}
