using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
    public class NotificationManager : INotificationManager
    {
        private readonly INotificationDB _notificationDB;
        private readonly IMasterDataDB _masterDataDB;
        public NotificationManager(INotificationDB notificationDB,IMasterDataDB masterDataDB)
        { 
            _notificationDB = notificationDB;
            _masterDataDB = masterDataDB;
        }
        public List<Notification> GetNotificationByUserId(int userId)
        {
            return _notificationDB.GetNotificationByUserId(userId);

        }
        public long UpdateStatus(Notification notify)
        {

            var masterId = _masterDataDB.UpdateStatus(notify.DataId);
            if(masterId > 0)
            {
              return  _notificationDB.UpdateStatus(notify);
            }
            return 0;
        }
    }
}
