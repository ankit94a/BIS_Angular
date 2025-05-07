using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
	public interface INotificationDB
	{
		public List<Notification> GetNotificationByUserId(int userId);

		public Task<long> AddNotification(Notification notification);
		public long UpdateStatus(Notification notification);
		public long NotificationViewed(Notification notification);
		public bool NotificationActionTaken(int notificationId, int corpsId, int divisionId = 0);
		public List<Notification> GetAllUserNotification(int userId);
	}
}
