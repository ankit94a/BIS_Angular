﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;

namespace BIS.DB.Interfaces
{
	public interface INotificationDB
	{
		public List<Notification> GetNotificationByUserId(int userId);

		public Task<long> AddNotification(Notification notification);
		public long UpdateStatus(Notification notification);
        public long NotificationViewed(Notification notification);
    }
}
