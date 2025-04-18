using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
	public class RoleDB : IRoleDB, IBaseDB<Role>
	{
		private readonly AppDBContext _dbContext;
		public RoleDB(AppDBContext dBContext)
		{
			_dbContext = dBContext;
		}
		public bool Check(long RoleId, PermissionItem PermissionName, PermissionAction permissionAction)
		{
			var permissionId = _dbContext.Permisssion.Where(p => p.PermissionName == PermissionName && p.PermissionAction == permissionAction).Select(p => p.Id).FirstOrDefault();
			if (permissionId == 0)
				return false;

			return _dbContext.RolePermission.Any(rp => rp.RoleId == RoleId && rp.PermissionId == permissionId);
		}

		public List<Role> GetAllRoles()
		{
			return _dbContext.Roles.Where(r => r.IsActive).ToList();
		}
		public List<Role> GetAll(long corpsId, long DivisonId)
		{
			return _dbContext.Roles.Where(r => r.CorpsId == corpsId && r.DivisionId == DivisonId).ToList();
		}
		public long Add(Role role)
		{
			_dbContext.Roles.Add(role);
			_dbContext.SaveChanges();
			return role.Id;
		}
		public long Update(Role role)
		{
			var existingRole = _dbContext.Roles.Find(role.Id);
			if (existingRole == null)
			{
				throw new Exception("Role not found");
			}

			existingRole.RoleName = role.RoleName;
			existingRole.Description = role.Description;
			_dbContext.SaveChanges();
			return existingRole.Id;
		}

		public Role GetBy(long Id, long CorpsId)
		{
			throw new NotImplementedException();
		}
	}
}
