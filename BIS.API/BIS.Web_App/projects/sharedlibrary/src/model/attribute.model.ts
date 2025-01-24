import { BaseEntity, CommonModel } from "./base.model";

export class Aspect extends BaseEntity{
    name:string;
}

export class Indicator extends BaseEntity{
    name:string;
    aspectId:number;
}
export class IndicatorSubFields extends BaseEntity{
    name:string;
    indicatorId:number;
}
export class Sector extends CommonModel{
  name:string;
  corpsId:number;
}
