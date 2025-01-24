import { BaseEntity } from "./base.model";
import { masterData } from "./masterdata.model"

export class GenerateReport extends BaseEntity {

    reportGenId?: number;
  reportType: string;
  reportDate: Date;
  reportTitle: string;
//   "userId"?: string,
  notes: string;
  startDate: string;
  endDate:string
  masterData:masterData[]
  masterDataIds:string;
  graphs:GraphImages[];
  graphIds:string;
}
export class GraphImages extends BaseEntity{
  name:string;
  url:string;
}
