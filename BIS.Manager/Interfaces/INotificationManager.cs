﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Interfaces
{
	public interface INotificationManager
	{
		public List<Notification> GetNotificationByUserId(int userId);
		public long UpdateStatus(Notification notify);
		public long NotificationViewed(Notification notify);
		public bool GetNotificationConfig();
		public bool NotificationActionTaken(int notificationId, int corpsId, int divisionId, RoleType roleType);
	}
}
