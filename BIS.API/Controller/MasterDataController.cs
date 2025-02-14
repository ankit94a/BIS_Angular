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

		[HttpPost]
		public IActionResult AddData(MasterData masterData)
		{
			masterData.CorpsId = HttpContext.GetCorpsId();
			masterData.DivisionId = HttpContext.GetDivisionId();
			masterData.CreatedBy = HttpContext.GetUserId();
			var id = _masterDataManager.AddMasterData(masterData, HttpContext.GetRoleType());
			//if (id > 0)
			//{
			//	try
			//	{
			//		var notif = new Notification();
			//		notif.SenderId = HttpContext.GetUserId();
			//		notif.ReceiverId = 24;
			//		notif.SenderEntityType = RoleType.Staff1;
			//		notif.ReceiverEntityType = RoleType.G1Int;
			//		notif.DataId = Convert.ToInt32(id);
			//		notif.Title = "Notification from Hub";
			//		notif.Content = "Real-time notification sending using signalR and Dot Net Hub";
			//		notif.IsRead = false;
			//		notif.NotificationType = NotificationType.MasterData;
			//		Task.Run(async () =>
			//		{
			//			if (NotificationHub.ConnectionIds.TryGetValue(notif.ReceiverId, out var connectionId))
			//			{
			//				await _notificationHubContext.Clients.All.SendAsync("ReceiveNotification", notif);
			//			}
			//			else
			//			{
			//				BISLogger.Info($"Receiver with ID {notif.ReceiverId} is not connected.", "MasterDataController", "Add Method");
			//			}
			//		});
			//	}
			//	catch (Exception ex) { throw ex; }
			//}
			return Ok(id);
			return BadRequest();
		}
		[HttpGet, Route("getbyid{id}")]
		public IActionResult GetById(int id)
		{
			var corpsId = HttpContext.GetCorpsId();
			return Ok(_masterDataManager.GetBy(id, corpsId));
		}
		[HttpGet, Route("idsList{idsList}")]
		public IActionResult GetByIds(string idsList)
		{
			return Ok(_masterDataManager.GetByIds(idsList));
		}
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

		// Ansh - smart-analysis
		//[HttpGet("by-ids")]
		//public async Task<ActionResult> GetDataByIds([FromQuery] List<int> ids)
		//{
		//    var data = await _masterDataManager.GetByIds(ids);
		//    return Ok(data);
		//}


	}
}
