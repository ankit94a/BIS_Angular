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
        [HttpGet,Route("count")]
        public IActionResult GetInputCounts()
        {
            int corpsId = HttpContext.GetCorpsId();
            int divisionId = HttpContext.GetDivisionId();
            return Ok(_dashboardManager.GetInputCounts(corpsId,divisionId));
        }
        [HttpPost,Route("fmn")]
        public IActionResult GetFmnWiseData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetAllFmnOrAspectData(corpsId,divisionId,roleType,filterModel));
        }

        [HttpPost,Route("fmn/30days")]
        public IActionResult Get30DaysFmnData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get30DaysFmnOrAspectData(corpsId, divisionId, roleType, filterModel));
        }
        [HttpPost, Route("fmn/today")]
        public IActionResult GetTodaysFmnData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetTodayFmnOrAspectData(corpsId, divisionId, roleType, filterModel));
        }
        [HttpPost,Route("fmn/last12Months")]
        public IActionResult Get12MonthsFmnData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get12MonthsFmnOrAspectData(corpsId, divisionId, roleType, filterModel));
        }

        // Aspect Api Endpoint
        [HttpPost,Route("aspect")]
        public IActionResult GetAspectWiseData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetAllFmnOrAspectData(corpsId, divisionId, roleType, filterModel, false));
        }

        [HttpPost, Route("aspect/30days")]
        public IActionResult Get30DaysAspectData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get30DaysFmnOrAspectData(corpsId, divisionId, roleType, filterModel,false));
        }
        [HttpPost, Route("aspect/today")]
        public IActionResult GetTodayAspectData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetTodayFmnOrAspectData(corpsId, divisionId, roleType, filterModel,false));
        }

        [HttpPost, Route("aspect/last12Months")]
        public IActionResult Get12MonthsAspectData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.Get12MonthsFmnOrAspectData(corpsId, divisionId, roleType, filterModel,false));
        }


        [HttpPost, Route("indicator")]
        public IActionResult GetIndicatorData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetIndicatorData(corpsId, divisionId, roleType, filterModel));
        }

        [HttpPost, Route("indicator/top5")]
        public IActionResult GetTop5IndicatorData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetIndicatorData(corpsId, divisionId, roleType, filterModel,false));
        }

        [HttpPost, Route("location")]
        public IActionResult GetTopFiveLocation([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_dashboardManager.GetTopFiveLocation(corpsId, divisionId, roleType, filterModel,false));
        }
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
