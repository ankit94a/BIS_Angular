export class BaseEntity {
    id?: number;
    isActive?: boolean;
    createdOn?:Date;
    UpdatedOn?:Date;
    createdBy?:string;
    UpdatedBy?:string;
    isView?: boolean = false;
    CorpsId?:number;
    DivisionId?:number;
}

export class CommonModel {
    id: number;
    isActive: boolean;
    createdOn:Date;
    UpdatedOn:Date;
    createdBy:string;
    UpdatedBy:string;
    isView: boolean = false;
}

export class Corps extends CommonModel{
    name:string;
}
export class Division extends CommonModel{
    name:string;
    corpsId:number;
}
