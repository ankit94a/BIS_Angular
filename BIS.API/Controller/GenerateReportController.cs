﻿using BIS.API.Authorization;
using BIS.Common.Entities;
using BIS.DB.Implements;
using BIS.Manager.Implements;
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
		[AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Create)]
		[HttpPost]
		public IActionResult AddReport([FromBody] GenerateReport report)
		{
			report.CorpsId = HttpContext.GetCorpsId();
			report.DivisionId = HttpContext.GetDivisionId();
			report.CreatedBy = HttpContext.GetUserId();
			var roleType = HttpContext.GetRoleType();
			report.CreatedOn = DateTime.Now;
			return Ok(_generateReportManager.AddReport(report, roleType));
		}
		[AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Read)]
		[HttpGet]
		public IActionResult GetReport()
		{
			int CorpsId = HttpContext.GetCorpsId();
			int DivisionId = HttpContext.GetDivisionId();
			int userId = HttpContext.GetUserId();
			RoleType roleType = HttpContext.GetRoleType();
			return Ok(_generateReportManager.GetReportByUser(CorpsId, DivisionId, userId,roleType));
		}
		[AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Read)]
		[HttpGet, Route("graph{ids}")]
		public IActionResult GetGraphs(string ids)
		{
			return Ok(_generateReportManager.GetGraphs(ids));
		}
		[AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Read)]
		[HttpGet, Route("report{id}")]
		public IActionResult GetById(int id)
		{
			int corpsId = HttpContext.GetCorpsId();
			int divisionId = HttpContext.GetDivisionId();
			return Ok(_generateReportManager.GetById(id, corpsId, divisionId));
		}
        [AuthorizePermission(PermissionItem.GenerateReport, PermissionAction.Read)]
        [HttpPost, Route("role-view-report")]
        public IActionResult GetRoleViewReport([FromBody] GenerateReport generateReport)
        {
            int corpsId = HttpContext.GetCorpsId();
            int divisionId = HttpContext.GetDivisionId();
			RoleType roleType = HttpContext.GetRoleType();
            return Ok(_generateReportManager.GetRoleViewReport(generateReport, corpsId, divisionId,roleType));
        }
    }
}