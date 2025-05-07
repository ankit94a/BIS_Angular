using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	[ApiController]
	public class NotificationController : ControllerBase
	{
		private readonly INotificationManager _notificationManager;
		private readonly IGenerateReportManager _reportManager;
		public NotificationController(INotificationManager notificationManager, IGenerateReportManager generateReportManager)
		{
			_notificationManager = notificationManager;
			_reportManager = generateReportManager;
		}

		[HttpGet, Route("unread")]
		public IActionResult GetNotificationByUserId()
		{
			int corpsId = HttpContext.GetCorpsId();
			int divisionId = HttpContext.GetDivisionId();
			int userId = HttpContext.GetUserId();
			return Ok(_notificationManager.GetNotificationByUserId(userId));
		}
		[HttpPost, Route("updatestatus")]
		public IActionResult UpdateStatus(Notification notification)
		{
			return Ok(_notificationManager.UpdateStatus(notification));
		}
		[HttpPost, Route("report")]
		public IActionResult GetReport(Notification notification)
		{
			int corpsId = HttpContext.GetCorpsId();
			int divisionId = HttpContext.GetDivisionId();
			return Ok(_reportManager.GetById(notification.DataId, corpsId, divisionId));
		}
		[HttpPost, Route("viewed")]
		public IActionResult NotificationViewed(Notification notification)
		{
			return Ok(_notificationManager.NotificationViewed(notification));
		}
		[HttpPost, Route("getreport")]
		public IActionResult GetUserReport(Notification notification)
		{
			int corpsId = HttpContext.GetCorpsId();
			int divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_reportManager.GetByRole(notification, corpsId, divisionId, roleType));
		}
		[HttpGet, Route("actiontaken/{notificationId}")]
		public IActionResult NotificationActionTaken(int notificationId)
		{
			int corpsId = HttpContext.GetCorpsId();
			int divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_notificationManager.NotificationActionTaken(notificationId, corpsId, divisionId, roleType));
		}
	}
}
