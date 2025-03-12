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
export class DashboardInputCount{
    totalInputCount:number;
    last7DaysCount:number;
    todayCount:number;
}
export class FilterModel4 extends FilterModel{
  filterType:FilterType;
}

export class FmnModel {
  corpsId:number;
  divisionId:number;
  name:string;
}
