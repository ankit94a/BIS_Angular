import { Component, QueryList, ViewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GetMeanvalueColorDirective } from 'projects/sharedlibrary/src/directives/get-meanvalue-color.directive';
import { Aspect, Indicator, Sector } from 'projects/sharedlibrary/src/model/attribute.model';
import { FilterModel, FilterModel4 } from 'projects/sharedlibrary/src/model/dashboard.model';
import { FilterType } from 'projects/sharedlibrary/src/model/enum';
import { GenerateReport } from 'projects/sharedlibrary/src/model/generatereport.model';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BehaviorSubject } from 'rxjs';
import { CdrInferenceComponent } from './cdr-inference/cdr-inference.component';
import { GenerateReportViewComponent } from '../generate-report/generate-report-view/generate-report-view.component';

@Component({
  selector: 'app-cdr-dashboard',
  imports: [SharedLibraryModule,BaseChartDirective,GetMeanvalueColorDirective,RouterModule],
  templateUrl: './cdr-dashboard.component.html',
  styleUrl: './cdr-dashboard.component.scss'
})
export class CdrDashboardComponent {
  filterModel:FilterModel4 = new FilterModel4();
  filterModel2:FilterModel = new FilterModel();
  entriesChart: ChartData<'line'>;
  fmnList = [];
  sectorList: Sector[] = [];
  aspectList: Aspect[] = [];
  indicatorList: Indicator[] = [];
  meanChartList;
  allReports:GenerateReport[] = [];

  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([]);
  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  staffList = ['Staff1','Staff2','Staff3']
  notesList = ['None','temp1','temp2','temp3']
  selected11: string = 'Monthly';
  selectedType11 = 'Daily';
  filterNew :{Sector?: string, Aspects?: string, Indicator?: string,startDate?: Date, endDate?: Date} ={};
  selectedNew = 'any';
  frmnList:any[]=[];
  constructor(private apiService:ApiService, private authService: AuthService,private masterDataService:MasterDataFilterService,private dialogService:BISMatDialogService){
    this.getFrmDetails();
    this.filterModel.filterType = FilterType.Daily;
    this.filterModel2.startDate = new Date();
    this.filterModel2.endDate = new Date();

  }
  getFrmDetails() {
    this.apiService.getWithHeaders('dashboard/FmnDetails').subscribe(res => {
      if (res) {
        this.frmnList = res;
        var divisionId = parseInt(this.authService.getDivisionId());
        var corpsId = parseInt(this.authService.getCorpsId());
        var frm = this.frmnList.find(item => item.corpsId === corpsId && item.divisionId === divisionId);
        if (frm) {
          if (!this.filterModel.frmn) {
            this.filterModel.frmn = [];
          }
          this.filterModel.frmn.push({ ...frm });
          this.getAll();
        }
      }
    })
  }
  getAll(){
    this.getSector();
    this.getAspect();
    this.getEntries();
    this.getReportByDate();
  }
  viewObj(item){
    item.isView = false;
    this.dialogService.open(GenerateReportViewComponent,item);
  }
  addInference(item){
    this.dialogService.open(CdrInferenceComponent,item);
  }
  getReportByDate(){
    this.apiService.getWithHeaders('cdrdashboard').subscribe(res =>{
      if(res){
        this.allReports = res;
      }
    })
  }
  isWithinSixHours(dateString: string | Date): boolean {
    const createdTime = new Date(dateString).getTime();
    const currentTime = new Date().getTime();
    const sixHoursInMs = 6 * 60 * 60 * 1000; 
    return (currentTime - createdTime) <= sixHoursInMs;
  }
  

  getWeekRange(
    weekNumber: number,
    year: number
  ): { startDate: Date; endDate: Date } {
    const firstDayOfYear = new Date(year, 0, 1); 
    const daysOffset = (weekNumber - 1) * 7; 
    const firstWeekStart = new Date(
      firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000
    );

    const dayOfWeek = firstWeekStart.getDay(); 
    const startDate = new Date(firstWeekStart);
    startDate.setDate(startDate.getDate() - (dayOfWeek - 1)); 

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); 

