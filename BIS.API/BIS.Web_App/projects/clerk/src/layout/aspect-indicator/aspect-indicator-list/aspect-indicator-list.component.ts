import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/sharedlibrary/src/component/zipper-table/table-settings.model';
import { Aspect, Indicator } from 'projects/sharedlibrary/src/model/attribute.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-aspect-indicator-list',
  imports: [SharedLibraryModule],
  templateUrl: './aspect-indicator-list.component.html',
  styleUrl: './aspect-indicator-list.component.scss'
})
export class AspectIndicatorListComponent extends TablePaginationSettingsConfig implements OnInit{
  aspectList: Aspect[] = [];
  indicators: Indicator[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  aspect:Aspect = new Aspect();
  indicator:Indicator = new Indicator();
  aspectId:number;
  @ViewChild('aspectAdd') aspectTemplate;
  @ViewChild('indicatorAdd') indicatorTemplate;
  constructor(private apiService:ApiService,private dialogService:BISMatDialogService,private dailog:MatDialog,private toastr:ToastrService){
    super();
    this.tablePaginationSettings.enableAction = true;
    // this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    this.tablePaginationSettings.enableDelete = true;
    // this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.getAspect();
  }
  ngOnInit(): void {

  }
  saveDropDown(type: 'aspect' | 'indicator') {
    let payload: any;
    let endpoint: string;
    let successMessage: string;

    if (type === 'aspect') {
      payload = this.aspect;
      endpoint = 'attribute/aspect';
      successMessage = 'Aspect added successfully';
    } else if (type === 'indicator') {
      payload = this.indicator;
      endpoint = 'attribute/indicator';
      successMessage = 'Indicator added successfully';
    } else {
      console.error('Invalid type provided:', type);
      return;
    }

    this.apiService.postWithHeader(endpoint, payload).subscribe({
      next: (res) => {
        if (res) {
          this.toastr.success(successMessage);
          this.closeDialog();
          type == 'aspect' ? this.getAspect() : this.getIndicator(this.aspectId);
        }
      },
      error: (err) => {
        this.toastr.error('Something went wrong. Please try again.');
      }
    });
  }

  closeDialog(){
    this.dailog.closeAll();
  }
  addAspect(){
    this.dialogService.open(this.aspectTemplate,null,'30vw')
  }
  remove(item,type){
    this.dialogService.confirmDialog("remove " + item.name).subscribe(res => {
      if(res){
        this.apiService.getWithHeaders(`masterdata/deactivate/${item.id}/${type} `).subscribe(res =>{
          if(res){
            this.toastr.success("delete successfully",'success');
            if(type == 'aspect'){
              this.getAspect();
            }else{
              this.getIndicator(this.aspectId);
            }
          }
        })
      }
    })
  }
  onTabChange($event){
    if($event.index == 1){
      this.getIndicator(this.aspectId);
    }else{
      this.getAspect();
    }
  }
  addIndicator(){
    this.dialogService.open(this.indicatorTemplate,null,'30vw')
  }
  getAspect() {
    this.apiService.getWithHeaders('attribute/allaspect').subscribe(res => {
      if (res) {
        this.aspectList = res;
        this.aspectId = this.aspectList[0].id;
      }
    })
  }
  getIndicator(aspectId) {
    this.apiService.getWithHeaders('attribute/indicator/' + aspectId).subscribe(res => {
      if (res) {
        this.indicators = res;
      }
    })
  }
}
