import { Component, OnInit } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/sharedlibrary/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/sharedlibrary/src/component/zipper-table/zipper-table.component';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-saved-notes',
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './saved-notes.component.html',
  styleUrl: './saved-notes.component.scss'
})
export class SavedNotesComponent extends TablePaginationSettingsConfig implements OnInit{
  savedNotesList = [];
  isRefresh = false;
  constructor(private apiService:ApiService){
    super();
    // this.tablePaginationSettings.enableAction = true;
    // this.tablePaginationSettings.enableEdit = true;
    // this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableDelete = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
  }
  ngOnInit(): void {
    this.getSavedNotes();
  }
  getSavedNotes(){
    this.apiService.getWithHeaders('SavedNotes').subscribe(res => {
      if(res){
        this.savedNotesList = res;
      }
    })
  }
  view(event){

  }
  edit(event){

  }
  getMore(event){

  }
  columns = [
    {
      name: 'savedNotesId', displayName: 'S.no', isSearchable: false
    },
    {
      name: 'savedNote', displayName: 'Saved Notes', isSearchable: false
    },
    {
      name:'checkingDate',displayName:'Date',isSearchable:false
    }
  ]
}
