using BIS.Common.Entities;
using BIS.Manager.Implements;
using BIS.Manager.Interfaces;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BIS.API.Controller
{
	[Route("api/[controller]")]
	public class AttributeController : ControllerBase
	{
		private readonly IAttributeManager _attributeManager;

		public AttributeController(IAttributeManager attributeManager)
		{
			_attributeManager = attributeManager;
		}

		[HttpGet("AllAspect")]
		public IActionResult GetAllAspect()
		{
			return Ok(_attributeManager.GetAllAspect());
		}

		[HttpGet, Route("indicator/{aspectId}")]
		public IActionResult GetIndicatorByAspect(int aspectId)
		{
			return Ok(_attributeManager.GetIndicatorByAspect(aspectId));
		}
		[HttpPost, Route("indicatorlist")]
		public IActionResult GetIndicatorByAspect([FromBody] List<Aspect> aspects)
		{
			return Ok(_attributeManager.GetIndicators(aspects));
		}
		[HttpGet, Route("indicatorSubField/{indicatortId}")]
		public IActionResult GetIndicatorSubfield(int indicatortId)
		{
			var corpsId = HttpContext.GetCorpsId();
			return Ok(_attributeManager.GetIndicatorSubfield(indicatortId));
		}
		[HttpGet, Route("sector")]
		public IActionResult GetSectorByCorps()
		{
			var corpsId = HttpContext.GetCorpsId();
			return Ok(_attributeManager.GetSectorByCorpsId(corpsId));
		}
		[HttpPost, Route("aspect")]
		public IActionResult AddAspect([FromBody] Aspect aspect)
		{
			aspect.CreatedBy = HttpContext.GetUserId();
			aspect.CreatedOn = DateTime.Now;
			aspect.IsActive = true;
			aspect.IsDeleted = false;
			return Ok(_attributeManager.AddAspect(aspect));
		}
		[HttpPost, Route("indicator")]
		public IActionResult AddIndicator([FromBody] Indicator indicator)
		{
			indicator.CreatedBy = HttpContext.GetUserId();
			indicator.CreatedOn = DateTime.Now;
			indicator.IsActive = true;
			indicator.IsDeleted = false;
			return Ok(_attributeManager.AddIndicator(indicator));
		}
	}
}