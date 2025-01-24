using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class MasterDataController : ControllerBase
    {
        private readonly IMasterDataManager _masterDataManager;
         public MasterDataController(IMasterDataManager masterDataManager)
        {
            _masterDataManager = masterDataManager;
        }

        //[HttpGet]
        //public IActionResult GetAll()
        //{
        //    long CorpsId = HttpContext.GetCorpsId();
        //    long DivisonId = HttpContext.GetDivisionId();
        //    return Ok(_masterDataManager.GetAll(CorpsId,DivisonId));
        //}
        [HttpGet]
        public IActionResult GetAllMasterData()
        {
            RoleType roleType = HttpContext.GetRoleType();
            int CorpsId = HttpContext.GetCorpsId();
            int DivisionId = HttpContext.GetDivisionId();
            return Ok(_masterDataManager.GetAllMasterData(CorpsId, roleType, DivisionId));
        }
        [HttpPost]
        public IActionResult AddData(MasterData masterData)
        {
            masterData.CorpsId = HttpContext.GetCorpsId();
            masterData.DivisionId = HttpContext.GetDivisionId();
            masterData.CreatedBy = HttpContext.GetUserId();            
            return Ok(_masterDataManager.AddMasterData(masterData,HttpContext.GetRoleType()));
        }
        [HttpGet, Route("getbyid{id}")]
        public IActionResult GetById(int id)
        {
            var corpsId = HttpContext.GetCorpsId();
            return Ok(_masterDataManager.GetBy(id, corpsId));
        }
        [HttpGet,Route("idsList{idsList}")]
        public IActionResult GetByIds(string idsList)
        {
            return Ok(_masterDataManager.GetByIds(idsList));
        }
        [HttpPost,Route("dateRange")]
        public IActionResult GetBetweenDateRange(FilterModel filterModel)
        {
            int CorpsId = HttpContext.GetCorpsId();
            int DivisionId = HttpContext.GetDivisionId();
            return Ok(_masterDataManager.GetBetweenDateRange(filterModel,CorpsId,DivisionId));
        }

        // Common Fields for MasterData
        [HttpGet, Route("inputlevels")]
        public IActionResult GetInputLevels ()
        {
            return Ok(_masterDataManager.GetInputLevels());
        }
        [HttpGet, Route("sector")]
        public IActionResult GetSectorByCorpsId()
        {
            var corpsId = HttpContext.GetCorpsId();
            return Ok(_masterDataManager.GetSectorByCorpsId(corpsId));
        }
        [HttpGet, Route("source")]
        public IActionResult GetSources()
        {
            return Ok(_masterDataManager.GetSources());
        }

        [HttpGet, Route("loc/{isSourceLoc}")]
        public IActionResult GetLocation(bool isSourceLoc)
        {
            return Ok(_masterDataManager.GetLocation(isSourceLoc));
        }

        [HttpGet, Route("enloc")]
        public IActionResult GetAllEnemyLocation()
        {
            return Ok(_masterDataManager.GetAllEnemyLocation());
        }
    }
}
