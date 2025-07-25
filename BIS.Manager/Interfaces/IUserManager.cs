using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
    public interface IUserManager
    {
        public UserDetail GetUserByEmail(string email);
        public List<Menus> GetMenuByRoleCorpsAndDivision(long corpsId, long divisionId, long roleId,RoleType roleType);
        public List<UserDetail> GetUserByCoprs(long corpsId);

        public long AddUser(UserDetail user);
		public bool UpdatePassword(UserDetail user);
		public List<UserDetail> GetAllUsers();

        public Task<List<PredictionResponse>> GetAnomalies(PredictionModel requestModel);
	}
}
