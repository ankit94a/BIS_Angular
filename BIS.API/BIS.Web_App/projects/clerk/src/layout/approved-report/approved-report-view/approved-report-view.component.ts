import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApprovedReports, FullReport} from 'projects/sharedlibrary/src/model/generatereport.model';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BehaviorSubject } from 'rxjs';
import {MatGridListModule} from '@angular/material/grid-list';
@Component({
  selector: 'app-approved-report-view',
  imports: [SharedLibraryModule,MatGridListModule],
  templateUrl: './approved-report-view.component.html',
  styleUrl: './approved-report-view.component.scss'
})
export class ApprovedReportViewComponent {
  approvedReport: ApprovedReports = new ApprovedReports();
  fullReport: FullReport = new FullReport();
  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([]);

  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();

  constructor(@Inject(MAT_DIALOG_DATA) data, private apiService: ApiService, private masterDataService: MasterDataFilterService, private dialog: MatDialog) {
    this.approvedReport = data;
    this.fetchReportWithAllInfo()
  }

  fetchReportWithAllInfo() {
    this.apiService.postWithHeader('cdrdashboard/fullreport', this.approvedReport).subscribe(res => {
      if (res) {
        this.fullReport = res;
        const { Header, DataList } = this.masterDataService.getMasterData(this.fullReport.mergeReport.masterData);
                this.tableHeaderSubject.next(Header);
                this.masterDataListSubject.next(DataList);
      }
    })
  }
  close() {
    this.dialog.closeAll();
  }

  currentChapter = 1;
totalChapters = 2; // or however many you have

nextChapter() {
  if (this.currentChapter < this.totalChapters) {
    this.currentChapter++;
  }
}

prevChapter() {
  if (this.currentChapter > 1) {
    this.currentChapter--;
  }
}

}
