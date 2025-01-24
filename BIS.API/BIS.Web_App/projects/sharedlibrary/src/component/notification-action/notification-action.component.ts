import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { masterData } from '../../model/masterdata.model';
import { SharedLibraryModule } from '../../shared-library.module';
import { NotificationModel } from '../../model/notification.model';
import { EnumBase, NotificationType } from '../../model/enum';
import { GenerateReport, GraphImages } from '../../model/generatereport.model';
import { MasterDataFilterService } from '../../services/master-data-filter.service';
import { BehaviorSubject } from 'rxjs';
import { BisdefaultDatePipe } from '../../pipe/bisdefault-date.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-notification-action',
  imports: [SharedLibraryModule,CommonModule],
  templateUrl: './notification-action.component.html',
  styleUrl: './notification-action.component.css',
  providers:[BisdefaultDatePipe]
})
export class NotificationActionComponent extends EnumBase {
  selectedImages: { url: string; name: string }[] = []; // Array to store selected images

  masterData:masterData;
  notify:NotificationModel=new NotificationModel();
  report:GenerateReport;
  // handling unique table header & master Data;
  tableHeader = [];
  masterDataList = [];

  // Using BehaviorSubject for reactivity
  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([]);
  private chartImagesSubject = new BehaviorSubject<GraphImages[]>([]);

  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();
  chartImages$ = this.chartImagesSubject.asObservable();
  constructor(private cdr: ChangeDetectorRef,private masterDataService:MasterDataFilterService, @Inject(MAT_DIALOG_DATA) data,private apiService:ApiService,private dialogRef:MatDialogRef<NotificationActionComponent>){
    super();
    this.notify = data;
    this.masterData = new masterData();
    if(this.notify.notificationType == NotificationType.MasterData){
      this.getMasterData(this.notify.dataId)
    }else{
      this.report = new GenerateReport();
      this.getReport();
    }

  }
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.selectedImages.push({
              url: e.target.result.toString(),
              name: file.name,
            });
          }
        };
        reader.readAsDataURL(file);
      });
      console.log(this.selectedImages)
    }
  }

  getReport(){
    this.apiService.postWithHeader('notification/report',this.notify).subscribe(res =>{
      if(res){
        this.report = res;
        this.getMasterList();
        if(this.report.graphIds != undefined && this.report.graphIds != null && this.report.graphIds != ''){
          this.getGraphs();
        }
      }
    })
  }
  getGraphs(){
    this.apiService.getWithHeaders('generatereport/graph'+this.report.graphIds).subscribe(res =>{
      this.report.graphs = res.map(graph => {
        return {
          ...graph,  // Spread the existing properties of the graph
          url: 'data:image/png;base64,' + graph.url  // Prepend the base64 string
        };
      });
      console.log(this.report)
      this.chartImagesSubject.next(this.report.graphs );
    })
  }
  getMasterList(){
    this.apiService.getWithHeaders('masterdata/idsList'+this.report.masterDataIds).subscribe(res =>{
      if(res){
        this.report.masterData = res;
       const {Header,DataList} = this.masterDataService.getMasterData(res);
       this.tableHeaderSubject.next(Header);
       this.masterDataListSubject.next(DataList);
      }
    })
  }
  approved(){
    this.apiService.postWithHeader('notification/updatestatus',this.notify).subscribe(res =>{
      if(res){
        this.dialogRef.close(true);
      }
    })
  }
  getMasterData(masterDataId){
    this.apiService.getWithHeaders('masterdata/getbyid'+ masterDataId).subscribe(res =>{
      if(res){
        this.masterData = res;
        const {Header,DataList} = this.masterDataService.getMasterData([res])
        this.tableHeaderSubject.next(Header);
       this.masterDataListSubject.next(DataList);
      }
    })
  }
  close(){
    this.dialogRef.close(true);
  }
}
