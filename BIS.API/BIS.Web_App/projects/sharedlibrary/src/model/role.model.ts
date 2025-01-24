import { BaseEntity } from "./base.model";
import { PermissionItem, PermissionAction } from "./enum";

export class Role extends BaseEntity {
    code: string
    name: string
    status: boolean
}

export class Roles extends BaseEntity {
  roleName: string;
  description: string
  permissions: Permission[];
}
export class Permission extends BaseEntity {
  permissionItem: PermissionItem;
  permissionAction: PermissionAction[];
}

export class PermissionToVerify extends BaseEntity {
  permissionName: PermissionItem;
  permissionAction: PermissionAction;
}
export class RolePermission extends PermissionToVerify{
  roleId: number;
  permissionId: number[];
}

