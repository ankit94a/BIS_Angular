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

@Component({
  selector: 'app-master-data',
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent extends TablePaginationSettingsConfig implements OnInit {
  DataList:masterData[] = [];
  isRefresh=false;
  sortedData = [];
  constructor(private apiService:ApiService,private dialogService:BISMatDialogService){
    super();
  this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableDelete = true;
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
  }
  ngOnInit(): void {
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

  }
  edit(event){

  }
  getMoreSameples($event){

  }
  filterType = ['Created','Processing','Approved','Rejected']
  filterData($event){
    debugger;
    if($event == 'Created'){
      this.DataList = this.sortedData.filter(item => item.status == Status.Created)
    }else if($event == 'Processing'){
      this.DataList = this.sortedData.filter(item => item.status == Status.Progress)
    }else if($event == 'Approved'){
      this.DataList = this.sortedData.filter(item => item.status == Status.Approved)
    }else{
      this.DataList = this.sortedData.filter(item => item.status == Status.Rejected)
    }
  }
  getDataFromServer(){
    this.apiService.getWithHeaders('MasterData').subscribe(res => {
      if(res){
        res.sort((a,b) => b.id - a.id);
        this.sortedData = res;
        this.DataList = res;

      }
    })
  }
  columns = [
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
