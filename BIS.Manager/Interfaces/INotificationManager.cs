using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;

namespace BIS.Manager.Interfaces
{
    public interface INotificationManager
    {
        public List<Notification> GetNotificationByUserId(int userId);
        public long UpdateStatus(Notification notify);
    }
}
