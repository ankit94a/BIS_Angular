using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.Common.Helpers;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class NotificationManager : INotificationManager
	{
		private readonly INotificationDB _notificationDB;
		private readonly IMasterDataDB _masterDataDB;
		public NotificationManager(INotificationDB notificationDB, IMasterDataDB masterDataDB)
		{
			_notificationDB = notificationDB;
			_masterDataDB = masterDataDB;
		}
		public List<Notification> GetNotificationByUserId(int userId)
		{
			return _notificationDB.GetNotificationByUserId(userId);

		}
		public long UpdateStatus(Notification notify, bool isApproved)
		{

			var masterId = _masterDataDB.UpdateStatus(notify.DataId, isApproved);
			if (masterId > 0)
			{
				return _notificationDB.UpdateStatus(notify);
			}
			return 0;
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
