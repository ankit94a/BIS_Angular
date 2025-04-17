using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
    public interface IRoleDB : IBaseDB<Role>
    {
		public bool Check(long RoleId, PermissionItem PermissionName, PermissionAction permissionAction);
		public List<Role> GetAllRoles();
	}
}
