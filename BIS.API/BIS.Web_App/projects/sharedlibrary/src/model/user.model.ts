import { BaseEntity } from "./base.model";

export class User extends BaseEntity {
    username: string;
    name: string;
    email: string;
    facilityId:number;
    roleId: number;
    rolename: string;
    password: any;
    statusname:string;
    phone;
    role;
    roleType;
    corpsId:number;
    divisionId:number;
    facilityType;
  }
