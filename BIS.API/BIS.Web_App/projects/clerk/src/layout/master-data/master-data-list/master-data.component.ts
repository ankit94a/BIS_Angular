import { Component, OnInit } from '@angular/core';
import { SharedLibraryModule } from '../../../../../sharedlibrary/src/shared-library.module';
import { TablePaginationSettingsConfig } from '../../../../../sharedlibrary/src/component/zipper-table/table-settings.model';
import { ApiService } from '../../../../../sharedlibrary/src/services/api.service';
import { masterData } from '../../../../../sharedlibrary/src/model/masterdata.model';
import { ZipperTableComponent } from '../../../../../sharedlibrary/src/component/zipper-table/zipper-table.component';
import { BISMatDialogService, } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { MasterDataAddComponent } from '../master-data-add/master-data-add.component';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';
import { Status } from 'projects/sharedlibrary/src/model/enum';
import { Router } from '@angular/router';
import { MasterDataService } from 'projects/sharedlibrary/src/services/master-data.service';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { DownloadService } from 'projects/sharedlibrary/src/services/download.service';
import { formatDate } from '@angular/common';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationModel } from 'projects/sharedlibrary/src/model/notification.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-master-data',
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss',
  providers:[BisdefaultDatePipe]
})
export class MasterDataComponent extends TablePaginationSettingsConfig implements OnInit {
  DataList:masterData[] = [];
  isRefresh=false;
  sortedData = [];
  selectedSample;
  roleType;
  isCommand:boolean=false;
  filterType = ['All','Created','Processing','Approved','Rejected']
  constructor(private authService:AuthService,private toastr:ToastrService, private spinnerService: NgxSpinnerService,private datePipe:BisdefaultDatePipe,private apiService:ApiService,private downloadService:DownloadService,private masterFilterService:MasterDataFilterService,private dialogService:BISMatDialogService,private router:Router,private masterDataService:MasterDataService){
    super();
    this.roleType = this.authService.getRoleType();
    this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.tablePaginationSettings.enableApproved = true;
    if(parseInt(this.authService.getRoleType()) >= 10)
      this.isCommand = true;
  }
  getSelectedRows($event){
    this.selectedSample = $event;
  }
  isApproved($event){
    var notify = new NotificationModel();
    notify.dataId = $event.id;
    notify.CorpsId = $event.corpsId;
    notify.DivisionId = $event.divisionId;
    $event.action == true? notify.status = Status.Approved : notify.status = Status.Rejected;
    this.apiService.postWithHeader(`notification/updatestatus`, notify).subscribe(res => {
      if (res) {
        $event.action == true ? this.toastr.success("Input approved successfully", 'success') : this.toastr.success("Input rejected successfully", 'success');
        this.getDataFromServer();
      }
    })
  }
  exportToExcel() {
    if (this.selectedSample?.length > 0) {
        const { Header, DataList } = this.masterFilterService.getMasterData(this.selectedSample);
        const fileName = `Master_Data_${formatDate(new Date(), 'd MMM yyyy', 'en')}.xlsx`;
        const Data = DataList.map(item => {
            return Header.map(head => item[head] ?? '');
        });
        this.downloadService.SaveExcel(null, null, fileName, Data, Header);
    } else {
        console.warn('No data selected to export.');
    }
}

  ngOnInit(): void {
    this.spinnerService.show();
    this.getDataFromServer();
  }
  add(){
   const dialogRef = this.dialogService.open(MasterDataAddComponent,null).then(res =>{
    if(res){
      this.getDataFromServer();
    }
   });

  }
  view($event){
    const dialogRef = this.dialogService.open(MasterDataAddComponent,$event)
  }
  edit(event: masterData) {
    event.isView = false;
    this.masterDataService.setMasterData(event);
    this.router.navigate(['master-data-form'], { queryParams: { id: event.id } });
  }

  getMoreSameples($event){

  }

  filterData($event){
    if($event == 'Created'){
      return this.sortedData = this.DataList.filter(item => item.status == Status.Created)
    }else if($event == 'Processing'){
      return this.sortedData = this.DataList.filter(item => item.status == Status.Progress)
    }else if($event == 'Approved'){
      return this.sortedData = this.DataList.filter(item => item.status == Status.Approved)
    }else if($event == 'Rejected'){
      return this.sortedData = this.DataList.filter(item => item.status == Status.Rejected)
    }else{
      return this.sortedData = [...this.DataList];
    }
  }
  getDataFromServer(){
    this.spinnerService.show(undefined,{
      type:'square-jelly-box',
      bdColor:'rgba(0,0,0,0.8)',
      color:'#fff',
      size:'default'
    });
    this.apiService.getWithHeaders('MasterData').subscribe(res => {
      if(res){
        res = res.sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime());
        this.sortedData = res;
        this.DataList = res;
        this.spinnerService.hide();
      }
    })
  }
  columns = [
    {
      name: 'reportedDate', displayName: 'Input Date', isSearchable: false,valuePrepareFunction:(row) =>{
        return this.datePipe.transform(row.reportedDate)
      }
    },
    {
      name: 'name', displayName: 'Input Level', isSearchable: true
    },
    {
      name: 'sector', displayName: 'Sector', isSearchable: true
    },
    {
      name: 'masterSectorID', displayName: 'Sector Master', isSearchable: true
    },
    {
      name: 'frmn', displayName: 'Frmn', isSearchable: true
    },
    {
      name: 'source', displayName: 'Source', isSearchable: true
    },
    {
      name: 'sourceLoc', displayName: 'SourceLoc', isSearchable: true
    },
    {
      name: 'typeOfLoc', displayName: 'TypeOfLoc', isSearchable: true
    },
    {
      name: 'enLocName', displayName: 'EnLocName', isSearchable: true
    },
    {
      name: 'aspect', displayName: 'Aspect', isSearchable: true
    },
    {
      name: 'aGenda', displayName: 'AGenda', isSearchable: false,hide: true,
    },
    {
      name: 'fcLoc', displayName: 'FC Loc', isSearchable: false,hide: true,
    },
    {
      name: 'fcDate', displayName: 'FC Date', isSearchable: false,hide: true,
    },
    {
      name: 'hcLoc', displayName: 'Hc Loc', isSearchable: false,hide: true,
    },
    {
      name: 'hcTime', displayName: 'Hc Time', isSearchable: false,hide: true,
    },
    {
      name: 'hcType', displayName: 'Hc Type', isSearchable: false,hide: true,
    },
    {
      name: 'ipcTimeFrom', displayName: 'Ipc TimeFrom', isSearchable: false,hide: true,
    },
    {
      name: 'ipcType', displayName: 'Ipc Type', isSearchable: false,hide: true,
    },
    {
      name: 'irRemarks', displayName: 'Ir Remarks', isSearchable: false,hide: true,
    },
    {
      name: 'jammingTimeFrom', displayName: 'Jamming TimeFrom', isSearchable: false,hide: true,
    },
    {
      name: 'jammingTimeTo', displayName: 'Jamming TimeTo', isSearchable: false,hide: true,
    },
    {
      name: 'jammingRemarks', displayName: 'Jamming Remarks', isSearchable: false,hide: true,
    },
    {
      name: 'teHault', displayName: 'Te Hault', isSearchable: false,hide: true,
    },
    {
      name: 'teLoc', displayName: 'Te Loc', isSearchable: false,hide: true,
    },
    {
      name: 'teDate', displayName: 'Te Date', isSearchable: false,hide: true,
    },
  ]
}
