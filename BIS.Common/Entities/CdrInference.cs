using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities
{
	public class ApprovedReports : BaseEntity
	{
		public string? EnForceLevel { get; set; }
		public string? EnLikelyAim { get; set; }
		public string? EnLikelyTgt { get; set; }
		public string? NextActionByEn { get; set; }
		public string? OwnImdtAction { get; set; }
		public string? Sector { get; set; }
		public string? Loc { get; set; }
		public string? Corps { get; set; }
		public string? Div { get; set; }
		public string? Bde { get; set; }
		public string? Fmn { get; set; }
		public string? Sect { get; set; }
		public string? Tps { get; set; }
		public string? Res { get; set; }
		public string? Task { get; set; }
		public string? Comment { get; set; }
		public string? GraphIds { get; set; }
		public int GenerateReportId { get; set; }
		[NotMapped]
		public List<GraphImages>? Graphs { get; set; }
	}

	public class FullReport 
	{
		public ApprovedReports Inference { get; set; }
		public MergeReports MergeReport { get; set; }
	}
}
