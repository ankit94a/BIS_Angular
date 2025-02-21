using BIS.Common.Helpers;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Authorization
{
	public class AuthorizePermission : TypeFilterAttribute
	{
		private readonly PermissionItem _permissionItem;
		private readonly PermissionAction _permissionAction;

		public AuthorizePermission(PermissionItem permissionItem, PermissionAction permissionAction) : base(typeof(AuthorizeActionFilter))
		{
			Arguments = [permissionItem, permissionAction];
			_permissionAction = permissionAction;
			_permissionItem = permissionItem;

		}

		public class AuthorizeActionFilter : IAuthorizationFilter
		{
			private readonly IRoleManager _roleManager;
			private PermissionItem _permissionItem;
			private PermissionAction _permissionAction;
			private readonly IHostEnvironment _hostingEnvironment;
			public AuthorizeActionFilter(IRoleManager roleManager, PermissionItem item, PermissionAction action, IHostEnvironment environment)
			{
				_roleManager = roleManager;
				_permissionItem = item;
				_permissionAction = action;
				_hostingEnvironment = environment;
			}
			public void OnAuthorization(AuthorizationFilterContext context)
			{
				var user = context.HttpContext.User;
				if (!user.Identity.IsAuthenticated)
				{
					context.Result = new UnauthorizedResult();
					return;
				}
				bool isPermission = _roleManager.Check(context.HttpContext.GetRoleId(), _permissionItem, _permissionAction);
				if (!isPermission)
				{
					BISLogger.Error(new Exception(), $"Issue with role permission for roleId={context.HttpContext.GetRoleId()} permission={_permissionItem} for {_permissionAction} ");
					context.Result = new ForbidResult();
					return;
				}
			}
		}
	}
}
