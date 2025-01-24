import { Component, OnInit } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/sharedlibrary/src/component/zipper-table/table-settings.model';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { GenerateReportsAddComponent } from '../generate-reports-add/generate-reports-add.component';
import { ZipperTableComponent } from 'projects/sharedlibrary/src/component/zipper-table/zipper-table.component';
import { GenerateReport } from 'projects/sharedlibrary/src/model/generatereport.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';

@Component({
  selector: 'app-generate-reports-list',
  imports: [ZipperTableComponent,SharedLibraryModule],
  templateUrl: './generate-reports-list.component.html',
  styleUrl: './generate-reports-list.component.scss',
  providers:[BisdefaultDatePipe]
})
export class GenerateReportsListComponent extends TablePaginationSettingsConfig implements OnInit {
  isRefresh:boolean=false;
  generateReportList: GenerateReport[] = [];
  constructor(private dialogService:BISMatDialogService,private apiService:ApiService ,private datePipe:BisdefaultDatePipe){
    super();
    debugger
    this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableDelete = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
  }
  ngOnInit() {
    this.getReportData()
  }
  getReportData() {
    this.apiService.getWithHeaders('GenerateReport').subscribe(res =>{
      if(res){
        this.generateReportList = res;
      }
    })
  }
  add(){
    this.dialogService.open(GenerateReportsAddComponent,null).then(res =>{
      if(res){
        this.getReportData();
      }
    })

  }
  getMoreSameples($event){

  }
  view($event){
    debugger
    this.dialogService.open(GenerateReportsAddComponent,$event).then(res =>{
      if(res){
        this.getReportData()
      }
    })
  }
  edit($event){

  }
  
  columns = [
    {
      name: 'reportGenId', displayName: 'Report Id', isSearchable: false
    },
    {
      name: 'reportType', displayName: 'Report Type', isSearchable: false
    },
    {
      name: 'reportDate', displayName: 'Report Date', isSearchable: false
    },
    {
      name: 'startDate', displayName: 'Start Date', isSearchable: false
    },
    {
      name: 'endDate', displayName: 'End Date', isSearchable: false
    },
    {
      name: 'reportTitle', displayName: 'Report Title', isSearchable: false
    },
    {
      name: 'notes', displayName: 'Notes', isSearchable: false
    }

  ]
}
