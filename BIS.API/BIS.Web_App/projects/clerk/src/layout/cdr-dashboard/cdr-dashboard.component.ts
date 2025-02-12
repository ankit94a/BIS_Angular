import { Component, QueryList, ViewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
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
   // Using BehaviorSubject for reactivity
  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([]);
  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  // fmnList: string[] = ["33 Corps", "27 Mtn Div", "17 Mtn Div", "111 Sub Area", "20 Mtn Div", "3 Corps", "2 Mtn Div", "56 Mtn Div", "57 Mtn Div", "4 Corps", "5 Mtn Div", "21 Mtn Div", "71 Mtn Div", "17 Corps", "59 Mtn Div", "23 Mtn Div"];
  // sectorList:string[]=['None','PSS','MSS','Cho_la','Doka_la'];
  // aspectList:string[]=['None','Svl / Counter Svl','Friction / Belligerence','Ae Activity','Conc of Tps','Armr / Arty / AD / Engrs Indn','Mob','Infra Devp','Dumping of WLS','Heightened Diplomatic Eng','Collapse of Diplomatic Ties','Propoganda','Internal Issues','Cyber','Def','Interactions'];
  // indicatorList:string[]=['None','Placement of addl Svl Eqpt','Incr Recce','Incr in OP loc','Jamming','Enhanced Tourist Influx']
  staffList = ['Staff1','Staff2','Staff3']
  notesList = ['None','temp1','temp2','temp3']
  selected11: string = 'Monthly';
  selectedType11 = 'Daily';
  filterNew :{Sector?: string, Aspects?: string, Indicator?: string,startDate?: Date, endDate?: Date} ={};
  selectedNew = 'any';
  constructor(private apiService:ApiService, private authService: AuthService,private masterDataService:MasterDataFilterService,private dialogService:BISMatDialogService){
    var divisionName = this.authService.getDivisionName();
    if (divisionName != undefined && divisionName != '' && divisionName != null) {
      this.fmnList.push(divisionName);
      this.filterModel.frmn = this.fmnList;
    }
    this.filterModel.filterType = FilterType.Daily;
    this.filterModel2.startDate = new Date();
    this.filterModel2.endDate = new Date();
    this.getSector();
    this.getAspect();
    this.getEntries();
    this.getReportByDate();
  }
  viewObj(item){
    this.dialogService.open(GenerateReportViewComponent,item);
  }
  addInference(item){
    debugger
    this.dialogService.open(CdrInferenceComponent,item);
  }
  getReportByDate(){
    debugger
    if(this.filterModel2.endDate != null && this.filterModel2.endDate != undefined){
      this.apiService.postWithHeader('cdrdashboard',this.filterModel2).subscribe(res =>{
        debugger
      if(res){
        this.allReports = res;
      }
    })
    }
  }
  getMeanData(date){
    let filterDate = new FilterModel4()
    filterDate.startDate = date;
    filterDate.endDate = date;
    filterDate.filterType = this.filterModel.filterType
    this.apiService.postWithHeader('masterdata/dateRange',filterDate).subscribe(res =>{
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
    this.apiService.postWithHeader('smartanalysis/getentries', this.filterModel).subscribe(res => {
      if (res) {
        this.meanChartList = res;
        console.log(this.meanChartList)
        this.entriesChart = {
          labels: res.name,
          datasets: [
            {
              data: res.count,
              label: 'Inputs',
              backgroundColor: 'rgba(151, 126, 201, 0.5)',
              borderColor: 'rgba(150, 68, 150, 0.5)',
              borderWidth: 1.2,
              fill: true,
              tension: 0.4,
            },
            {
              data: res.meanValue,
              label: 'Inputs',
              backgroundColor: 'rgba(20, 199, 65, 0.5)',
              borderColor: 'rgba(143, 92, 35, 0.5)',
              borderWidth: 1.2,
              fill: true,
              tension: 0.4,
            },
          ],
        };
      }
    })
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
      this.onFilterChange1('aspect')
      this.apiService.postWithHeader('attribute/indicatorlist', event).subscribe(res => {
        if (res) {
          this.indicatorList = res;
        }
      })
    }
  }
  onFilterChange1(filterKey: string): void {
    // this.filters[filterKey] = event;
    // this.getFrmnDataAll();
    // this.getNoOfInputChart();
    // this.getNoOfInputChartLY();
    // this.getAspectChart();
    // this.getAspectChartLY();
    // this.getIndicatorChart();
    // this.getIndicatorChartLY();
    switch (filterKey) {
      case 'sector':
        // this.getAllData();
        break;
      case 'aspect':
        // this.get30DaysAspect();
        // this.getlastYearAspect();
        // this.get30DaysIndicator();
        // this.getlastYearIndicator();
        break;
      case 'indicator':
        // this.get30DaysIndicator();
        // this.getlastYearIndicator();
        break;
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
      console.error(`Chart instance not found or not ready for ${chartId}`);
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
    // this.service.getWeeklyentries(this.filterNew)
    // .pipe(
    //   takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
    // ).subscribe({
    //   next: (data) => {
    //     console.log('Filtered data from API:', data);
    //     this.chartDataWeeklyEntry = data;
    //     this.renderChartWeeklyEntry();
    //     console.log('Filtered data:', this.chartDataWeeklyEntry);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching data:', error);
    //   }

    // });
  }
  getMEntries(): void{
    // this.service.getMonthMe(this.filterNew)
    // .pipe(
    //   takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
    // ).subscribe({
    //   next: (data) => {
    //     console.log('Filtered data from API:', data);
    //     this.chartDataMEntry = data;
    //     this.renderChartMEntry();
    //     console.log('Filtered data:', this.chartDataMEntry);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching data:', error);
    //   }

    // });
  }
  getDEntries(): void{
    // this.service.getDailyMe(this.filterNew)
    // .pipe(
    //   takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
    // ).subscribe({
    //   next: (data) => {
    //     console.log('Filtered data from API:', data);
    //     this.chartDataDEntry = data;
    //     this.renderChartDEntry();
    //     console.log('Filtered data:', this.chartDataDEntry);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching data:', error);
    //   }

    // });
  }
  onFilterChange(event){

  }
  onChange1($event){

  }
}
