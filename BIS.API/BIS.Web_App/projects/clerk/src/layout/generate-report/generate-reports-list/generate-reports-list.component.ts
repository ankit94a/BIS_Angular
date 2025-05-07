import { Component, OnInit } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/sharedlibrary/src/component/zipper-table/table-settings.model';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { GenerateReportsAddComponent } from '../generate-reports-add/generate-reports-add.component';
import { ZipperTableComponent } from 'projects/sharedlibrary/src/component/zipper-table/zipper-table.component';
import { GenerateReport } from 'projects/sharedlibrary/src/model/generatereport.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';
import { GenerateReportViewComponent } from '../generate-report-view/generate-report-view.component';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IsCurrentUserPipe } from 'projects/sharedlibrary/src/pipe/is-current-user.pipe';
import { NotificationType } from 'projects/sharedlibrary/src/model/enum';
import { NotificationActionComponent } from 'projects/sharedlibrary/src/component/notification-action/notification-action.component';

@Component({
  selector: 'app-generate-reports-list',
  imports: [ZipperTableComponent,SharedLibraryModule],
  templateUrl: './generate-reports-list.component.html',
  styleUrl: './generate-reports-list.component.scss',
  providers:[BisdefaultDatePipe]
})
export class GenerateReportsListComponent extends TablePaginationSettingsConfig implements OnInit {
  isRefresh:boolean=false;
  isCommand:boolean =false;
  generateReportList: GenerateReport[] = [];
  constructor(private spinner:NgxSpinnerService, private dialogService:BISMatDialogService,private apiService:ApiService ,private datePipe:BisdefaultDatePipe,private authService:AuthService){
    super();

    this.tablePaginationSettings.enableAction = true;
    // this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableDelete = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
    if(parseInt(this.authService.getRoleType()) >= 10)
      this.isCommand = true;
  }
  ngOnInit() {
    this.spinner.show();
    this.getReportData()
  }
  getRowData(row){
    row.notificationType = NotificationType.GenerateReport;
    row.dataId = row.id;
    this.dialogService.open(NotificationActionComponent,row)
  }
  getReportData() {
    this.spinner.show();
    this.apiService.getWithHeaders('GenerateReport').subscribe(res =>{
      if(res){
        res.sort((a,b) => b.id - a.id)
        this.generateReportList = res;
        this.spinner.hide();
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
    $event.isView = true;
    this.dialogService.open(GenerateReportViewComponent,$event)
  }

  edit($event){
    this.dialogService.open(GenerateReportViewComponent,$event)
  }

  columns = [
    {
      name: 'reportType', displayName: 'Report Type', isSearchable: false
    },
    {
      name: 'reportDate', displayName: 'Report Date', isSearchable: false
      , valuePrepareFunction : (row =>{
        return this.datePipe.transform(row.reportDate)
      })
    },
    {
      name: 'startDate', displayName: 'Start Date', isSearchable: false
      ,valuePrepareFunction : (row =>{
        return this.datePipe.transform(row.startDate)
      })
    },
    {
      name: 'endDate', displayName: 'End Date', isSearchable: false
      ,valuePrepareFunction : (row =>{
        return this.datePipe.transform(row.endDate)
      })
    },
    {
      name: 'reportTitle', displayName: 'Report Title', isSearchable: false
    },
    {
      name: 'notes', displayName: 'Notes', isSearchable: false
    }

  ]
}
