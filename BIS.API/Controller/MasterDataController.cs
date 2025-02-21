using BIS.API.Authorization;
using BIS.API.Hubs;
using BIS.Common.Entities;
using BIS.Common.Helpers;
using BIS.DB.Implements;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using static BIS.Common.Enum.Enum;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	[ApiController]
	public class MasterDataController : ControllerBase
	{
		private readonly IMasterDataManager _masterDataManager;
		private readonly IHubContext<NotificationHub> _notificationHubContext;
		public MasterDataController(IMasterDataManager masterDataManager, IHubContext<NotificationHub> notificationHubContext)
		{
			_masterDataManager = masterDataManager;
			_notificationHubContext = notificationHubContext;
		}

		//[HttpGet]
		//public IActionResult GetAll()
		//{
		//    long CorpsId = HttpContext.GetCorpsId();
		//    long DivisonId = HttpContext.GetDivisionId();
		//    return Ok(_masterDataManager.GetAll(CorpsId,DivisonId));
		//}
		[AuthorizePermission(PermissionItem.MasterData, PermissionAction.Read)]
		[HttpGet]
		public async Task<IActionResult> GetAllMasterData()
		{
			try
			{
				RoleType roleType = HttpContext.GetRoleType();
				int corpsId = HttpContext.GetCorpsId();
				int divisionId = HttpContext.GetDivisionId();
				var masterData = await _masterDataManager.GetAllMasterData(corpsId, roleType, divisionId);
				return Ok(masterData);
			}
			catch (Exception ex)
			{
				BISLogger.Error(ex, "Error retrieving all master data");
				return StatusCode(500, "Internal server error while retrieving master data");
			}
		}

		[AuthorizePermission(PermissionItem.MasterData, PermissionAction.Create)]
		[HttpPost]
        public IActionResult AddData(MasterData masterData)
        {
            if (masterData == null)
            {
                return BadRequest("Master data cannot be null.");
            }
            try
            {
                masterData.CorpsId = HttpContext.GetCorpsId();
                masterData.DivisionId = HttpContext.GetDivisionId();
                masterData.CreatedBy = HttpContext.GetUserId();
                return Ok(_masterDataManager.AddMasterData(masterData, HttpContext.GetRoleType()));
            }
            catch (Exception ex)
            {
                BISLogger.Error(ex, "Error while adding master data");
                return StatusCode(500, "Internal server error while adding master data");
            }
        }

		[AuthorizePermission(PermissionItem.MasterData, PermissionAction.Read)]
		[HttpGet, Route("getbyid{id}")]
		public IActionResult GetById(int id)
		{
			var corpsId = HttpContext.GetCorpsId();
			return Ok(_masterDataManager.GetBy(id, corpsId));
		}

		[AuthorizePermission(PermissionItem.MasterData, PermissionAction.Read)]
		[HttpGet, Route("idsList{idsList}")]
		public IActionResult GetByIds(string idsList)
		{
			return Ok(_masterDataManager.GetByIds(idsList));
		}

		[AuthorizePermission(PermissionItem.MasterData, PermissionAction.Read)]
		[HttpPost, Route("dateRange")]
		public IActionResult GetBetweenDateRange(FilterModelEntries filterModel)
		{
			int CorpsId = HttpContext.GetCorpsId();
			int DivisionId = HttpContext.GetDivisionId();
			return Ok(_masterDataManager.GetBetweenDateRange(filterModel, CorpsId, DivisionId));
		}

		// Common Fields for MasterData
		[HttpGet, Route("inputlevels")]
		public IActionResult GetInputLevels()
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

		[AuthorizePermission(PermissionItem.MasterData, PermissionAction.Update)]
		[HttpPut]
        public IActionResult updateMasterData(MasterData masterData)
        {
            masterData.UpdatedBy = HttpContext.GetUserId();
            return Ok(_masterDataManager.Update(masterData));
        }

        // Ansh - smart-analysis
        //[HttpGet("by-ids")]
        //public async Task<ActionResult> GetDataByIds([FromQuery] List<int> ids)
        //{
        //    var data = await _masterDataManager.GetByIds(ids);
        //    return Ok(data);
        //}


    }
}
