using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Interfaces
{
	public interface IGenerateReportManager : IBaseManager<GenerateReport>
	{
		public List<GenerateReport> GetReportByUser(int corpsId, int divisionId, int userId, RoleType roleType);
		public long AddReport(GenerateReport generateReport, RoleType roleType);
		public GenerateReport GetById(int id, int corpsId, int divisionId);
		public List<GraphImages> GetGraphs(string ids);
		public MergeReports GetRoleViewReport(GenerateReport generateReport, int corpsId, int divisionId, RoleType roleType);
		public MergeReports GetByRole(Notification notification, int corpsId, int divisionId, RoleType roleType);


	}
}
