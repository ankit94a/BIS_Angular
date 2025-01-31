using BIS.Common.Entities;
using BIS.Manager.Implements;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BIS.API.Controller
{
	public class CdrDashboardController : ControllerBase
	{
		private readonly ICdrDashboardManager _cdrDashboardManager;
		public CdrDashboardController(ICdrDashboardManager cdrDashboardManager)
		{
			_cdrDashboardManager = cdrDashboardManager;
		}
		[HttpPost]
		public IActionResult GetReportByDate(FilterModel filterModel)
		{
			int CorpsId = HttpContext.GetCorpsId();
			int DivisionId = HttpContext.GetDivisionId();
			int userId = HttpContext.GetUserId();
			var roleType = HttpContext.GetRoleType();
			return Ok(_cdrDashboardManager.GetReportByDate(filterModel, CorpsId, roleType, DivisionId));
		}
	}
}
