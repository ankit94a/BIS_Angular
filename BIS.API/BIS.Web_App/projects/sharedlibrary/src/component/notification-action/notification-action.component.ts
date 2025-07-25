import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { masterData } from '../../model/masterdata.model';
import { SharedLibraryModule } from '../../shared-library.module';
import { NotificationModel } from '../../model/notification.model';
import { EnumBase, NotificationType, Status } from '../../model/enum';
import { GenerateReport, GraphImages, MergeReports } from '../../model/generatereport.model';
import { MasterDataFilterService } from '../../services/master-data-filter.service';
import { BehaviorSubject } from 'rxjs';
import { BisdefaultDatePipe } from '../../pipe/bisdefault-date.pipe';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-notification-action',
  imports: [SharedLibraryModule, CommonModule],
  templateUrl: './notification-action.component.html',
  styleUrl: './notification-action.component.css',
  providers: [BisdefaultDatePipe]
})
export class NotificationActionComponent extends EnumBase {
  selectedImages: { url: string; name: string }[] = []; 
  masterData: masterData;
  notify: NotificationModel = new NotificationModel();
  report: GenerateReport;
  report2: GenerateReport;
  tableHeader = [];
  masterDataList = [];
  userRole = this.authService.getRoleType()

  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([]);
  private chartImagesSubject = new BehaviorSubject<GraphImages[]>([]);

  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();
  chartImages$ = this.chartImagesSubject.asObservable();

  mergeReport:MergeReports = new MergeReports();
  constructor(private authService:AuthService,private toastr: ToastrService, private cdr: ChangeDetectorRef, private masterDataService: MasterDataFilterService, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService, private dialogRef: MatDialogRef<NotificationActionComponent>) {
    super();
    this.notify = data;
    this.masterData = new masterData();
    if (this.notify.notificationType == NotificationType.MasterData) {
      this.getMasterData(this.notify.dataId)
    } else if(this.notify.notificationType == NotificationType.GenerateReport) {
      this.report2 = new GenerateReport();
      this.mergeReport.masterData = [];
      this.getReport();
    }
    this.Viewed();
  }
  Viewed() {
    this.apiService.postWithHeader('notification/viewed', this.notify).subscribe(res => {
      if (res) {

      }
    });
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
    }
  }
  excluedeFields = ['Id', 'Status', 'UserId', 'Fmn', 'CreatedBy', 'CreatedOn', 'IsActive', 'IsDeleted', 'CorpsId', 'DivisionId','ReportedDate']

  getReport() {
    this.notify.isReaded
    this.apiService.postWithHeader('notification/getreport', this.notify).subscribe(res => {
      if (res) {
        this.mergeReport = res;
        const { Header, DataList } = this.masterDataService.getMasterData(this.mergeReport.masterData);
                this.tableHeaderSubject.next(Header);
                this.masterDataListSubject.next(DataList);
      }
    })
  }


  changeStatus(isApproved) {
    isApproved ? this.notify.status = Status.Approved : this.notify.status = Status.Rejected;
    this.apiService.postWithHeader(`notification/updatestatus`, this.notify).subscribe(res => {
      if (res) {
        isApproved ? this.toastr.success("Input approved successfully", 'success') : this.toastr.success("Input rejected successfully", 'success');
        this.close(true);
      }
    })
  }

  getMasterData(masterDataId) {
    this.apiService.getWithHeaders('masterdata/getbyid' + masterDataId).subscribe(res => {
      if (res) {
        this.masterData = res;
        const { Header, DataList } = this.masterDataService.getMasterData([res])
        this.tableHeaderSubject.next(Header);
        this.masterDataListSubject.next(DataList);
      }
    })
  }
  close(status) {
    this.dialogRef.close(status);
  }

  submitReport() {
    this.report2.reportTitle = this.mergeReport.reportTitle;
    this.report2.reportType = this.mergeReport.reportType;
    this.report2.reportDate = new Date();
    this.report2.startDate = this.mergeReport.startDate;
    this.report2.endDate = this.mergeReport.endDate;
    this.report2.graphs = this.selectedImages;
    this.report2.rptId = this.mergeReport.id;
    this.report2.isRead = this.mergeReport.isRead;
    this.apiService.postWithHeader('GenerateReport', this.report2).subscribe(res => {
      if (res) {
        this.toastr.success("Report saved successfully", 'success');
        this.close(true);
      }
    })
  }
}
