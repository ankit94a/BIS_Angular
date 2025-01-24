import { Component, OnInit } from '@angular/core';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { FacilityAddComponent } from '../facility-add/facility-add.component';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { Facility } from 'projects/sharedlibrary/src/model/facility.model';
import { TablePaginationSettingsConfig } from '../../zipper-table/table-settings.model';
import { ZipperTableComponent } from '../../zipper-table/zipper-table.component';

@Component({
  selector: 'lib-facility-list',
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './facility-list.component.html',
  styleUrl: './facility-list.component.css'
})
export class FacilityListComponent extends TablePaginationSettingsConfig implements OnInit{
  facilityList:Facility[]=[];
  isRefresh = false
  constructor(private dialogService:BISMatDialogService,private apiService:ApiService){
    super();
    this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
  }
  ngOnInit(): void {
    this.getAll();
  }
  getAll(){
    this.apiService.getWithHeaders('facility').subscribe(res =>{
      if(res){
        this.facilityList = res;
      }
    })
  }
  add(row=''){
    this.dialogService.open(FacilityAddComponent,row).then(res =>{
      if(res){
        this.getAll()
      }
    })
  }
  view(row){
    row.isView = true;
    this.add(row);
  }
  edit(row){
    row.isView = false;
    this.add(row)
  }
  columns = [
    {
      name: 'registeredName', displayName: 'Name', isSearchable: false
    },
    {
      name: 'registeredAddress', displayName: 'Address', isSearchable: false
    },
    {
      name: 'facilityType', displayName: 'Type', isSearchable: false
    },
    {
      name: 'primaryContactNumber', displayName: 'Contact', isSearchable: false
    },
  ]
}
