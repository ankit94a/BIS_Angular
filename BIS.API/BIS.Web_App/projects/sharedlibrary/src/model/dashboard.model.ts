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
    // corpsId:number;
    // divisionId:number;
    // urlPath:string;
}
export class PredictionModel{
    frmn:FmnModel[]=[];
    source:string[]=[];
    aspect:string[]=[];
    sector:string[]=[];
    indicator:string[]=[];
    startdate:Date;
    enddate:Date;
    granularity:string;
    urlPath:string;
    isFuturePrediction:boolean = false;
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
