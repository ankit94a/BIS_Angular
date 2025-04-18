using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
    public class RoleManager : IRoleManager
    {
        private readonly IRoleDB _roleDB;

        public RoleManager(IRoleDB roleDB)
        {
            _roleDB = roleDB;
        }
		public bool Check(long RoleId, PermissionItem PermissionName, PermissionAction permissionAction)
		{
			return _roleDB.Check(RoleId, PermissionName, permissionAction);
		}
		public List<Role> GetAll(int corpsId,int divisonId)
        {
            return _roleDB.GetAll(corpsId,divisonId);
        }
        public long Add(Role role)
        {
            return _roleDB.Add(role);
        }
        public long Update(Role role)
        {
            return _roleDB.Update(role);
        }
        public Role GetBy(int Id, int CorpsId)
        {
            throw new NotImplementedException();
        }
		public List<Role> GetAllRoles()
        {
            return _roleDB.GetAllRoles();
        }

	}
}
