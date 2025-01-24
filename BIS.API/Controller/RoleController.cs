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
        public IActionResult GetAll()
        {
            int CorpsId = HttpContext.GetCorpsId();
            int DivisionId = HttpContext.GetDivisionId();
            return Ok(_roleManager.GetAll(CorpsId, DivisionId));
        }
        [HttpPost]
        public IActionResult Add(Role role) 
        { 
            return Ok(_roleManager.Add(role));
        }
    }
}
