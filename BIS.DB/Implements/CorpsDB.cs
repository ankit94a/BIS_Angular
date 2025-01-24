using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.Common.Helpers;
using BIS.DB.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BIS.DB.Implements
{
    public class CorpsDB : ICorpsDB
    {
        private readonly AppDBContext _dbContext;
        public CorpsDB(AppDBContext dbContext) 
        { 
            _dbContext = dbContext;
        }
        public List<Corps> GetAll()
        {
            return _dbContext.Corps.ToList();
        }
        public List<Divisons> GetDivisonByCorps(long corpsId) 
        {
            return _dbContext.Divisions.Where(d => d.CorpsId == corpsId).ToList();
        }

        public string GetNameByCorpsId(long corpsId)
        {
            try
            {
                var CorpsName = _dbContext.Corps.Where(us => us.Id == corpsId).Select(us => us.Name).FirstOrDefault();
                return CorpsName;
            }
            catch (Exception ex)
            {
                BISLogger.Error(ex, "Getting user list error in for CorpsId = " + corpsId);
                throw;
            }
        }

        public string GetNameByDivisionId(int? divisionId)
        {
            try
            {
                var DivisionName = _dbContext.Divisions.Where(us => us.Id == divisionId).Select(us => us.Name).FirstOrDefault();
                return DivisionName;
            }
            catch (Exception ex)
            {
                BISLogger.Error(ex, "Getting user list error in for CorpsId = " + divisionId);
                throw;
            }
        }
    }
}
