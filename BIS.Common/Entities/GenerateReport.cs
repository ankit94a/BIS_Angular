using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;

namespace BIS.Common.Entities
{
	public class GenerateReport : BaseEntity
	{
		public string? ReportType { get; set; }
		public string? ReportDate { get; set; }
		public string? FromDate { get; set; }
		public string? ToDate { get; set; }
		public string? ReportTitle { get; set; }
		public string? UserId { get; set; }
		public string? Notes { get; set; }
		public string? startDate { get; set; }
		public string? endDate { get; set; }
		public string? MasterDataIds { get; set; }
		[NotMapped]
		public List<GraphImages>? Graphs { get; set; }
		public string? GraphIds { get; set; }
		public int? RptId { get; set; }
		public Status? Status { get; set; }
	}
	public class GraphImages : BaseEntity
	{
		public string? Name { get; set; }
		public string? Url { get; set; }
	}

	public class MergeReports : GenerateReport
	{
		public List<MasterData> masterData { get; set; }
		public List<GraphImages> ColGraphs { get; set; }
		public string ColNotes { get; set; }
		public List <GraphImages> BgsGraphs { get; set; }
		public string BgsNotes { get; set; }
        public List<GraphImages> MggsGraphs { get; set; }
        public string MggsNotes { get; set; }
    }
}
