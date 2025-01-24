import { BaseEntity } from "./base.model";

export class DashboardFmnAspect extends BaseEntity{
    dashboardFmnInputs:DashboardFmnInputs;
    dashboardFmn30Days:DashboardFmn30Days;
    dashboardFmnToday:DashboardFmnToday;
}

export class DashboardFmnInputs{
    label1:string;
    label2:string;
}
export class DashboardFmn30Days{
    label1:string;
    label2:string;
}
export class DashboardFmnToday{
    label1:string;
    label2:string;
}   