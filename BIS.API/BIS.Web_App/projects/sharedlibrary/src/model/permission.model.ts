import { BaseEntity } from "./base.model";

export class UserRolePermission {
    id: number;
    userRole: string;
    menucode: string;
    haveView: boolean;
    haveAdd: boolean;
    haveEdit: boolean;
    haveDelete: boolean;
}

export interface menupermission {
    userrole:string;
    code: string;
    menucode:string;
    name: string;
    haveview: boolean,
    haveadd: boolean,
    haveedit: boolean,
    havedelete: boolean,
}

export interface menus {
    code: string
    name: string
    status: boolean
}
export class roles extends BaseEntity{
    description: string
    roleName: string
}

export class role{
    id:number;
    roleName:string;
    roleDescription:string;
    status:boolean;
    isView:boolean;
    corpsId:number;
    divisionId:number;
}
