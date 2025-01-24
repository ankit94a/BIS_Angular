//using BIS.Common.Helpers;
using BIS.Common.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;
//using static BIS.Common.Enums.Enum;

namespace InSync.Api.Helpers
{
    public static class ClaimHelper
    {
        public static int GetUserId(this HttpContext httpContext)
        {
            return Convert.ToInt32(httpContext.User.Claims.Where(c => c.Type == BISConstant.UserId).FirstOrDefault().Value);
        }
        public static int GetRoleId(this HttpContext httpContext)
        {
            return Convert.ToInt32(httpContext.User.Claims.Where(c => c.Type == BISConstant.RoleId).FirstOrDefault().Value);
        }
        public static RoleType GetRoleType(this HttpContext httpContext)
        {
            return (RoleType)Enum.Parse(typeof(RoleType), httpContext.User.Claims.Where(c => c.Type == BISConstant.RoleType).FirstOrDefault().Value);
        }
        //public static string GetRoleType(this HttpContext httpContext)
        //{
        //    return httpContext.User.Claims.Where(c => c.Type == BISConstant.RoleType).FirstOrDefault().Value;
        //}
        public static int GetCorpsId(this HttpContext httpContext)
        {
            return Convert.ToInt32(httpContext.User.Claims.Where(c => c.Type == BISConstant.CorpsId).FirstOrDefault().Value);
        }
        public static int GetDivisionId(this HttpContext httpContext)
        {
            return Convert.ToInt32(httpContext.User.Claims.Where(c => c.Type == BISConstant.DivisionId).FirstOrDefault().Value);
        }
    }
}
