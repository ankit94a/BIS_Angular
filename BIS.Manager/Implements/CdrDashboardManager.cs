using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;

namespace BIS.Manager.Implements
{
	public class CdrDashboardManager : ICdrDashboardManager
	{
		private readonly ICdrDashboardDB _cdrDashboardDB;
		public CdrDashboardManager(ICdrDashboardDB cdrDashboardDB)
		{
			_cdrDashboardDB = cdrDashboardDB;
		}
		public List<GenerateReport> GetReportByDate(FilterModel filterModel, int corpsId, int roleId, int divisionId = 0)
		{
			if (divisionId > 0)
			{
				if (filterModel.startDate == null && filterModel.endDate == null)
				{
					filterModel.startDate = DateTime.UtcNow;
					filterModel.endDate = DateTime.UtcNow;
				}
				return _cdrDashboardDB.GetReportByDate(filterModel, corpsId, roleId, divisionId);
			}
			else
			{
				return new List<GenerateReport>();
			}
		}

	}
}
