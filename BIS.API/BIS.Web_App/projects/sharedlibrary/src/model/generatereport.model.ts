import { BaseEntity } from "./base.model";
import { masterData } from "./masterdata.model"

export class GenerateReport extends BaseEntity {

  reportGenId?: number;
  reportType: string;
  reportDate: Date;
  reportTitle: string;
  notes: string;
  startDate: Date;
  endDate:Date
  masterData:masterData[]
  masterDataIds:string;
  graphs:GraphImages[]=[];
  graphIds:string;
  rptId:number;
  isRead:boolean;
}
export class GraphImages extends BaseEntity{
  name:string;
  url:string;
}
export class MergeReports extends GenerateReport {
  colGraphs: GraphImages[];
  colNotes: string;
  bgsGraphs: GraphImages[];
  bgsNotes: string;
  mggsGraphs: GraphImages[];
  mggsNotes: string;
}

export class ApprovedReports extends BaseEntity{
  enForceLevel: string;
  enLikelyAim: string;
  enLikelyTgt: string;
  nextActionByEn: string;
  ownImdtAction: string;
  sector: string;
  loc: string;
  corps: string;
  div: string;
  bde: string;
  fmn: string;
  sect: string;
  tps: string;
  res: string;
  task: string;
  comment: string;
  grpahIds: string;
  graphs:GraphImages[];
  generateReportId:number;
}

export class FullReport {
  inference:ApprovedReports = new ApprovedReports();
  mergeReport:MergeReports = new MergeReports();
}
