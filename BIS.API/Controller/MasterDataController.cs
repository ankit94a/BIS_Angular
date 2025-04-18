using BIS.API.Authorization;
using BIS.API.Hubs;
using BIS.Common.Entities;
using BIS.Common.Helpers;
using BIS.DB.Implements;
using BIS.Manager.Implements;
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
				if (masterData.ID > 0)
				{
					masterData.UpdatedBy = HttpContext.GetUserId();
					return Ok(_masterDataManager.Update(masterData));
				}
				masterData.CorpsId = HttpContext.GetCorpsId();
				masterData.DivisionId = HttpContext.GetDivisionId();
				masterData.CreatedBy = HttpContext.GetUserId();
				var roleType = HttpContext.GetRoleType();
				if (roleType == RoleType.Staff1 || roleType == RoleType.StaffEc)
				{

					return Ok(_masterDataManager.AddMasterData(masterData, HttpContext.GetRoleType()));
				}
				return BadRequest("You are not authorized to fill the input");
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
		[HttpGet, Route("addsource/{name}")]
		public IActionResult AddSources(string name)
		{
			Source source = new Source();
			source.CreatedOn = DateTime.Now;
			source.CreatedBy = HttpContext.GetUserId();
			source.IsActive = true;
			source.IsDeleted = false;
			source.Name = name;
			return Ok(_masterDataManager.AddSource(source));
		}
		[HttpGet, Route("loc/{isSourceLoc}")]
		public IActionResult GetLocation(bool isSourceLoc)
		{
			return Ok(_masterDataManager.GetLocation(isSourceLoc));
		}
		[HttpGet, Route("addlocsource/{name}")]
		public IActionResult AddLocation(string name)
		{
			MasterLocation masterLocation = new MasterLocation();
			masterLocation.CreatedOn = DateTime.Now;
			masterLocation.CreatedBy = HttpContext.GetUserId();
			masterLocation.IsActive = true;
			masterLocation.IsDeleted = false;
			masterLocation.Name = name;
			masterLocation.CategoryLoc = CategoryLoc.SourceLoc;
			return Ok(_masterDataManager.AddLocation(masterLocation));
		}
		[HttpGet, Route("addloctype/{name}")]
		public IActionResult AddTypeLocation(string name)
		{
			MasterLocation masterLocation = new MasterLocation();
			masterLocation.CreatedOn = DateTime.Now;
			masterLocation.CreatedBy = HttpContext.GetUserId();
			masterLocation.IsActive = true;
			masterLocation.IsDeleted = false;
			masterLocation.Name = name;
			masterLocation.CategoryLoc = CategoryLoc.TypeOfLoc;
			return Ok(_masterDataManager.AddLocation(masterLocation));
		}
		[HttpGet, Route("enloc")]
		public IActionResult GetAllEnemyLocation()
		{
			return Ok(_masterDataManager.GetAllEnemyLocation());
		}
		[HttpGet, Route("addenloc/{name}")]
		public IActionResult AddEnemyLocation(string name)
		{
			var enemLocation = new EnemyLocation();
			enemLocation.CreatedOn = DateTime.Now;
			enemLocation.CreatedBy = HttpContext.GetUserId();
			enemLocation.IsActive = true;
			enemLocation.IsDeleted = false;
			enemLocation.Name = name;
			return Ok(_masterDataManager.AddEnemyLocation(enemLocation));
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

		[HttpGet, Route("deactivate/{id}/{table}")]
		public IActionResult DeactivateSource(long id, string table)
		{
			return Ok(_masterDataManager.Deactive(id, table));
		}
	}
}
