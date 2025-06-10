using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json.Converters;

namespace BIS.Common.Enum
{
	public class Enum
	{
		[JsonConverter(typeof(StringEnumConverter))]
		public enum PermissionItem
		{
			Dashboard = 1,
			MasterData,
			AddMasterData,
			SearchAndQuery,
			GenerateReport,
			SmartAnalysis,
			PredictiveModel,
			CdrDashboard,
			ImportExport,
			ApprovedReports,
			NotesForMe,
			Facility,
			User,
			Role,
			PermissionVerification,
			Attribute,
			AIAnalysis
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum PermissionAction
		{
			Read = 1,
			Create,
			Update,
			ReadAll,
			Delete
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum RoleType
		{
			Staff1 = 1,
			G1Int,
			Colgs,
			ColInt,
			Bgs,
			Mggs,
			Goc,
			Admin,
			SuperAdmin,
			StaffEc,
			G1IntEc,
			ColIntEc,
			BrigInt,
			MggsEc,
			GocEc
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum NotificationType
		{
			MasterData = 1,
			GenerateReport,
			ApprovedReport
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum Status
		{
			Created = 1,
			Progress,
			Approved,
			Rejected
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum CategoryLoc : short
		{
			SourceLoc = 1,
			TypeOfLoc
		}
		public enum DaysMonthFilter
		{
			All = 1,
			Days30,
			Today,
			Months12
		}
		public enum FilterType
		{
			Daily = 1,
			Weekly,
			Monthly
		}
	}
}
