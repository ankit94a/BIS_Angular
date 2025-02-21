using BIS.API.Authorization;
using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	public class SmartAnalysisController : ControllerBase
	{
		private readonly ISmartAnalysisManager _smartAnalysisManager;
		public SmartAnalysisController(ISmartAnalysisManager smartAnalysisManager)
		{
			_smartAnalysisManager = smartAnalysisManager;
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("30days")]
		public IActionResult Get30DaysFmnData([FromBody] FilterModel filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_smartAnalysisManager.Get30DaysFmnData(corpsId, divisionId, roleType, filterModel));
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("30days/lastyear")]
		public IActionResult Get30DaysFmnLastYear([FromBody] FilterModel filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_smartAnalysisManager.Get30DaysFmnData(corpsId, divisionId, roleType, filterModel, true));
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("aspect/30days")]
		public IActionResult Get30DaysAspect([FromBody] FilterModel filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_smartAnalysisManager.Get30DaysAspectData(corpsId, divisionId, roleType, filterModel));
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("aspect/30days/lastyear")]
		public IActionResult Get30DaysAspectLastYear([FromBody] FilterModel filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_smartAnalysisManager.Get30DaysFmnData(corpsId, divisionId, roleType, filterModel, true));
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("indicator/30days")]
		public IActionResult Get30DaysIndicator([FromBody] FilterModel filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_smartAnalysisManager.Get30DaysIndicatorData(corpsId, divisionId, roleType, filterModel));
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("indicator/30days/lastyear")]
		public IActionResult Get30DaysIndicatorLastYear([FromBody] FilterModel filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_smartAnalysisManager.Get30DaysIndicatorData(corpsId, divisionId, roleType, filterModel, true));
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("getentries")]
		public async Task<IActionResult> GetEntries([FromBody] FilterModelEntries filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(await _smartAnalysisManager.GetEntries(corpsId, divisionId, roleType, filterModel));
		}
		[AuthorizePermission(PermissionItem.SmartAnalysis, PermissionAction.Read)]
		[HttpPost, Route("variation")]
		public IActionResult GetVariationData([FromBody] FilterModel filterModel)
		{
			long corpsId = HttpContext.GetCorpsId();
			long divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_smartAnalysisManager.GetVariationData(corpsId, divisionId, roleType, filterModel));
		}
	}
}
