using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class CdrDashboardManager : ICdrDashboardManager
	{
		private readonly ICdrDashboardDB _cdrDashboardDB;
		public CdrDashboardManager(ICdrDashboardDB cdrDashboardDB)
		{
			_cdrDashboardDB = cdrDashboardDB;
		}
		public List<GenerateReport> GetReportByDate(FilterModel filterModel, int corpsId, RoleType roleType, int divisionId = 0)
		{
			var roleId = 0;
			if (divisionId > 0)
			{

				//foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
				//{
				//if ((int)item == (int)roleType + 1)
				//{
				//notification.ReceiverId = _userDB.GetUserIdByRoleType(item);
				//notification.ReceiverEntityType = item;
				//notification.NotificationType = NotificationType.MasterData;
				//notification.Title = "Master Form Submitted";
				//notification.Content = $"Input filled by {roleType}. Please review and respond!";
				//notification.CreatedBy = masterData.CreatedBy;
				//notification.CreatedOn = DateTime.UtcNow;
				//notification.CorpsId = masterData.CorpsId;
				//notification.DivisionId = masterData.DivisionId;
				//notification.DataId = Convert.ToInt32(id);
				//return _notificationDB.AddNotification(notification);
				//}
				//}
				roleId = GetUserIdByDivisonOrCorps(corpsId, divisionId, RoleType.Colgs);
				return _cdrDashboardDB.GetReportByDate(filterModel, corpsId, roleId, divisionId);
			}
			else
			{
				return new List<GenerateReport>();
			}
		}

		private int GetUserIdByDivisonOrCorps(int corpsId, int divisionId, RoleType roleType)
		{
			return _cdrDashboardDB.GetUserIdByDivisonOrCorps(corpsId, roleType, divisionId);
		}
	}
}
