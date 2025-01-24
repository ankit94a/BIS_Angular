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
    public class CorpsManager : ICorpsManager
    {
        private readonly ICorpsDB _corpsDB;
        public CorpsManager(ICorpsDB corpsDB)
        { 
            _corpsDB = corpsDB;
        }
        public List<Corps> GetAll()
        {
            return _corpsDB.GetAll();
        }
        public List<Divisons> GetDivisonByCorps(long corpsId)
        { 
            return _corpsDB.GetDivisonByCorps(corpsId);
        }
        public string GetNameByCorpsId(long corpsId)
        {
            return _corpsDB.GetNameByCorpsId(corpsId);
        }

        public string GetNameByDivisionId(int? divisionId)
        {
            return _corpsDB.GetNameByDivisionId(divisionId);
        }
    }
}
