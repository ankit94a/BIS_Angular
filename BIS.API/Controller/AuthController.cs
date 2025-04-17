using BIS.Api.Authorization;
using BIS.Common.Entities;
using BIS.Common.Entities.Auth;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IUserManager _userManager;
		readonly IJwtManager _jwtManager;
		readonly ICorpsManager _corpsManager;
		public AuthController(IUserManager userManager, IJwtManager jwtManager, ICorpsManager corpsManager)
		{
			_userManager = userManager;
			_jwtManager = jwtManager;
			_corpsManager = corpsManager;
		}

		//[AllowAnonymous]
		[HttpPost]
		[Route("login")]
		public IActionResult Login([FromBody] Login login)
		{
			var user = _userManager.GetUserByEmailPassword(login.UserName, login.Password);
			if (user != null)
			{
				var jwtToken = _jwtManager.GenerateJwtToken(user);
				var model = new
				{
					corpsName = _corpsManager.GetNameByCorpsId(Convert.ToInt64(user.CorpsId)),
					divisionName = _corpsManager.GetNameByDivisionId(user.DivisionId),
					userName = user.Name,
					roleType = user.RoleType,
					corpsId = user.CorpsId,
					divisionId = user.DivisionId
				};
				return Ok(new { token = jwtToken, user = model });
			}

			return BadRequest("User Not Found"); 
		}


		[HttpPost]
		[Route("newtoken")]
		public dynamic GetNetToken([FromBody] UserDetail user)
		{
			IActionResult response = Unauthorized();
			var jwtToken = _jwtManager.GenerateJwtToken(user);
			response = Ok(new { token = jwtToken });
			return response;
		}
	}
}
