﻿using BIS.Common.Entities;
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
		[HttpGet,Route("all")]
		public IActionResult GetAllUsers()
		{
			return Ok(_userManager.GetAllUsers());
		}
		[HttpPost]
        public IActionResult AddUser([FromBody] UserDetail user)
        {
            return Ok(_userManager.AddUser(user));
        }
		[HttpPut,Route("password")]
		public IActionResult UpdatePassword([FromBody] UserDetail user)
		{
			return Ok(_userManager.UpdatePassword(user));
		}
        [HttpPost,Route("anomalies")]
        public async Task<IActionResult> GetAnomalies([FromBody] PredictionModel filterModel)
        {
            var result = await _userManager.GetAnomalies(filterModel);
            return Ok(result); 
        }
    }
}
