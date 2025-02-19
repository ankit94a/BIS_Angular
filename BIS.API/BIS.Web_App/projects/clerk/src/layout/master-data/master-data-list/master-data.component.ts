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
import { ActionDropdownComponent } from 'projects/sharedlibrary/src/component/action-dropdown/action-dropdown.component';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { DownloadService } from 'projects/sharedlibrary/src/services/download.service';
// import * as  ExcelJS from 'exceljs';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-master-data',
  imports: [SharedLibraryModule,ZipperTableComponent,ActionDropdownComponent],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent extends TablePaginationSettingsConfig implements OnInit {
  DataList:masterData[] = [];
  isRefresh=false;
  sortedData = [];
  selectedSample;
  constructor(private apiService:ApiService,private downloadService:DownloadService,private masterFilterService:MasterDataFilterService,private dialogService:BISMatDialogService,private router:Router,private masterDataService:MasterDataService){
    super();
  this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableDelete = true;
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
  }
  getSelectedRows($event){
    this.selectedSample = $event;
  }
  // exportToExcel() {
  //   if (this.selectedSample?.length > 0) {
  //     const { Header, DataList } = this.masterFilterService.getMasterData(this.selectedSample);
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet('Master Data');
  //     const fileName = `Master_Data_${formatDate(new Date(), 'd MMM yyyy', 'en')}.xlsx`;
  
  //     // Generate the data array by mapping headers to each data row
  //     const Data = DataList.map(item => {
  //       return Header.map(head => item[head] ?? '');
  //     });
  
  //     // Pass the structured data and header to the download service
  //     this.downloadService.SaveExcel(worksheet, workbook, fileName, Data, Header);
  //   } else {
  //     console.warn('No data selected to export.');
  //   }
  // }
  exportToExcel() {
    if (this.selectedSample?.length > 0) {
        const { Header, DataList } = this.masterFilterService.getMasterData(this.selectedSample);
        const fileName = `Master_Data_${formatDate(new Date(), 'd MMM yyyy', 'en')}.xlsx`;

        // Generate the data array by mapping headers to each data row
        const Data = DataList.map(item => {
            return Header.map(head => item[head] ?? ''); // Get corresponding value for each header
        });

        // Pass the structured data and header to the download service
        this.downloadService.SaveExcel(null, null, fileName, Data, Header);
    } else {
        console.warn('No data selected to export.');
    }
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
    const dialogRef = this.dialogService.open(MasterDataAddComponent,$event)
  }
  edit(event: masterData) {
    event.isView = false;
    this.masterDataService.setMasterData(event);
    this.router.navigate(['master-data-form'], { queryParams: { id: event.id } });
  }
  
  getMoreSameples($event){

  }
  filterType = ['Created','Processing','Approved','Rejected']
  filterData($event){
    let res;
    if($event == 'Created'){
      res = this.DataList = this.sortedData.filter(item => item.status == Status.Created)
    }else if($event == 'Processing'){
      res = this.sortedData.filter(item => item.status == Status.Progress)
    }else if($event == 'Approved'){
      res = this.sortedData.filter(item => item.status == Status.Approved)
    }else{
      res = this.sortedData.filter(item => item.status == Status.Rejected)
    }
    this.DataList = [...res]
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
