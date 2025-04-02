using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;

namespace BIS.Common.Entities
{
	public class Corps : CommonModel
	{
		public string Name { get; set; }

	}
	public class Divisons : CommonModel
	{
		public long CorpsId { get; set; }
		public string Name { get; set; }
		public string? Description { get; set; } = string.Empty;
	}

	public class RolePermission
	{
		public long Id { get; set; }
		public long CorpsId { get; set; }
		public long DivisionId { get; set; }
		public long RoleId { get; set; }
		public short PermissionId { get; set; }
		public long CreatedBy { get; set; }
		public long? UpdatedBy { get; set; }
		public DateTime CreatedOn { get; set; }
		public DateTime? UpdatedOn { get; set; }
		public bool IsActive { get; set; }
		public bool? IsDeleted { get; set; }
	}
	public class Permission
	{
		public long Id { get; set; }
		public long CreatedBy { get; set; }
		public long? UpdatedBy { get; set; }
		public DateTime? CreatedOn { get; set; }
		public DateTime? UpdatedOn { get; set; }
		public bool? IsActive { get; set; }
		public bool? IsDeleted { get; set; }
		public PermissionItem PermissionName { get; set; }
		public PermissionAction PermissionAction { get; set; }
	}
}
