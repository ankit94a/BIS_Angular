using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;

namespace BIS.Manager.Implements
{
    public class RoleManager : IRoleManager
    {
        private readonly IRoleDB _roleDB;

        public RoleManager(IRoleDB roleDB)
        {
            _roleDB = roleDB;
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
            throw new NotImplementedException();
        }
        public Role GetBy(int Id, int CorpsId)
        {
            throw new NotImplementedException();
        }
    }
}
