using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;

namespace BIS.Common.Entities
{
	public class DashboardInputCount
	{
		public long TotalInputCount { get; set; }
		public long Last7DaysCount { get; set; }
		public long TodayCount { get; set; }
	}
	public class DashboardChart
	{
		public List<int>? Count { get; set; } = new List<int>();
		public List<string>? Name { get; set; } = new List<string>();
	}
	public class MeanValueModel : DashboardChart
	{
		public List<double> MeanValue { get; set; } = new List<double>();
	}
	public class FilterModel
	{
		public List<string>? Frmn { get; set; }
		public List<string>? Sector { get; set; }
		public List<string>? Aspects { get; set; }
		public List<string>? Source { get; set; }
		public List<string>? Indicator { get; set; }
		public DateTime? startDate { get; set; }
		public DateTime? endDate { get; set; }
	}
	public class FilterModelEntries : FilterModel
	{
		public FilterType FilterType { get; set; }
	}
	public class GroupedData
	{
		public string Date { get; set; }
		public int Count { get; set; }
	}

}
