using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using Newtonsoft.Json.Linq;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
    public class NotificationDB : INotificationDB
    {
        private AppDBContext _dbContext;
        public NotificationDB(AppDBContext appDBContext)
        {
            _dbContext = appDBContext;
        }
        public List<Notification> GetNotificationByUserId(int userId)
        {
            var result = _dbContext.Notification
                .Where(n => n.ReceiverId ==  userId && !n.IsRead)
                .ToList();
            return result;
        }

        public long AddNotification(Notification notification)
        {
            _dbContext.Notification.Add(notification);
            _dbContext.SaveChanges();
            return notification.Id;
        }
        public long UpdateStatus(Notification notification)
        {
            var result = _dbContext.Notification.Where(n => n.Id == notification.Id).FirstOrDefault();

            if (result != null)
            {
                result.IsRead = true;
                _dbContext.SaveChanges();
            }

            return result?.Id ?? 0;
        }
        
    }
}
