using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.DB.Interfaces;

namespace BIS.DB.Implements
{
    public class SmartAnalysisDB : ISmartAnalysisDB
    {
        private readonly AppDBContext _dBContext;
        public SmartAnalysisDB(AppDBContext appDBContext) 
        { 
            _dBContext = appDBContext;
        }
    }
}
