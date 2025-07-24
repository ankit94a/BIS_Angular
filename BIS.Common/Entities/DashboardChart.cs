using Newtonsoft.Json;
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
		public List<dynamic>? Name { get; set; } = new List<dynamic>();
		public List<DashboardSectorData>? SectorData { get; set; } = new List<DashboardSectorData>();
		public Dictionary<dynamic, List<int>> FrmnData { get; set; } = new Dictionary<dynamic, List<int>>();
	}
	public class DashboardSectorData
	{
		public string Sector { get; set; } = string.Empty; 
		public List<int> Count { get; set; } = new List<int>(); 
	}
	public class MeanValueModel : DashboardChart
	{
		public List<double> MeanValue { get; set; } = new List<double>();
	}
	public class FilterModel
	{
		public List<FmnModel> Frmn { get; set; }
		public List<string>? Sector { get; set; }
		public List<string>? Aspects { get; set; }
		public List<string>? Source { get; set; }
		public List<string>? Indicator { get; set; }
		public DateTime? startDate { get; set; }
		public DateTime? endDate { get; set; }
	}
	public class VaritaionFilter
	{
		public FmnModel Frmn { get; set; }
		public List<string>? Sector { get; set; }
		public List<string>? Aspects { get; set; }
		public List<string>? Source { get; set; }
		public List<string>? Indicator { get; set; }
		public DateTime? startDate { get; set; }
		public DateTime? endDate { get; set; }
	}
	public class FmnModel
	{
		public long CorpsId { get; set; }
		public int DivisionId { get; set; }
		public string Name { get; set; }
	}
	public class FilterModelEntries : FilterModel
	{
		public FilterType FilterType { get; set; }
        public int CorpsId { get; set; }
        public int DivisionId { get; set; }
    }
	public class GroupedData
	{
		public string Date { get; set; }
		public int Count { get; set; }
	}
	public class VaritaionChart
	{
		public List<string> Labels { get; set; } = new();
		public List<ChartSeries> Series { get; set; } = new();
	}

	public class ChartSeries
	{
		public string Frmn { get; set; }
		public List<int> Data { get; set; } = new List<int>();
		[JsonIgnore]
		public object Tag { get; set; }
	}


}
