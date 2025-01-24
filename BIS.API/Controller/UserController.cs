using BIS.Common.Entities;
using BIS.DB.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserManager _userManager;
        public UserController(IUserManager userManager) 
        {
            _userManager = userManager;
        }

        [HttpGet,Route("menu")]
        public IActionResult GetMenuByRoleCorpsAndDivision()
        {
            long corpsId = HttpContext.GetCorpsId();
            long divisionId = HttpContext.GetDivisionId();
            long roleId = HttpContext.GetRoleId();
            RoleType roleType = HttpContext.GetRoleType();
            return Ok(_userManager.GetMenuByRoleCorpsAndDivision(corpsId,divisionId,roleId, roleType));
        }

        [HttpGet]
        public IActionResult GetUsersByCorps()
        {
            long corpsId = HttpContext.GetCorpsId();
            return Ok(_userManager.GetUserByCoprs(corpsId));
        }

        [HttpPost]
        public IActionResult AddUser(UserDetail user)
        {
            return Ok(_userManager.AddUser(user));
        }
    }
}
