using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;

namespace BIS.DB.Interfaces
{
	public interface ICorpsDB
	{
		public List<Corps> GetAll();
		public Corps GetCorpsById(int corpsId);

		public List<Divisons> GetDivisonByCorps(long corpsId);
		public string GetNameByCorpsId(long CorpsId);
		public string GetNameByDivisionId(int? DivisionId);
		public Divisons GetDivisonDetails(int corpsId, int divisionId);
	}
}
