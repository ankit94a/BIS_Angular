using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
	public interface IUserDB
	{
        public UserDetail GetUserByEmail(string email);
        public List<Menus> GetMenuByRoleCorpsAndDivision(long corpsId, long divisionId, long roleId, RoleType roleType);
		public List<UserDetail> GetUserByCoprs(long corpsId);
		public long AddUser(UserDetail user);
		public bool UpdatePassword(UserDetail user);
		public List<UserDetail> GetAllUsers();
		public Task<int> GetUserIdByRoleType(RoleType roleType, int corpsId, int? divisionId = 0);
	}
}
