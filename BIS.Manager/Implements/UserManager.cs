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
    public class UserManager : IUserManager
    {
        private readonly IUserDB _userDB;
        public UserManager(IUserDB userDB) 
        {
            _userDB = userDB;
        }

        public UserDetail GetUserByEmailPassword(string email, string password)
        {
            return _userDB.GetUserByEmailPassword(email, password);
        }
        public List<Menus> GetMenuByRoleCorpsAndDivision(long corpsId, long divisionId, long roleId, RoleType roleType)
        {
            return _userDB.GetMenuByRoleCorpsAndDivision(corpsId,divisionId, roleId, roleType);
        }
        public List<UserDetail> GetUserByCoprs(long corpsId)
        {
            return _userDB.GetUserByCoprs(corpsId);
        }
        public long AddUser(UserDetail user)
        {
            return _userDB.AddUser(user);
        }
    }
}
