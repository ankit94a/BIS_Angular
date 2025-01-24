using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BIS.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationManager _notificationManager;
        private readonly IGenerateReportManager _reportManager;
        public NotificationController(INotificationManager notificationManager,IGenerateReportManager generateReportManager)
        {
            _notificationManager = notificationManager;
            _reportManager = generateReportManager;
        }

        [HttpGet,Route("unread")]
        public IActionResult GetNotificationByUserId()
        {
            int corpsId = HttpContext.GetCorpsId();
            int divisionId = HttpContext.GetDivisionId();
            int userId = HttpContext.GetUserId();
            return Ok(_notificationManager.GetNotificationByUserId(userId));
        }
        [HttpPost,Route("updatestatus")]
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
    }
}
