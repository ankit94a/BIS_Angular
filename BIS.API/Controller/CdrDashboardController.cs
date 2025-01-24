using BIS.Manager.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BIS.API.Controller
{
    public class CdrDashboardController : ControllerBase
    {
        private readonly ICdrDashboardManager _cdrDashboardManager;
        public CdrDashboardController(ICdrDashboardManager cdrDashboardManager)
        {
            _cdrDashboardManager = cdrDashboardManager;
        }
    }
}
