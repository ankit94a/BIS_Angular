import { BaseEntity } from "./base.model";

export class Facility extends BaseEntity{
    registeredName:string;
    registeredAddress:string;
    logoUrl:string;
    facilityType:number;
    primaryContactNumber:number;
}