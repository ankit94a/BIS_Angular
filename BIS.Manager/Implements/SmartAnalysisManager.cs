using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;

namespace BIS.Manager.Implements
{
    public class SmartAnalysisManager : ISmartAnalysisManager
    {
        private readonly ISmartAnalysisDB _smartAnalysisDB;
        public SmartAnalysisManager(ISmartAnalysisDB smartAnalysisDB) 
        { 
            _smartAnalysisDB = smartAnalysisDB;
        }
    }
}
