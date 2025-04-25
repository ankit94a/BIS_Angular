import { Component, OnInit } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/sharedlibrary/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/sharedlibrary/src/component/zipper-table/zipper-table.component';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { ApprovedReportViewComponent } from '../approved-report-view/approved-report-view.component';
import { ApprovedReports } from 'projects/sharedlibrary/src/model/generatereport.model';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';

@Component({
  selector: 'app-approved-reports',
  imports: [SharedLibraryModule, ZipperTableComponent],
  templateUrl: './approved-reports.component.html',
  styleUrl: './approved-reports.component.scss',
  providers:[BisdefaultDatePipe]
})
export class ApprovedReportsComponent extends TablePaginationSettingsConfig implements OnInit {
  isRefresh: boolean = false;
  DataList:ApprovedReports [] = [];
  constructor(private apiService: ApiService, private dialogService: BISMatDialogService,private datePipe:BisdefaultDatePipe) {
    super()
    this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableView = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
  }
  ngOnInit(): void {
    this.getAllInference();
  }

  getAllInference() {
    this.apiService.getWithHeaders('cdrdashboard/inference').subscribe(res => {
      if (res) {
        this.DataList = res;
      }
    })
  }

  view(data) {
    this.dialogService.open(ApprovedReportViewComponent,data)
  }

  columns = [
    {
      name: 'createdOn', displayName: 'Approved Date', isSearchable: true,valuePrepareFunction:(row) =>{
        return this.datePipe.transform(row.createdOn)
    }
  },
    {
      name: 'enForceLevel', displayName: 'En Force Level', isSearchable: true
    },
    {
      name: 'enLikelyAim', displayName: 'En Likely Aim', isSearchable: true
    },
    {
      name: 'enLikelyTgt', displayName: 'En Likely Tgt', isSearchable: true
    },
    {
      name: 'nextActionByEn', displayName: 'Next Action By En', isSearchable: true
    },
    {
      name: 'ownImdtAction', displayName: 'Own Imdt Action', isSearchable: true
    }

  ]
}
