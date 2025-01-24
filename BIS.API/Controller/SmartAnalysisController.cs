using BIS.Manager.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BIS.API.Controller
{
    public class SmartAnalysisController : ControllerBase
    {
        private readonly ISmartAnalysisManager _smartAnalysisManager;
        public SmartAnalysisController(ISmartAnalysisManager smartAnalysisManager)
        {
            _smartAnalysisManager = smartAnalysisManager;
        }
    }
}
