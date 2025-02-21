using BIS.API.Authorization;
using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
    [Route("api/[controller]")]
	public class DashboardController : ControllerBase
    {
        private readonly IDashboardManager _dashboardManager;
        public DashboardController(IDashboardManager dashboardManager)
        { 
            _dashboardManager = dashboardManager;
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpGet,Route("count")]
        public IActionResult GetInputCounts()
        {
            int corpsId = HttpContext.GetCorpsId();
            int divisionId = HttpContext.GetDivisionId();
            return Ok(_dashboardManager.GetInputCounts(corpsId,divisionId));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("sector")]
        public IActionResult GetSectorWiseData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetSectorWiseData(corpsId, divisionId, roleType, filterModel,DaysMonthFilter.All));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("sector/30days")]
        public IActionResult Get30DaysSectorData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetSectorWiseData(corpsId, divisionId, roleType, filterModel,DaysMonthFilter.Days30));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("sector/today")]
        public IActionResult GetTodaysSectorData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetSectorWiseData(corpsId, divisionId, roleType, filterModel,DaysMonthFilter.Today));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("sector/last12Months")]
        public IActionResult Get12MonthsSectorData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get12MonthsSectorData(corpsId, divisionId, roleType, filterModel));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost,Route("fmn")]
        public IActionResult GetFmnWiseData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetAllFmnOrAspectData(corpsId,divisionId,roleType,filterModel));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost,Route("fmn/30days")]
        public IActionResult Get30DaysFmnData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get30DaysFmnOrAspectData(corpsId, divisionId, roleType, filterModel));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("fmn/today")]
        public IActionResult GetTodaysFmnData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetTodayFmnOrAspectData(corpsId, divisionId, roleType, filterModel));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost,Route("fmn/last12Months")]
        public IActionResult Get12MonthsFmnData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get12MonthsFmnOrAspectData(corpsId, divisionId, roleType, filterModel));
        }

		// Aspect Api Endpoint
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost,Route("aspect")]
        public IActionResult GetAspectWiseData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetAllFmnOrAspectData(corpsId, divisionId, roleType, filterModel, false));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("aspect/30days")]
        public IActionResult Get30DaysAspectData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get30DaysFmnOrAspectData(corpsId, divisionId, roleType, filterModel,false));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("aspect/today")]
        public IActionResult GetTodayAspectData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetTodayFmnOrAspectData(corpsId, divisionId, roleType, filterModel,false));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("aspect/last12Months")]
        public IActionResult Get12MonthsAspectData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get12MonthsFmnOrAspectData(corpsId, divisionId, roleType, filterModel,false));
        }

		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("indicator")]
        public IActionResult GetIndicatorData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetIndicatorData(corpsId, divisionId, roleType, filterModel));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("indicator/top5")]
        public IActionResult GetTop5IndicatorData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetIndicatorData(corpsId, divisionId, roleType, filterModel,false));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("location")]
        public IActionResult GetTopFiveLocation([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetTopFiveLocation(corpsId, divisionId, roleType, filterModel,false));
        }
		[AuthorizePermission(PermissionItem.Dashboard, PermissionAction.Read)]
		[HttpPost, Route("location/7days")]
        public IActionResult GetTopFiveLocation7Days([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetTopFiveLocation(corpsId, divisionId, roleType, filterModel));
        }
    }
}
