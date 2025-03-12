using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class SmartAnalysisManager : ISmartAnalysisManager
	{
		private readonly ISmartAnalysisDB _smartAnalysisDB;
		public SmartAnalysisManager(ISmartAnalysisDB smartAnalysisDB)
		{
			_smartAnalysisDB = smartAnalysisDB;
		}
		public DashboardChart Get30DaysFmnData(RoleType roleType, FilterModel filterModel, bool isLastYear = false)
		{

			return _smartAnalysisDB.Get30DaysFmnData(roleType, filterModel, isLastYear);

		}
		public DashboardChart Get30DaysAspectData(RoleType roleType, FilterModel filterModel, bool isLastYear = false)
		{

			return _smartAnalysisDB.Get30DaysAspectData(roleType, filterModel, isLastYear);

		}
		public DashboardChart Get30DaysIndicatorData(RoleType roleType, FilterModel filterModel, bool isLastYear = false)
		{

			return _smartAnalysisDB.Get30DaysIndicatorData(roleType, filterModel, isLastYear);

		}
		public async Task<MeanValueModel> GetEntries(RoleType roleType, FilterModelEntries filterModel)
		{

			return await _smartAnalysisDB.GetEntries(roleType, filterModel);


		}
		public DashboardChart GetVariationData(RoleType roleType, FilterModel filterModel)
		{

			return _smartAnalysisDB.GetVariationData(roleType, filterModel);


		}
	}
}
