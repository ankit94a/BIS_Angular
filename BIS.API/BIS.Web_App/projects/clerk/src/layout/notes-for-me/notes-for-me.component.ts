import { Component, OnInit } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/sharedlibrary/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/sharedlibrary/src/component/zipper-table/zipper-table.component';
import { InotesForMe, ItpsToTask } from 'projects/sharedlibrary/src/model/notes-for-me.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-notes-for-me',
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './notes-for-me.component.html',
  styleUrl: './notes-for-me.component.scss'
})
export class NotesForMeComponent extends TablePaginationSettingsConfig implements OnInit{
  notesForMeList: InotesForMe[] = [];
  isRefresh=false;
  tasklist:ItpsToTask[]=[];
  constructor(private apiService:ApiService){
    super()
    // this.tablePaginationSettings.enableAction = true;
    // this.tablePaginationSettings.enableEdit = true;
    // this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableDelete = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
  }
  ngOnInit(): void {
  this.getUser()
  this.getUSer2()
  }
  getUser(){
    this.apiService.getWithHeaders('NotesForMe').subscribe(res =>{
      if(res){
        this.notesForMeList = res;
      }
    })
  }
  getUSer2(){
    this.apiService.getWithHeaders('TpsToTask').subscribe(res =>{
      if(res){
        this.tasklist = res;
      }
    })
  }
  columns = [
    {
      name: 'sector', displayName: 'Sector', isSearchable: true
    },
    {
      name: 'fmn', displayName: 'Fmn', isSearchable: true
    },
    {
      name: 'aspect', displayName: 'Aspect', isSearchable: true
    },
    {
      name: 'indicators', displayName: 'Indicators', isSearchable: true
    },
    {
      name: 'notes', displayName: 'Notes', isSearchable: true
    }
  ]
  columns1 = [
    {
      name: 'fmn', displayName: 'Fmn', isSearchable: true
    },
    {
      name: 'bde', displayName: 'Bde', isSearchable: true
    },
    {
      name: 'unit', displayName: 'Unit', isSearchable: true
    },
    {
      name: 'composition', displayName: 'Composition', isSearchable: true
    },
    {
      name: 'task', displayName: 'Task', isSearchable: true
    },
    {
      name: 'overallResponsibility', displayName: 'Overall Responsibility', isSearchable: true
    }
  ]
}
