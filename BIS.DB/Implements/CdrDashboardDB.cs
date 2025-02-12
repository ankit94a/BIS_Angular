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
			var query = _dBContext.GenerateReports.Where(g => g.CorpsId == corpsId && g.CreatedBy == roleId);
			if (filterModel.startDate != default(DateTime))
			{
				//filterModel.startDate = filterModel.startDate.Value.AddDays(1);
				//filterModel.endDate = filterModel.endDate.Value.AddDays(1);
				query = query.Where(g => g.CreatedOn.Value.Date >= filterModel.startDate.Value.Date && g.CreatedOn.Value.Date <= filterModel.endDate.Value.Date);
			}
			if (divisionId > 0)
			{
				query = query.Where(g => g.DivisionId == divisionId);
			}
			return query.ToList();
		}
		public int GetUserIdByDivisonOrCorps(int corpsId, RoleType roleType, int divisonId = 0)
		{
			var query = _dBContext.UserDetails.Where(us => us.RoleType == roleType && us.CorpsId == corpsId);
			if (divisonId > 0)
			{
				query = query.Where(us => us.DivisionId == divisonId);
			}
			var result = query.FirstOrDefault().Id;
			return result;
		}
		public int AddInference(ApprovedReports inference)
		{
			try
			{
				_dBContext.ApprovedReports.Add(inference);
				var rowsAffected = _dBContext.SaveChanges();
				return rowsAffected;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				throw ex;
			}
		}
		public List<ApprovedReports> GetInference(int corpsId,int divisionId = 0)
		{
			try
			{
				var query = _dBContext.ApprovedReports.Where(ap => ap.CorpsId == corpsId);
				if(divisionId > 0)
				{
					query = query.Where(ap => ap.DivisionId == divisionId);
				}
				return query.ToList();
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				throw ex;
			}
		}

		
	}
}
