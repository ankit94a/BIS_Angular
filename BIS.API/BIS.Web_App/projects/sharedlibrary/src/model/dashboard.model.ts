import { FilterType } from "./enum";

export class DasboardChart{
    count:number;
    name:string;
}
export class FilterModel{
    frmn:FmnModel[];
    source:string[]=[];
    aspects:string[]=[];
    sector:string[]=[];
    indicator:string[]=[];
    startDate:Date;
    endDate:Date;
}
export class PredictionModel{
    frmn:string[]=[];
    source:string[]=[];
    aspect:string[]=[];
    sector:string[]=[];
    indicator:string[]=[];
    startdate:Date;
    enddate:Date;
    granularity:string;
}
export class DashboardInputCount{
    totalInputCount:number;
    last7DaysCount:number;
    todayCount:number;
}
export class FilterModel4 extends FilterModel{
  filterType:FilterType;
}
export class VaraitionFilter{
  frmn:FmnModel;
    source:string[]=[];
    aspects:string[]=[];
    sector:string[]=[];
    indicator:string[]=[];
    startDate:Date;
    endDate:Date;
}
export class FmnModel {
  corpsId:number;
  divisionId:number;
  name:string;
}
