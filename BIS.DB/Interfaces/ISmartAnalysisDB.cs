using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Interfaces
{
	public interface ISmartAnalysisDB
	{
		public DashboardChart Get30DaysFmnData(RoleType roleType, FilterModel filterModel, bool isLastYear = false);
		public DashboardChart Get30DaysAspectData(RoleType roleType, FilterModel filterModel, bool isLastYear = false);
		public DashboardChart Get30DaysIndicatorData(RoleType roleType, FilterModel filterModel, bool isLastYear = false);
		public Task<MeanValueModel> GetEntries(RoleType roleType, FilterModelEntries filterModel);
		public DashboardChart GetVariationData(RoleType roleType, FilterModel filterModel);

	}
}
