using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;

namespace BIS.DB.Implements
{
    public  class RoleDB : IRoleDB, IBaseDB<Role>
    {
        private readonly AppDBContext _dbContext;
        public RoleDB(AppDBContext dBContext)
        { 
            _dbContext = dBContext;
        }
        public List<Role> GetAll(long corpsId,long DivisonId)
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
            throw new NotImplementedException();
        }
        public Role GetBy(long Id, long CorpsId)
        {
            throw new NotImplementedException();
        }
    }
}
