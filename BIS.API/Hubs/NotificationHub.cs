using BIS.Common.Entities;
using BIS.Common.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Hubs
{
	[Authorize]
	public class NotificationHub : Hub
	{
		public static ConcurrentDictionary<long, string> ConnectionIds { get; } = new ConcurrentDictionary<long, string>();
		public NotificationHub()
		{

		}

		public override Task OnConnectedAsync()
		{
			var id = long.Parse(Context.User.Claims
			   .FirstOrDefault(c => c.Type == BISConstant.UserId)?.Value ?? "0");

			BISLogger.Info("Hub is connected for " + id, "Notification Hub Component", "OnConnect method");
			if (id > 0)
			{
				ConnectionIds.AddOrUpdate(id, Context.ConnectionId, (key, oldValue) => Context.ConnectionId);
			}

			return base.OnConnectedAsync();
		}
		public override Task OnDisconnectedAsync(Exception exception)
		{
			var id = long.Parse(Context.User.Claims
				.FirstOrDefault(c => c.Type == BISConstant.UserId)?.Value ?? "0");

			if (id > 0)
			{
				ConnectionIds.TryRemove(id, out _);
			}

			return base.OnDisconnectedAsync(exception);
		}

		public async Task SendNotificationAsync(int senderId, int receiverId, string title, string message, int corpsId, int divisionId, NotificationType NotificationType, int dataId)
		{
			try
			{
				// Prepare the notification message
				var msg = new Notification
				{
					Content = message,
					SenderId = senderId,
					ReceiverId = receiverId,
					CorpsId = corpsId,
					DivisionId = divisionId,
					NotificationType = NotificationType,
					DataId = dataId,
					Title = title,
				};

				// Check if the receiver's connection is active
				if (NotificationHub.ConnectionIds.TryGetValue(receiverId, out var connectionId))
				{
					// Send notification to the specific client
					await Clients.Client(connectionId).SendAsync("ReceiveNotification", msg);
				}
				else
				{
					BISLogger.Warn($"Notification could not be sent. Receiver with ID {receiverId} is not connected.", "Notification Hub", "Send Method");
				}
			}
			catch (Exception ex)
			{
				BISLogger.Error(ex, $"Error occurred while sending notification for , receiverId {receiverId}, senderId {senderId}");
			}
		}


	}
}
