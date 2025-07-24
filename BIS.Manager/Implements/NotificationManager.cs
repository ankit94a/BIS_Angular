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
		public NotificationManager(INotificationDB notificationDB, IMasterDataDB masterDataDB, IServiceScopeFactory serviceScopeFactory)
		{
			_notificationDB = notificationDB;
			_masterDataDB = masterDataDB;
			_serviceScopeFactory = serviceScopeFactory;
		}
		public List<Notification> GetNotificationByUserId(int userId)
		{
			return _notificationDB.GetNotificationByUserId(userId);

		}
		public bool NotificationActionTaken(int notificationId, int corpsId, int divisionId, RoleType roleType)
		{
			return _notificationDB.NotificationActionTaken(notificationId, corpsId, divisionId);
		}
		public long NotificationViewed(Notification notification)
		{
			return _notificationDB.NotificationViewed(notification);
		}
		public long UpdateStatus(Notification notify)
		{
			var masterId = _masterDataDB.UpdateStatus(notify.DataId, notify.Status.Value);
			var actionTaken = _notificationDB.NotificationActionTaken(notify.Id, notify.CorpsId, notify.DivisionId.Value);

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
			return 1;

		}
		public bool GetNotificationConfig()
		{
			List<MasterData> masterDataList = _masterDataDB.GetUpto30MinForm();
			BISLogger.Info("Total new master form created upto 30min before are" + masterDataList.Count, "Notification_Manager", "GetNotificationConfig");
			foreach (var masterData in masterDataList)
			{
				var notification = new Notification();
				notification.SenderId = masterData.CreatedBy;
			}
			return true;
		}
	}
}
