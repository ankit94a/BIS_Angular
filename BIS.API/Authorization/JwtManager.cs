
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using BIS.Api.Authorization;
using BIS.Common.Entities;
using BIS.Common.Helpers;

namespace InSync.Api.Authorization
{
    public class JwtManager: IJwtManager
    {
        private readonly JwtConfig _jwtSettings;
       public JwtManager(IOptions<JwtConfig> jwtSettings )
        {
            _jwtSettings = jwtSettings.Value;
        }
        public string GenerateJwtToken(UserDetail user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(BISConstant.UserId, user.Id.ToString()),
                new Claim(BISConstant.UserName, user.Name.ToString()),
                new Claim(BISConstant.RoleId, user.RoleId.ToString()),
                new Claim(BISConstant.CorpsId, user.CorpsId.ToString()),
                new Claim(BISConstant.DivisionId, user.DivisionId.ToString()),
                new Claim(BISConstant.RoleType,user.RoleType.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            }),
                Issuer=_jwtSettings.Issuer,
                Audience=_jwtSettings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            return jwtTokenHandler.WriteToken(jwtTokenHandler.CreateToken(tokenDescriptor));
        }        
    }
}















         
