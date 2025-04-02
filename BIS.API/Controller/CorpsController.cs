using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	public class CorpsController : ControllerBase
	{
		private readonly ICorpsManager _corpsManager;

		public CorpsController(ICorpsManager corpsManager)
		{
			_corpsManager = corpsManager;
		}
		[HttpGet]
		public IActionResult GetAll()
		{
			return Ok(_corpsManager.GetAll());
		}
		[HttpGet, Route("frmlist/{corpsId}")]
		public IActionResult GetFrmList(int corpsId)
		{

			return Ok(_corpsManager.GetDivisonByCorps(corpsId));
		}

	}
}
