using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.Common.Helpers;
using BIS.DB.Implements;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class NotificationManager : INotificationManager
	{
		private readonly INotificationDB _notificationDB;
		private readonly IMasterDataDB _masterDataDB;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public NotificationManager(INotificationDB notificationDB, IMasterDataDB masterDataDB,IServiceScopeFactory serviceScopeFactory)
		{
			_notificationDB = notificationDB;
			_masterDataDB = masterDataDB;
			_serviceScopeFactory = serviceScopeFactory;
		}
		public List<Notification> GetNotificationByUserId(int userId)
		{
			return _notificationDB.GetNotificationByUserId(userId);

		}
        public long NotificationViewed(Notification notification)
		{
			return _notificationDB.NotificationViewed(notification);
		}
        public long UpdateStatus(Notification notify)
		{
			var masterId = _masterDataDB.UpdateStatus(notify.DataId, notify.Status.Value);
             
			// sending notification to staff that his form is approved or not.
			Task.Run(async () =>
			{
				await Task.Delay(TimeSpan.FromMinutes(2));
				var notification = new Notification();
				notification.SenderId = notify.ReceiverId;
				notification.ReceiverId = notify.SenderId;
				notification.DataId = notify.DataId;
				notification.SenderEntityType = notify.ReceiverEntityType;
				notification.ReceiverEntityType = notify.SenderEntityType;
				notification.CreatedBy = notify.ReceiverId;
				notification.Title = notify.Status == Status.Rejected ? "Input rejected" : "Input approved";
				notification.Content = notify.Status == Status.Rejected
		? "Your input has been reviewed and unfortunately, it did not meet the required criteria. Please review the feedback and make the necessary changes."
		: "Your input has been successfully reviewed and approved.";
				notification.CreatedOn = DateTime.UtcNow;
				notification.IsActive = true;
				notification.NotificationType = NotificationType.MasterData;
				notification.CorpsId = notify.CorpsId;
                notification.DivisionId = notify.DivisionId;

                using (var scope = _serviceScopeFactory.CreateScope())
				{
                    var notificationDB = scope.ServiceProvider.GetRequiredService<NotificationDB>();
                    await notificationDB.AddNotification(notification);
                }
                   
            });
           
			

			return _notificationDB.UpdateStatus(notify);
        }
		public bool GetNotificationConfig()
		{
			// getting upto 30min of master form filled by staff
			List<MasterData> masterDataList = _masterDataDB.GetUpto30MinForm();
			BISLogger.Info("Total new master form created upto 30min before are" + masterDataList.Count, "Notification_Manager", "GetNotificationConfig");
			foreach (var masterData in masterDataList)
			{

				var notification = new Notification();
				notification.SenderId = masterData.CreatedBy;
				//	notification.SenderEntityType = roleType;
				//	foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
				//	{
				//		if ((int)item == (int)roleType + 1)
				//		{
				//			notification.ReceiverId = _userDB.GetUserIdByRoleType(item, masterData.CorpsId, masterData.DivisionId);
				//			notification.ReceiverEntityType = item;
				//			notification.NotificationType = NotificationType.MasterData;
				//			notification.Title = "Master Form Submitted";
				//			notification.Content = $"Input filled by {roleType}. Please review and respond!";
				//			notification.CreatedBy = masterData.CreatedBy;
				//			notification.CreatedOn = DateTime.UtcNow;
				//			notification.CorpsId = masterData.CorpsId;
				//			notification.DivisionId = masterData.DivisionId;
				//			notification.DataId = Convert.ToInt32(id);
				//			return _notificationDB.AddNotification(notification);
				//		}
				//	}

			}
			return true;
		}
	}
}
