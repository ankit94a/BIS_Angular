export class DasboardChart{
    count:number;
    name:string;
}
export class FilterModel{
    frmn:string[]=[];
    source:string[]=[];
    aspect:string[]=[];
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