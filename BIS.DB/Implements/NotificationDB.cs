using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using Microsoft.EntityFrameworkCore;
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
				.Where(n => n.ReceiverId == userId && !n.IsRead).OrderByDescending(n => n.Id)
				.ToList();
			return result;
		}

		public async Task<long> AddNotification(Notification notification)
		{
			_dbContext.Notification.Add(notification);
			await _dbContext.SaveChangesAsync();
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
		public long NotificationViewed(Notification notification)
		{
			var result = _dbContext.Notification.Where(n => n.Id == notification.Id).FirstOrDefault();

			if (result != null)
			{
				result.IsRead = true;
				_dbContext.SaveChanges();
			}

			return result?.Id ?? 0;
		}
		public bool NotificationActionTaken(int notificationId, int corpsId, int divisionId = 0)
		{
			var result = _dbContext.Notification.Where(n => n.DataId == notificationId).FirstOrDefault();

			if (result != null)
			{
				result.IsActionTaken = true;
				_dbContext.SaveChanges();
				return true;
			}
			return false;
		}
		public List<Notification> GetAllUserNotification(int userId)
		{
			return _dbContext.Notification.Where(n => n.SenderId == userId && !n.IsActionTaken.Value).ToList();
		}
	}
}
