//using BIS.Api.Helpers;
using BIS.Manager.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;
//using static FikaAmazonAPI.Utils.Constants;
//using static InSync.Common.Enums.Enum;

namespace InSync.Api.Authorization
{
    //public class AuthorizePermissonAttribute : TypeFilterAttribute
    //{
    //    public AuthorizePermissonAttribute(PermissionItem permissionItem, PermissionAction permissionAction)
    //        : base(typeof(AuthorizeActionFilter))

    //    {
    //        Arguments = new object[] { permissionItem, permissionAction };

    //        //_permissionItem = permissionItem;
    //        //_permissionAction = permissionAction;
    //    }
    //}
    //public class AuthorizeActionFilter : IAuthorizationFilter
    //{
    //    private IRoleManager _roleManager;
    //    private PermissionItem _permissionItem;
    //    private PermissionAction _permissionAction;
    //    public AuthorizeActionFilter( IRoleManager roleManager,PermissionItem item, PermissionAction action)
    //    {
    //        _roleManager = roleManager;
    //        _permissionItem = item;
    //        _permissionAction = action;
    //    }
    //    public void OnAuthorization(AuthorizationFilterContext context)
    //    {
            
    //        var user = context.HttpContext.User;

    //        if (!user.Identity.IsAuthenticated)
    //        {
    //            // it isn't needed to set unauthorized result 
    //            // as the base class already requires the user to be authenticated
    //            // this also makes redirect to a login page work properly
    //            context.Result = new UnauthorizedResult();
    //            return;
    //        }
    //        bool isAuthorized = false;
    //        if (context.HttpContext.GetRoleType() == RoleType.SuperAdmin)
    //        {
    //            isAuthorized = true;
    //        }
    //        else if (_permissionItem == PermissionItem.PermissionVerification)
    //        {
    //            isAuthorized = true;
    //        }
    //        else
    //        {

    //            long companyId = 0;
    //            if (context.HttpContext.GetRoleType()== RoleType.Admin)
    //            {
    //                companyId = -1;
    //            }
    //            else
    //            {
    //                companyId = context.HttpContext.GetCompanyId();
    //            }

    //            isAuthorized = _roleManager.Check(context.HttpContext.GetRoleId(), companyId,
    //           _permissionItem, _permissionAction);
    //        }

    //        if (!isAuthorized)
    //        {
    //            context.Result = new ForbidResult();
    //            return;
    //        }
    //    }

    //}

         
    
}
