import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GenerateReport, GraphImages, MergeReports } from 'projects/sharedlibrary/src/model/generatereport.model';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-generate-report-view',
  imports: [SharedLibraryModule],
  templateUrl: './generate-report-view.component.html',
  styleUrl: './generate-report-view.component.scss'
})
export class GenerateReportViewComponent {
  report:GenerateReport = new GenerateReport();
  report1:GenerateReport = new GenerateReport();
  masterDataList = [];
  reportType = ['ISUM','DISUM','SITREP']
    // Using BehaviorSubject for reactivity
    private tableHeaderSubject = new BehaviorSubject<string[]>([]);
    private masterDataListSubject = new BehaviorSubject<masterData[]>([]);
    private chartImagesSubject = new BehaviorSubject<GraphImages[]>([]);
    private colImagesSubject = new BehaviorSubject<GraphImages[]>([]);

    tableHeader$ = this.tableHeaderSubject.asObservable();
    masterDataList$ = this.masterDataListSubject.asObservable();
    chartImages$ = this.chartImagesSubject.asObservable();
    colCharts$ = this.colImagesSubject.asObservable();
     mergeReport:MergeReports = new MergeReports()
  constructor(@Inject(MAT_DIALOG_DATA) data,private toastr:ToastrService,private apiService:ApiService,private masterDataService: MasterDataFilterService,private dailog:MatDialog){

    this.report = data;
    // this.getColGraphs(this.report.graphIds);
    // if(this.report.rptId != undefined && this.report.rptId != null && this.report.rptId > 0){
    //   this.getG1Report();
    // }
    this.getReport()
  }
  // 
 
  getReport(){
    let url = this.report.isView ? 'generatereport/role-view-report' : 'cdrdashboard/view-report'
    this.apiService.postWithHeader(url, this.report).subscribe(res =>{
debugger
this.mergeReport = res;
        const { Header, DataList } = this.masterDataService.getMasterData(this.mergeReport.masterData);
                this.tableHeaderSubject.next(Header);
                this.masterDataListSubject.next(DataList);
      // this.report1 = res;
      // this.getMasterList();
      // this.getGraphs(this.report1.graphIds)
    })
  }
  getMasterList() {

    this.apiService.getWithHeaders('masterdata/idsList' + this.report1.masterDataIds).subscribe(res => {

      if (res) {
        this.report.masterData = res;

        const { Header, DataList } = this.masterDataService.getMasterData(res);
        this.tableHeaderSubject.next(Header);
        this.masterDataListSubject.next(DataList);
      }
    })
  }
  // getColReport(){
  //   this.apiService.getWithHeaders('generatereport/report/'+ this.report.id).subscribe(res =>{
  //     this.report1 = res;
  //   })
  // }
  getGraphs(graphIds) {
    this.apiService.getWithHeaders('generatereport/graph' + graphIds).subscribe(res => {
      this.report1.graphs = res
      // .map(graph => {
      //   return {
      //     ...graph,  // Spread the existing properties of the graph
      //     url: 'data:image/png;base64,' + graph.url  // Prepend the base64 string
      //   };
      // });
      this.chartImagesSubject.next(this.report1.graphs);
      console.log('g1_graphs',this.report1.graphs)
    })
  }
  getColGraphs(graphIds) {

    this.apiService.getWithHeaders('generatereport/graph' + graphIds).subscribe(res => {

      // this.report.graphs = res.map(graph => {
      //   return {
      //     ...graph,  // Spread the existing properties of the graph
      //     url: 'data:image/png;base64,' + graph.url  // Prepend the base64 string
      //   };
      // });
      this.report.graphs = res;
      this.colImagesSubject.next(this.report.graphs);
      console.log('col_graphs',this.report.graphs)
    })
  }
  close(){
    this.dailog.closeAll();
  }
}