    return { startDate, endDate };
  }
  getMeanData(date){
    if (date.startsWith('Week')) {
      const match = date.match(/^Week (\d{1,2}), (\d{4})$/);
      if (match) {
        const weekNumber = parseInt(match[1], 10);
        const year = parseInt(match[2], 10);
        const { startDate, endDate } = this.getWeekRange(weekNumber, year);

        this.filterModel.startDate = startDate;
        this.filterModel.endDate = endDate;
      }
    } else {
      this.filterModel.startDate = date;
      this.filterModel.endDate = date;
    }

    this.apiService.postWithHeader('smartanalysis/getentrieschart/entrydata',this.filterModel).subscribe(res =>{
      const {Header,DataList} = this.masterDataService.getMasterData(res);
      this.tableHeaderSubject.next(Header);
       this.masterDataListSubject.next(DataList);
    })
  }
  getIndicatorForEntries(event) {
    if (event != undefined && event != null) {
      this.getEntries()
      this.apiService.postWithHeader('attribute/indicatorlist', event).subscribe(res => {
        if (res) {
          this.indicatorList = res;
        }
      })
    }
  }
  getEntries() {
    this.tableHeaderSubject.next([]);
    this.masterDataListSubject.next([]);
    this.apiService
      .postWithHeader('smartanalysis/getentries', this.filterModel)
      .subscribe((res) => {
        if (res) {
          this.meanChartList = res;

          this.entriesChart = {
            labels: res.name,
            datasets: [
              {
                data: res.count,
                label: 'Inputs Count',
                borderColor: 'rgba(70, 79, 88, 0.7)',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: res.count.map((value, index) =>
               {
                if(value >= 400){
                  return '#FE4F2D'
                } else if(value >= 200 && value <= 400){
                  return '#FFA725'
                }else if(value >= 100 && value <= 200){
                  return '#F6DC43'
                }else{
                   return '#A0C878'
                }
               }
                ),
              },
              {
                data: res.meanValue,
                label: 'Mean Value',
                borderColor: 'rgba(143, 92, 35, 0.5)',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#205781', 
              },
            ],
          };
        }
      });
  }
  getSector() {
    this.apiService.getWithHeaders('attribute/sector').subscribe(res => {
      if (res) {
        this.sectorList = res;
      }
    })
  }
  getAspect() {
    this.apiService.getWithHeaders('attribute/AllAspect').subscribe(res => {
      if (res) {
        this.aspectList = res;
      }
    })
  }
  getIndicator(event) {
    if (event != undefined && event != null) {
      this.apiService.postWithHeader('attribute/indicatorlist', event).subscribe(res => {
        if (res) {
          this.indicatorList = res;
        }
      })
    }
  }


  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataValue = tooltipItem.raw;
            return ` ${dataValue}`;
          },
        },
      },
      title: {
        display: false,
        text: '',
        font: {
          size: 16,
        },
        align: 'center',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 60,
          minRotation: 60,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
        beginAtZero: true,
      },
    },
  };
  download(chartId: string): void {
    let index = 0;
    switch (chartId) {
      case 'chart0': index = 0; break;
    }
    const chartDirective = this.charts.toArray()[index];

    if (chartDirective?.chart) {
      const base64Image = chartDirective.chart.toBase64Image();
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = `${chartId}.png`;
      link.click();
    } else {
    }
  }

  filternew():void{
    if(this.filterNew.startDate != null && this.filterNew.endDate !=null){
    this.getWeeklyEntries();
    this.getMEntries();
    this.getDEntries();
  }
  this.getDEntries();
  this.getMEntries();
  }
  getWeeklyentries(filterNew :{Frmn?:string,Sector?: string,Aspects?: string, Source?: string, Indicator?: string,startDate?: Date, endDate?: Date}){
    let params;
    if (filterNew.startDate && filterNew.endDate) {
      params = params.set('startDate', filterNew.startDate.toISOString());
      params = params.set('endDate', filterNew.endDate.toISOString());
    }
    if (filterNew.Frmn) {
      params = params.set('Frmn', filterNew.Frmn);
    }
    if (filterNew.Sector) {
      params = params.set('Sector', filterNew.Sector);
    }
    if (filterNew.Aspects) {
      params = params.set('Aspects', filterNew.Aspects);
    }

    if (filterNew.Indicator) {
      params = params.set('Indicator', filterNew.Indicator);
    }

    this.apiService.getWithHeaders('Rpt/weekly-entries-test'+params).subscribe(res =>{
      if(res){
        return res;
      }
    })
  }
  getWeeklyEntries(): void{

 
  }
  getMEntries(): void{
 
  }
  getDEntries(): void{

  }
  onFilterChange(event){

  }
  onChange1($event){

  }
}
