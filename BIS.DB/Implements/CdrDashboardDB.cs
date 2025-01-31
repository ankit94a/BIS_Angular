using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
	public class CdrDashboardDB : ICdrDashboardDB
	{
		private readonly AppDBContext _dBContext;
		public CdrDashboardDB(AppDBContext appDBContext)
		{
			_dBContext = appDBContext;
		}
		public List<GenerateReport> GetReportByDate(FilterModel filterModel, int corpsId, int roleId, int divisionId = 0)
		{
			var roleType = new RoleType();
			var query = _dBContext.GenerateReports.Where(g => g.CorpsId == corpsId && g.CreatedOn >= filterModel.startDate && g.CreatedOn <= filterModel.endDate);
			return query.ToList();
		}
		public long GetUserIdByDivisonOrCorps(int corpsId, RoleType roleType, int divisonId = 0)
		{
			var query = _dBContext.UserDetails.Where(us => us.RoleType == roleType && us.CorpsId == corpsId);
			if(divisonId > 0)
			{
				query.Where(us => us.DivisionId == divisonId);
			}
			var result = query.FirstOrDefault().Id;
			return result;
		}
	}
}
