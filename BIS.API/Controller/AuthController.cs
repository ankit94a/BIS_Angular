using BIS.Api.Authorization;
using BIS.API.Helpers;
using BIS.Common.Entities;
using BIS.Common.Entities.Auth;
using BIS.Common.Helpers;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly LoginAttempt _loginAttempt;
        public AuthController(IUserManager userManager, IJwtManager jwtManager, ICorpsManager corpsManager, LoginAttempt loginAttempt)
        {
            _userManager = userManager;
            _jwtManager = jwtManager;
            _corpsManager = corpsManager;
            _loginAttempt = loginAttempt;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] Login login)
        {
            try
            {
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                BlockStatus _blockstatus = _loginAttempt.IsBlocked(ip);
                if (_blockstatus.IsBlocked)
                {
                    return StatusCode(429, new
                    {
                        ErrorCode = "TOO_MANY_ATTEMPTS",
                        ErrorMessage = $"Too many failed login attempts. Please try again after {_blockstatus.RemainingTime?.Minutes} minutes and {_blockstatus.RemainingTime?.Seconds} seconds."
                    });
                }
                var user = _userManager.GetUserByEmail(login.UserName);
                if (user != null)
                {
                    //bool captchaValid = ValidateCaptcha(login.Code, login.Token);
                    //if (captchaValid)
                    //{
                        _loginAttempt.ResetAttempts(ip);
                        bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);
                        if (isPasswordCorrect)
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
                        else
                        {
                            return Unauthorized(new { message = "Invalid password" });
                        }

                    //}
                    //else
                    //{
                    //    return Unauthorized(new { message = "Invalid Captcha Code." });
                    //}

                }
                return BadRequest("User Not Found");

            }
            catch (Exception ex)
            {
                BISLogger.Error(ex, "An error occurred while checking login attempt block status.");
                throw;
            }
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

        [HttpGet("getcaptha")]
        public IActionResult GenerateCaptcha()
        {
            var code = GenerateRandomCode(5);
            var token = Guid.NewGuid().ToString();
            CaptchaStore.Captchas[token] = code;

            return Ok(new { token, code });
        }
        private string GenerateRandomCode(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private bool ValidateCaptcha(string Code, string Token)
        {
            if (CaptchaStore.Captchas.TryGetValue(Token, out var correctCode))
            {
                CaptchaStore.Captchas.Remove(Token);

                if (string.Equals(Code, correctCode, StringComparison.OrdinalIgnoreCase))
                    return true;

                return false;
            }

            return false;
        }

    }
}
