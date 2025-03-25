using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities
{
	public class Aspect : CommonModel
	{
		public string Name { get; set; }

	}
	public class Indicator : CommonModel
	{
		public string Name { get; set; }
		public int AspectID { get; set; }

	}
	public class IndicatorSubFields : CommonModel
	{
		public string Name { get; set; }
		public int IndicatorId { get; set; }

	}
	public class Sector
	{
		public int id { get; set; }
		public string Name { get; set; }
		public int corpsId { get; set; }
	}

}