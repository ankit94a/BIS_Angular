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

        [HttpPost, Route("30days")]
        public IActionResult Get30DaysFmnData([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_smartAnalysisManager.Get30DaysFmnData(corpsId, divisionId, roleType, filterModel));
        }
        [HttpPost, Route("30days/lastyear")]
        public IActionResult Get30DaysFmnLastYear([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_smartAnalysisManager.Get30DaysFmnData(corpsId, divisionId, roleType, filterModel,true));
        }
        [HttpPost, Route("aspect/30days")]
        public IActionResult Get30DaysAspect([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_smartAnalysisManager.Get30DaysAspectData(corpsId, divisionId, roleType, filterModel));
        }
        [HttpPost, Route("aspect/30days/lastyear")]
        public IActionResult Get30DaysAspectLastYear([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_smartAnalysisManager.Get30DaysFmnData(corpsId, divisionId, roleType, filterModel, true));
        }

        [HttpPost, Route("indicator/30days")]
        public IActionResult Get30DaysIndicator([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_smartAnalysisManager.Get30DaysIndicatorData(corpsId, divisionId, roleType, filterModel));
        }
        [HttpPost, Route("indicator/30days/lastyear")]
        public IActionResult Get30DaysIndicatorLastYear([FromBody] FilterModel filterModel)
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_smartAnalysisManager.Get30DaysIndicatorData(corpsId, divisionId, roleType, filterModel, true));
        }
    }
}
