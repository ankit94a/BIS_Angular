using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	public class RoleController : ControllerBase
	{
		private readonly IRoleManager _roleManager;
		public RoleController(IRoleManager roleManager)
		{
			_roleManager = roleManager;
		}
		[HttpGet]
		public IActionResult GetAllByCorps(int CorpsId, int DivisionId)
		{

			return Ok(_roleManager.GetAll(CorpsId, DivisionId));
		}
		[HttpPost]
		public IActionResult Add([FromBody] Role role)
		{
			role.CreatedBy = HttpContext.GetUserId();
			role.CreatedOn = DateTime.Now;
			role.IsActive = true;
			role.IsDeleted = false;
			return Ok(_roleManager.Add(role));
		}
		[HttpGet, Route("all")]
		public IActionResult GetAllRoles()
		{

			return Ok(_roleManager.GetAllRoles());
		}
		[HttpPut]
		public IActionResult Update([FromBody] Role role)
		{
			role.UpdatedBy = HttpContext.GetUserId();
			role.UpdatedOn = DateTime.Now;
			return Ok(_roleManager.Update(role));
		}
	}
}
