using BIS.API.Authorization;
using BIS.Common.Entities;
using BIS.Manager.Implements;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	public class CdrDashboardController : ControllerBase
	{
		private readonly ICdrDashboardManager _cdrDashboardManager;
		public CdrDashboardController(ICdrDashboardManager cdrDashboardManager)
		{
			_cdrDashboardManager = cdrDashboardManager;
		}
		[AuthorizePermission(PermissionItem.CdrDashboard, PermissionAction.Read)]
		[HttpGet]
		public IActionResult GetReportByDate()
		{
			int CorpsId = HttpContext.GetCorpsId();
			int DivisionId = HttpContext.GetDivisionId();
			int userId = HttpContext.GetUserId();
			var roleType = HttpContext.GetRoleType();
			return Ok(_cdrDashboardManager.GetReport(CorpsId, roleType, DivisionId));
		}
		[AuthorizePermission(PermissionItem.CdrDashboard, PermissionAction.Create)]
		[HttpPost, Route("inference")]
		public async Task<IActionResult> AddInference([FromBody] ApprovedReports inference)
		{
			inference.CreatedBy = HttpContext.GetUserId();
			inference.CreatedOn = DateTime.Now;
			inference.CorpsId = HttpContext.GetCorpsId();
			inference.DivisionId = HttpContext.GetDivisionId();
			inference.IsActive = true;
			RoleType roleTye = HttpContext.GetRoleType();
			return Ok(await _cdrDashboardManager.AddInference(inference,roleTye));
		}
		[AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Read)]
		[HttpGet, Route("inference")]
		public IActionResult GetInference()
		{
			int corpsId = HttpContext.GetCorpsId();
			int divisionId = HttpContext.GetDivisionId();
			return Ok(_cdrDashboardManager.GetInference(corpsId, divisionId));
		}
		[AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Read)]
		[HttpPost,Route("fullreport")]
		public IActionResult GetFullReport([FromBody] ApprovedReports inference)
		{
			int CorpsId = HttpContext.GetCorpsId();
			int DivisionId = HttpContext.GetDivisionId();
			int userId = HttpContext.GetUserId();
			var roleType = HttpContext.GetRoleType();
			return Ok(_cdrDashboardManager.GetFullReport(inference, CorpsId, roleType, DivisionId));
		}

        [AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Read)]
        [HttpPost, Route("view-report")]
        public IActionResult GetCdrViewReport([FromBody] GenerateReport generateReport)
        {
            int corpsId = HttpContext.GetCorpsId();
            int divisionId = HttpContext.GetDivisionId();
            return Ok(_cdrDashboardManager.GetCdrViewReport(generateReport,corpsId, divisionId));
        }
    }
}
