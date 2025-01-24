import { BaseEntity } from "./base.model";

export class User extends BaseEntity {
 
    username: string;
    name: string;
    email: string;
    // address: Address;
    facilityId:number;
    roleId: number;
    rolename: string;
    password: any;
    statusname:string;
    phone;
    role;
    // userType:RoleType
  
  }