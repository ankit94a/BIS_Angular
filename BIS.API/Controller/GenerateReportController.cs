using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
    [Route("api/[controller]")]
    public class GenerateReportController : ControllerBase
    {
        private readonly IGenerateReportManager _generateReportManager;
        public GenerateReportController(IGenerateReportManager generateReportManager)
        {
            _generateReportManager = generateReportManager;
        }
        [HttpPost]
        public IActionResult AddReport([FromBody] GenerateReport report)
        {
            report.CorpsId = HttpContext.GetCorpsId();
            report.DivisionId = HttpContext.GetDivisionId();
            report.CreatedBy = HttpContext.GetUserId();
            var roleType = HttpContext.GetRoleType();
            report.CreatedOn = DateTime.Now;
            return Ok(_generateReportManager.AddReport(report,roleType));
        }
        [HttpGet]
        public IActionResult GetReport()
        {
            long CorpsId = HttpContext.GetCorpsId();
            long DivisionId = HttpContext.GetDivisionId();
            int userId = HttpContext.GetUserId();
            return Ok(_generateReportManager.GetReportByUser(CorpsId, DivisionId, userId));
        }
        [HttpGet,Route("graph{ids}")]
        public IActionResult GetGraphs(string ids)
        {
            return Ok(_generateReportManager.GetGraphs(ids));
        }
    }
}