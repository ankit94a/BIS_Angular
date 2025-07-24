import { Indicator } from './../../../../sharedlibrary/src/model/attribute.model';
import {Component,ElementRef,OnDestroy,OnInit,QueryList,ViewChild,ViewChildren,} from '@angular/core';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import {FilterModel,FilterModel4, VaraitionFilter,} from 'projects/sharedlibrary/src/model/dashboard.model';
import {Aspect,Sector,} from 'projects/sharedlibrary/src/model/attribute.model';
import { FilterType } from 'projects/sharedlibrary/src/model/enum';
import { GetMeanvalueColorDirective } from 'projects/sharedlibrary/src/directives/get-meanvalue-color.directive';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';

@Component({
  selector: 'app-smart-analysis',
  imports: [SharedLibraryModule,BaseChartDirective,GetMeanvalueColorDirective,],
  providers: [BisdefaultDatePipe],
  templateUrl: './smart-analysis.component.html',
  styleUrl: './smart-analysis.component.scss',
})
export class SmartAnalysisComponent implements OnInit, OnDestroy {
  isExpand:boolean=false;
  fmnList = [];
  frmnList: any[] = [];
  sectorList: Sector[] = [];
  aspectList: Aspect[] = [];
  indicatorList: Indicator[] = [];
  indicatorList2: Indicator[] = [];
  indicatorList3: Indicator[] = [];
  indicatorList4: Indicator[] = [];
  filterModel: FilterModel = new FilterModel();
  filterModel3: FilterModel = new FilterModel();
  filterModel4: FilterModel4 = new FilterModel4();

  input30Days: ChartData<'line'>;
  inputLastYear: ChartData<'line'>;
  aspect30Days: ChartData<'line'>;
  aspectLastYear: ChartData<'line'>;
  indicator30Days: ChartData<'line'>;
  indicatorLastYear: ChartData<'line'>;
  variation: ChartData<'line'>;
  variation2: ChartData<'line'>;
  entriesChart: ChartData<'line'>;
  meanChartList;

  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([]);
  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  selectedCharts: { [key: string]: boolean } = {
    chart0: false,
    chart1: false,
    chart2: false,
    chart3: false,
  };
  isCommand:boolean=false;
  variationFilterList:VaraitionFilter[] = [];
chartList: string[] = ['Monthly', 'Daily', 'Weekly'];
  constructor(private apiService: ApiService,private datePipe: DatePipe,private authService: AuthService,private masterDataService: MasterDataFilterService) {
    this.variationFilterList.push(new VaraitionFilter());
    this.filterModel4.filterType = FilterType.Daily;
    this.getFrmDetails();
    if(parseInt(this.authService.getRoleType()) >= 10)
      this.isCommand = true;
  }
  addFilterModel(){
    this.variationFilterList.push(new VaraitionFilter());
  }
  removeFilterModel(index){
    this.variationFilterList.splice(index,1);
    this.getvariation();
  }
  getFrmDetails() {
    this.apiService.getWithHeaders('dashboard/FmnDetails').subscribe((res) => {
      if (res) {
        this.frmnList = res;
        var divisionId = parseInt(this.authService.getDivisionId());
        var corpsId = parseInt(this.authService.getCorpsId());
        var frm = this.frmnList.find(
          (item) => item.corpsId === corpsId && item.divisionId === divisionId
        );
        if (frm) {
          if (!this.filterModel.frmn) {
            this.filterModel.frmn = [];
            this.filterModel3.frmn = [];
            this.filterModel4.frmn = [];
          }
          // this.filterModel.frmn.push({...frm});
          this.filterModel.frmn.push(JSON.parse(JSON.stringify(frm)));
          this.variationFilterList[0].frmn = frm;
          this.filterModel4.frmn.push(JSON.parse(JSON.stringify(frm)));
          this.getAll();
        }
      }
    });
  }

  getAll() {
    this.filterModel.frmn;
    this.getSector();
    this.getAspect();
    this.getAllData();
    this.getEntries();
  }

  isAnyCheckboxSelected(): boolean {
    return Object.values(this.selectedCharts).some((selected) => selected);
  }
  getWeekRange(weekNumber: number,year: number): { startDate: Date; endDate: Date } {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const firstWeekStart = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    const dayOfWeek = firstWeekStart.getDay();
    const startDate = new Date(firstWeekStart);
    startDate.setDate(startDate.getDate() - (dayOfWeek - 1));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return { startDate, endDate };
  }

  getMeanData(date) {
    if (date.startsWith('Week')) {
      const match = date.match(/^Week (\d{1,2}), (\d{4})$/);
      if (match) {
        const weekNumber = parseInt(match[1], 10);
        const year = parseInt(match[2], 10);
        const { startDate, endDate } = this.getWeekRange(weekNumber, year);

        this.filterModel4.startDate = startDate;
        this.filterModel4.endDate = endDate;
      }
    } else {
      this.filterModel4.startDate = date;
      this.filterModel4.endDate = date;
    }
    this.apiService.postWithHeader('smartanalysis/getentrieschart/entrydata', this.filterModel4).subscribe((res) => {
        const { Header, DataList } = this.masterDataService.getMasterData(res);
        this.tableHeaderSubject.next(Header);
        this.masterDataListSubject.next(DataList);
      });
  }
  downloadSelectedGraphs(): void {
    Object.keys(this.selectedCharts).forEach((chartId) => {
      if (this.selectedCharts[chartId]) {
        this.download(chartId);
      }
    });
  }

  download(chartId: string): void {
    let index = 0;
    switch (chartId) {
      case 'No of Inputs (Last One Month)':index = 0;break;
      case 'No of Inputs (Same Month Last Year)':index = 1;break;
      case 'Aspects (Last One Month)':index = 2;break;
      case 'Aspects (Same Month Last Year)':index = 3;break;
      case 'Indicators (Last One Month)':index = 4;break;
      case 'Indicators (Same Month Last Year)':index = 5;break;
      case 'Variation (all Fmn)':index = 6;break;
      case 'Entries Chart':index = 7;break;
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
  getAllData() {
    this.filterModel.frmn;
    this.get30DaysInput();
    this.get30DaysAspect();
    this.get30DaysIndicator();
    this.getlastYearInput();
    this.getlastYearAspect();
    this.getlastYearIndicator();
    this.getvariation();
  }


  getvariation() {
    const payloads = this.variationFilterList.filter(model => model.endDate != null);
    if (payloads.length === 0) return;
    this.apiService.postWithHeader('smartanalysis/variation', payloads).subscribe((res: any) => {
      if (res && res.labels && res.series) {
        this.variation = {
          labels: res.labels,
          datasets: res.series.map((seriesItem: any, idx: number) => {
            return {
              label: seriesItem.frmn,
              data: seriesItem.data,
              borderColor: this.getLineColor(idx),
              borderWidth: 1.8,
              fill: false,
              tension: 0.4,
            };
          }),
        };
      }
    });
  }
  getLineColor(index: number): string {
    const colors = [
      'rgba(17, 114, 179, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(54, 162, 235, 0.8)',
    ];
    return colors[index % colors.length];
  }

  ngOnInit(): void {

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
  getEntries() {
    this.tableHeaderSubject.next([]);
    this.masterDataListSubject.next([]);
    this.apiService
      .postWithHeader('smartanalysis/getentries', this.filterModel4)
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

  get30DaysInput() {
    this.apiService.postWithHeader('smartanalysis/30days', this.filterModel).subscribe((res) => {
        if (res) {
          this.input30Days = {
            labels: res.name,
            datasets: [
              {
                data: res.count,
                label: 'Inputs',
                borderColor: '#F7CFD8',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
              },
            ],
          };
        }
      });
  }

  getlastYearInput() {
    this.apiService.postWithHeader('smartanalysis/30days/lastyear', this.filterModel).subscribe((res) => {
        if (res) {
          this.inputLastYear = {
            labels: res.name,
            datasets: [
              {
                data: res.count,
                label: res.name,
                borderColor: '#D17D98',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
              },
            ],
          };
        }
      });
  }
  get30DaysAspect() {
    this.apiService.postWithHeader('smartanalysis/aspect/30days', this.filterModel).subscribe((res) => {
        if (res) {
          this.aspect30Days = {
            labels: res.name,
            datasets: [
              {
                data: res.count,
                label: res.name,
                borderColor: '#A3D1C6',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
              },
            ],
          };
        }
      });
  }
  getlastYearAspect() {
    this.apiService.postWithHeader('smartanalysis/aspect/30days/lastyear', this.filterModel).subscribe((res) => {
        if (res) {
          this.aspectLastYear = {
            labels: res.name,
            datasets: [
              {
                data: res.count,
                label: res.name,
                borderColor: '#3D8D7A',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
              },
            ],
          };
        }
      });
  }
  get30DaysIndicator() {
    this.apiService.postWithHeader('smartanalysis/indicator/30days', this.filterModel).subscribe((res) => {
        if (res) {
          this.indicator30Days = {
            labels: res.name,
            datasets: [
              {
                data: res.count,
                label: res.name,
                borderColor: '#A1E3F9',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
              },
            ],
          };
        }
      });
  }
  getlastYearIndicator() {
    this.apiService.postWithHeader('smartanalysis/indicator/30days/lastyear', this.filterModel).subscribe((res) => {
        if (res) {
          this.indicatorLastYear = {
            labels: res.name,
            datasets: [
              {
                data: res.count,
                label: res.name,
                borderColor: '#578FCA',
                borderWidth: 1.2,
                fill: false,
                tension: 0.4,
              },
            ],
          };
        }
      });
  }
  getSector() {
    this.apiService.getWithHeaders('attribute/sector').subscribe((res) => {
      if (res) {
        this.sectorList = res;
      }
    });
  }
  getAspect() {
    this.apiService.getWithHeaders('attribute/AllAspect').subscribe((res) => {
      if (res) {
        this.aspectList = res;
      }
    });
  }
  getIndicator(event) {
    if (event != undefined && event != null) {
      this.onFilterChange1('aspect');this.apiService.postWithHeader('attribute/indicatorlist', event).subscribe((res) => {
          if (res) {
            this.indicatorList = res;
          }
        });
    }
  }
  getIndicatorForVarition1(event) {
    if (event != undefined && event != null) {
      this.getvariation();
      this.apiService.postWithHeader('attribute/indicatorlist', event).subscribe((res) => {
          if (res) {
            this.indicatorList2 = res;
          }
        });
    }
  }

  getIndicatorForEntries(event) {
    if (event != undefined && event != null) {
      this.getEntries();
      this.apiService
        .postWithHeader('attribute/indicatorlist', event)
        .subscribe((res) => {
          if (res) {
            this.indicatorList4 = res;
          }
        });
    }
  }
  removeIndicator() {
    this.indicatorList = [];
  }

  onFilterChange1(filterKey: string): void {
    switch (filterKey) {
      case 'sector':
        this.getAllData();
        break;
      case 'aspect':
        this.get30DaysAspect();
        this.getlastYearAspect();
        this.get30DaysIndicator();
        this.getlastYearIndicator();
        break;
      case 'indicator':
        this.get30DaysIndicator();
        this.getlastYearIndicator();
        break;
    }
  }
  onFilterChange2(filterKey: string, event: any): void {
    this.filters[filterKey] = event;
    this.getVariationChart2();
  }
  onFilterChange3(filterKey: string, event: any): void {
    this.filters[filterKey] = event;
    this.getDEntries();
    this.getVariationChart1();
  }
  onFilterChange4(filterKey: string, event: any): void {
    this.filters[filterKey] = event;
  }

  chartDataLine: ChartData<'line', number[], string | string[]> = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Fmn',
        data: [30, 45, 28, 50, 60, 33, 45, 40, 55, 48, 62, 70],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', 
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1.2,
        fill: true, 
        tension: 0.4, 
      },
    ],
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top', 
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
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


  completeChartData: ChartData<'line', number[], string | string[]> = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Fmn',
        data: [30, 45, 28, 50, 60, 33, 45, 40, 55, 48, 62, 70],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', 
        borderColor: 'rgba(54, 162, 235, 1)', 
        borderWidth: 1.2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Sales',
        data: [22, 38, 45, 60, 75, 50, 80, 65, 60, 58, 80, 90],
        backgroundColor: 'rgba(255, 99, 132, 0.5)', 
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1.2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [40, 55, 48, 70, 80, 60, 75, 65, 72, 68, 85, 100],
        backgroundColor: 'rgba(75, 192, 192, 0.5)', 
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1.2,
        fill: true,
        tension: 0.4,
      },
    ],
  };


  getChartData(
    chartType: string
  ): ChartData<'line', number[], string | string[]> {
    let filteredDatasets = [];

    switch (chartType) {
      case 'Fmn':
        filteredDatasets = this.completeChartData.datasets.filter(
          (dataset) => dataset.label === 'Fmn'
        );
        break;
      case 'Sales':
        filteredDatasets = this.completeChartData.datasets.filter(
          (dataset) => dataset.label === 'Sales'
        );
        break;
      case 'Expenses':
        filteredDatasets = this.completeChartData.datasets.filter(
          (dataset) => dataset.label === 'Expenses'
        );
        break;
      default:
        filteredDatasets = this.completeChartData.datasets;
        break;
    }

    return {
      labels: this.completeChartData.labels,
      datasets: filteredDatasets,
    };
  }

  public chartDataLine1 = this.getChartData('Fmn');
  public chartDataLine2 = this.getChartData('Sales');
  public chartDataLine3 = this.getChartData('Expenses');


  private unsubscribe$ = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  chartDataLineFrmn: any = null;
  chartDataLineFrmnLastYear: any = null;
  chartDataIndicators30Days: any = null;
  chartDataIndicators30DaysLY: any = null;
  chartDataAspect30: any = null;
  chartDataAspect30LY: any = null;
  chartDataFrmn: any = null;
  chartDataFrmn2: any = null;
  chartDataWeeklyEntry: any = null;
  chartDataMEntry: any = null;
  chartDataDEntry: any = null;
  chartDataMeanWeek: any = null;
  chartDataMeanMonth: any = null;

  chartLineFrmn: any;
  chartLineFrmnLastYear: any;
  chartIndicators30Days: any;
  chartIndicators30DaysLY: any;
  chartAspect30: any;
  chartAspect30LY: any;
  chartFrmn: any;
  chartFrmn2: any;
  chartWeeklyEntry: any = null;
  chartMEntry: any = null;
  chartDEntry: any = null;
  chartMeanWeek: any = null;
  chartMeanMonth: any = null;
  @ViewChild('myChartLineFrmn') myChartLineFrmn!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartLineFrmnLastYear')
  myChartLineFrmnLastYear!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartIndicators30Days')
  myChartIndicators30Days!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartIndicators30DaysLY')
  myChartIndicators30DaysLY!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartAspect30') myChartAspect30!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartAspect30LY')
  myChartAspect30LY!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartFrmn') myChartFrmn!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartFrmn2') myChartFrmn2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartWeeklyEntry')
  myChartWeeklyEntry!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartMEntry') myChartMEntry!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartDEntry') myChartDEntry!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartMeanW') myChartMeanW!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartMeanMo') myChartMeanMo!: ElementRef<HTMLCanvasElement>;

  filters: {
    Sector?: string;
    Aspects?: string;
    Source?: string;
    Indicator?: string;
    Frmn?: string;
    startDate?: string;
    endDate?: string;
  } = {};

  filters1: {
    Sector?: string;
    Aspects?: string;
    Source?: string;
    Indicator?: string;
    Frmn?: string;
    startDate?: string;
    endDate?: string;
  } = {};
  filters2: {
    Sector?: string;
    Aspects?: string;
    Source?: string;
    Indicator?: string;
    Frmn?: string;
    startDate?: string;
    endDate?: string;
  } = {};
  filters3: {
    Sector?: string;
    Aspects?: string;
    Source?: string;
    Indicator?: string;
    Frmn?: string;
    startDate?: string;
    endDate?: string;
  } = {};
  getFrmnDataAll(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const baseUrl = 'Rpt/getfrmn30Days?last30Days=true';


    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.apiService
      .getWithHeaders(fullUrl)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {         
          this.chartDataLineFrmn = data;
          this.renderPieChartFrmn();         
        },
        error: (error) => {
        },
      });
  }
  renderPieChartFrmn(): void {
    if (!this.chartDataLineFrmn || !this.myChartLineFrmn) {
      return;
    }

    if (this.chartLineFrmn) {
      this.chartLineFrmn.destroy();
    }

    const ctx = this.myChartLineFrmn.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartLineFrmn = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataLineFrmn.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataLineFrmn.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
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
              maxRotation: 90, 
              minRotation: 90, 
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
      },
    });
  }

  getFrmnDataAll30(): void {
    this.apiService
      .getWithHeaders('Rpt/getfrmn30Dayslastyear?last30Days=true')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataLineFrmnLastYear = data;
          this.renderPieChartFrmn30();
        },
        error: (error) => {
        },
      });
  }
  renderPieChartFrmn30(): void {
    if (!this.myChartLineFrmnLastYear || !this.myChartLineFrmnLastYear) {
      return;
    }

    if (this.chartLineFrmnLastYear) {
      this.chartLineFrmnLastYear.destroy();
    }

    const ctx = this.myChartLineFrmnLastYear.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartLineFrmnLastYear = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataLineFrmnLastYear.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataLineFrmnLastYear.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
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
              maxRotation: 90, 
              minRotation: 90,
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
      },
    });
  }

  getAspect30(): void {
    this.apiService
      .getWithHeaders('Rpt/getaspect30?last30Days=true')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (data) => {
          
          this.chartDataAspect30 = data;
          this.renderPieChartAspect30();
        },
        error: (error) => {
        },
      });
  }
  renderPieChartAspect30(): void {
    if (!this.chartDataAspect30 || !this.myChartAspect30) {
      return;
    }

    if (this.chartAspect30) {
      this.chartAspect30.destroy();
    }

    const ctx = this.myChartAspect30.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartAspect30 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataAspect30.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataAspect30.datasets[0].data,
            backgroundColor: ['rgba(255, 99, 132, 1)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
              maxRotation: 90, 
              minRotation: 90, 
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
      },
    });
  }

  getAspect30LY(): void {
    this.apiService
      .getWithHeaders('Rpt/getaspect30LY?last30Days=true')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataAspect30LY = data;
          this.renderPieChartAspect30LY();
        },
        error: (error) => {
        },
      });
  }
  renderPieChartAspect30LY(): void {
    if (!this.chartDataAspect30LY || !this.myChartAspect30LY) {
      return;
    }

    if (this.chartAspect30LY) {
      this.chartAspect30LY.destroy();
    }

    const ctx = this.myChartAspect30LY.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartAspect30LY = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataAspect30LY.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataAspect30LY.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
              maxRotation: 90, 
              minRotation: 90, 
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
      },
    });
  }

  getIndicators30Day(): void {
    this.apiService
      .getWithHeaders('Rpt/gettoptenindicators30?last30Days=true')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataIndicators30Days = data;
          this.renderPieChartIndicators30Day();
        },
        error: (error) => {
        },
      });
  }
  renderPieChartIndicators30Day(): void {
    if (!this.chartDataIndicators30Days || !this.myChartIndicators30Days) {
      return;
    }

    if (this.chartIndicators30Days) {
      this.chartIndicators30Days.destroy();
    }

    const ctx = this.myChartIndicators30Days.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartIndicators30Days = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataIndicators30Days.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataIndicators30Days.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
              maxRotation: 90, 
              minRotation: 90, 
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
      },
    });
  }

  getIndicators30DaysLY(): void {
    this.apiService
      .getWithHeaders('Rpt/gettoptenindicators30LY?last30Days=true')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (data) => {
          this.chartDataIndicators30DaysLY = data;
          this.renderPieChartIndicators30DayLY();
        },
        error: (error) => {
        },
      });
  }
  renderPieChartIndicators30DayLY(): void {
    if (!this.chartDataIndicators30DaysLY || !this.myChartIndicators30DaysLY) {
      return;
    }

    if (this.chartIndicators30DaysLY) {
      this.chartIndicators30DaysLY.destroy();
    }

    const ctx = this.myChartIndicators30DaysLY.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartIndicators30DaysLY = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataIndicators30DaysLY.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataIndicators30DaysLY.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
              maxRotation: 90, 
              minRotation: 90, 
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
      },
    });
  }

  getFrmnAll(): void {
    this.apiService
      .getWithHeaders('Rpt/getfrmn')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataFrmn = data;
          this.renderChartFrmn();
        },
        error: (error) => {
        },
      });
  }
  renderChartFrmn(): void {
    if (!this.chartDataFrmn || !this.myChartFrmn) {
      return;
    }

    if (this.chartFrmn) {
      this.chartFrmn.destroy();
    }

    const ctx = this.myChartFrmn.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartFrmn = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataFrmn.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataFrmn.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '',
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
      },
    });
  }

  getFrmnAll2(): void {
    this.apiService
      .getWithHeaders('Rpt/getfrmn')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataFrmn2 = data;
          this.renderChartFrmn2();
        },
        error: (error) => {
        },
      });
  }
  renderChartFrmn2(): void {
    if (!this.chartDataFrmn2 || !this.myChartFrmn2) {
      return;
    }

    if (this.chartFrmn2) {
      this.chartFrmn2.destroy();
    }

    const ctx = this.myChartFrmn2.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartFrmn2 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataFrmn2.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataFrmn2.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '',
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
      },
    });
  }

  getWeeklyEntries(): void {
    this.apiService
      .getWithHeaders('Rpt/weekly-entries-test')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataWeeklyEntry = data;
          this.renderChartWeeklyEntry();
        },
        error: (error) => {
          
        },
      });
  }
  getMEntries(): void {
    this.apiService
      .getWithHeaders('Rpt/monthly-entries-test')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataMEntry = data;
          this.renderChartMEntry();
        },
        error: (error) => {
          
        },
      });
  }
  getDEntries(): void {
    this.apiService
      .getWithHeaders('Rpt/daily-entries-chart')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataDEntry = data;
          this.renderChartDEntry();
        },
        error: (error) => {
          
        },
      });
  }
  getMeanWeek(): void {
    this.apiService
      .getWithHeaders('Rpt/weekly-entries-test')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataMeanWeek = data;
          this.renderChartMeanW();
        },
        error: (error) => {
          
        },
      });
  }
  getMeanMonth(): void {
    this.apiService
      .getWithHeaders('Rpt/monthly-entries-test')
      .pipe(
        takeUntil(this.unsubscribe$) 
      )
      .subscribe({
        next: (data) => {
          this.chartDataMeanMonth = data;
          this.renderChartMeanMo();
        },
        error: (error) => {
          
        },
      });
  }

  renderChartMeanW(): void {
    if (!this.chartDataMeanWeek || !this.myChartMeanW) {
      return;
    }

    const ctx = this.myChartMeanW.nativeElement.getContext('2d');
    if (!ctx) {
      
      return;
    }

    this.chartMeanWeek = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataMeanWeek.labels,
        datasets: [
          {
            label: 'Mean',
            data: this.chartDataMeanWeek.data,
            backgroundColor: ['rgba(255, 99, 132, 1)'],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  renderChartMeanMo(): void {
    if (!this.chartDataMeanMonth || !this.myChartMeanMo) {
      return;
    }

    if (this.chartMeanMonth) {
      this.chartMeanMonth.destroy();
    }

    const ctx = this.myChartMeanMo.nativeElement.getContext('2d');
    if (!ctx) {
      
      return;
    }

    this.chartMeanMonth = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataMeanMonth.labels,
        datasets: [
          {
            label: 'Mean',
            data: this.chartDataMeanMonth,
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  renderChartWeeklyEntry(): void {
    if (!this.chartDataWeeklyEntry || !this.myChartWeeklyEntry) {
      return;
    }

    if (this.chartWeeklyEntry) {
      this.chartWeeklyEntry.destroy();
    }

    const ctx = this.myChartWeeklyEntry.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartWeeklyEntry = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataWeeklyEntry.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataWeeklyEntry.data,
            backgroundColor: this.chartDataWeeklyEntry.alerts,
            borderColor: this.chartDataWeeklyEntry.alerts,
            borderWidth: 1.2,
          },
          {
            label: 'Mean',
            data: this.chartDataWeeklyEntry.data2,
            backgroundColor: [
              'rgba(255, 159, 64, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '',
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
      },
    });
    this.createDataTable();
  }

  renderChartMEntry(): void {
    if (!this.chartDataMEntry || !this.myChartMEntry) {
      return;
    }

    if (this.chartMEntry) {
      this.chartMEntry.destroy();
    }

    const ctx = this.myChartMEntry.nativeElement.getContext('2d');
    if (!ctx) {
      
      return;
    }

    const meanValueArray = Array(this.chartDataMEntry.labels.length).fill(
      this.chartDataMeanMonth
    );

    this.chartMEntry = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataMEntry.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataMEntry.data,
            backgroundColor: this.chartDataMEntry.alerts,
            borderColor: this.chartDataMEntry.alerts,
            borderWidth: 1.2,
          },
          {
            label: 'Mean',
            data: this.chartDataMEntry.data2,
            backgroundColor: [
              'rgba(255, 159, 64, 1)',
            ],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '',
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
      },
    });
    this.createDataTable();
  }

  renderChartDEntry(): void {
    if (!this.chartDataDEntry || !this.myChartDEntry) {
      return;
    }

    if (this.chartDEntry) {
      this.chartDEntry.destroy();
    }

    const ctx = this.myChartDEntry.nativeElement.getContext('2d');
    if (!ctx) {
      
      return;
    }

    this.chartDEntry = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataDEntry.labels,
        datasets: [
          {
            label: 'Fmn',
            data: this.chartDataDEntry.data,
            backgroundColor: this.chartDataDEntry.alerts,
            borderColor: this.chartDataDEntry.alerts,
            borderWidth: 1.2,
          },
          {
            label: 'Mean',
            data: this.chartDataDEntry.data2,
            backgroundColor: ['rgba(255, 99, 132, 1)'],
            borderColor: ['rgba(0, 0, 0, 1)'],
            borderWidth: 1.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '',
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
      },
    });

    this.createDataTable();
  }
 
  createDataTable(): void {
    const tableBody = document.getElementById('data-table-body');
    const meanTableBody = document.getElementById('mean-table-body');
    const meanTable = document.getElementById('mean-table');

    if (!tableBody || !meanTableBody || !meanTable) {
      
      return;
    }

    tableBody.innerHTML = '';
    meanTableBody.innerHTML = '';

    const meanValue = this.chartDataDEntry.data2[0] || 'N/A';

   const meanHeader = document.getElementById('mean-header');
    if (meanHeader) {
      meanHeader.textContent = `Mean: ${meanValue}`; 
    }

    this.chartDataDEntry.labels.forEach((label: string, index: number) => {
      const row = document.createElement('tr');
      const cell1 = document.createElement('td');
      const cell2 = document.createElement('td');
      const cell3 = document.createElement('td');

      row.style.backgroundColor = this.chartDataDEntry.alerts[index];

      cell1.textContent = label; 
      cell2.textContent = this.chartDataDEntry.data[index]; 

      const icon = document.createElement('span');
      icon.classList.add('arrow-icon'); 
      icon.textContent = '>>'; 

      icon.addEventListener('click', () => {
        event.stopPropagation();
        const relatedIds = this.chartDataDEntry.id[index];
        const queryParams = relatedIds.map((id) => `ids=${id}`).join('&');
       this.apiService
          .getWithHeaders(`MasterData/by-ids?${queryParams}`)
          .subscribe((data) => {
            const frmn = data.map((item) => item.frmn); 
            const sector = data.map((item) => item.sector);
            const aspect = data.map((item) => item.aspect);
            this.updateMeanTable(
              label,
              meanValue,
              this.chartDataDEntry.data[index],
              frmn,
              sector,
              aspect
            );
            meanTable.style.display = 'table';
          });
      });

      cell3.appendChild(icon);

      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);

      tableBody.appendChild(row);
    });
  }

  updateMeanTable(
    label: string,
    meanValue: number,
    count: number,
    frmn: string[],
    sector: string,
    aspect: string
  ): void {
    const meanTableBody = document.getElementById('mean-table-body');
    if (!meanTableBody) {
      return;
    }

    meanTableBody.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const row = document.createElement('tr');

      const cell1 = document.createElement('td');
      const cell2 = document.createElement('td');
      const cell3 = document.createElement('td');
      const cell4 = document.createElement('td');
      const cell5 = document.createElement('td');

      cell1.textContent = label; 
      cell2.textContent = meanValue.toString(); 
      cell3.textContent = frmn[i] || 'N/A'; 
      cell4.textContent = sector[i] || 'N/A'; 
      cell5.textContent = aspect[i] || 'N/A';

      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell4);
      row.appendChild(cell5);

      meanTableBody.appendChild(row);
    }
  }

  selected11: string = '';
  selectedType11 = '';
  onChange1(event: any) {
    this.selected11 = event.value;
    this.renderChart();
  }
  renderChart(): void {
  
    this.chartWeeklyEntry?.destroy();
    this.chartMEntry?.destroy();
    this.chartDEntry?.destroy();

    switch (this.selected11) {
      case 'Weekly':
        this.getWeeklyEntries();
        break;
      case 'Monthly':
        this.getMEntries();

        break;
      case 'Daily':
        this.getDEntries();
        break;
      default:

    }
  }

  chartDataInput: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  chartDataInputLY: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  chartDataAspect: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  chartDataAspectLY: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  chartDataIndicator: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  chartDataIndicatorLY: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  chartDataVariation1: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  chartDataVariation2: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  isLoadingPie: boolean = false;

  getNoOfInputChart(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) 
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const baseUrl = 'Rpt/getfrmn30Days?last30Days=true';

    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataInput = {
            labels: data.labels, 
            datasets: [
              {
                data: updatedData, 
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(0, 0, 0, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          this.isLoadingPie = false;
        },
      });
  }
  getNoOfInputChartLY(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) 
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const baseUrl = 'Rpt/getfrmn30Dayslastyear?last30Days=true';

    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataInputLY = {
            labels: data.labels, 
            datasets: [
              {
                data: updatedData,
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(0, 0, 0, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          
          this.isLoadingPie = false;
        },
      });
  }
  getAspectChart(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) 
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const baseUrl = 'Rpt/getaspect30?last30Days=true';

    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataAspect = {
            labels: data.labels, 
            datasets: [
              {
                data: updatedData, 
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          this.isLoadingPie = false;
        },
      });
  }
  getAspectChartLY(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) 
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');


    const baseUrl = 'Rpt/getaspect30LY?last30Days=true';

    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataAspectLY = {
            labels: data.labels, 
            datasets: [
              {
                data: updatedData,
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          
          this.isLoadingPie = false;
        },
      });
  }
  getIndicatorChart(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) 
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const baseUrl = 'Rpt/gettoptenindicators30?last30Days=true';

   
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataIndicator = {
            labels: data.labels, 
            datasets: [
              {
                data: updatedData,
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(0, 0, 0, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          
          this.isLoadingPie = false;
        },
      });
  }
  getIndicatorChartLY(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const baseUrl = 'Rpt/gettoptenindicators30LY?last30Days=true';

    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataIndicatorLY = {
            labels: data.labels, 
            datasets: [
              {
                data: updatedData,
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          this.isLoadingPie = false;
        },
      });
  }
  getVariationChart1(): void {
    const queryParams = Object.entries(this.filters2)
      .filter(([key, value]) => value) 
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const baseUrl = 'Rpt/daily-entries-chart';

    const fullUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          if (!data || !data.data || data.data.length === 0) {
            this.emptyChart();
            this.isLoadingPie = false;
            return;
          }
          const updatedData = data.data;
          this.chartDataVariation1 = {
            labels: data.labels || [],
            datasets: [
              {
                data: updatedData,
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          this.isLoadingPie = false;
        },
      });
  }
  getVariationChart2(): void {
    const queryParams = Object.entries(this.filters1)
      .filter(([key, value]) => value) 
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');


    const baseUrl = 'Rpt/daily-entries-chart';

    const fullUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService
      .getWithHeaders(fullUrl) 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          if (!data || !data.data || data.data.length === 0) {
            
            this.emptyChart1();
            this.isLoadingPie = false;
            return;
          }
          const updatedData = data.data;
          this.chartDataVariation2 = {
            labels: data.labels, 
            datasets: [
              {
                data: updatedData,
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          
          this.isLoadingPie = false;
        },
      });
  }

  onDateRangeChange(): void {

    if (this.filters2.startDate && this.filters2.endDate) {
      const formattedStartDate = this.datePipe.transform(
        this.filters2.startDate,
        'yyyy-MM-ddTHH:mm:ss.SSSSSSS'
      );
      const formattedEndDate = this.datePipe.transform(
        this.filters2.endDate,
        'yyyy-MM-ddTHH:mm:ss.SSSSSSS'
      );

      if (formattedStartDate && formattedEndDate) {
        this.filters2.startDate = formattedStartDate;
        this.filters2.endDate = formattedEndDate;
        this.getVariationChart1();
      } else {

      }
    }
  }
  onDateRangeChange2(): void {

    if (this.filters1.startDate && this.filters1.endDate) {
      const formattedStartDate = this.datePipe.transform(
        this.filters1.startDate,
        'yyyy-MM-ddTHH:mm:ss.SSSSSSS'
      );
      const formattedEndDate = this.datePipe.transform(
        this.filters1.endDate,
        'yyyy-MM-ddTHH:mm:ss.SSSSSSS'
      );

      if (formattedStartDate && formattedEndDate) {
        this.filters1.startDate = formattedStartDate;
        this.filters1.endDate = formattedEndDate;

        this.getVariationChart2();
      } else {
      }
    }
  }


  resetFilters() {
    this.filters1.Frmn = null;
    this.filters1.Sector = null;
    this.filters1.Aspects = null;
    this.filters1.Indicator = null;

    this.filters1.startDate = null;
    this.filters1.endDate = null;

    this.onFilterChange2('fmn', null); 
    this.onFilterChange2('sector', null); 
    this.onFilterChange2('aspects', null); 
    this.onFilterChange2('indicator', null);
  }
  resetFilters1() {
    this.filters2.Frmn = null;
    this.filters2.Sector = null;
    this.filters2.Aspects = null;
    this.filters2.Indicator = null;

    this.filters2.startDate = null;
    this.filters2.endDate = null;

    this.onFilterChange3('fmn', null);
    this.onFilterChange3('sector', null);
    this.onFilterChange3('aspects', null); 
    this.onFilterChange3('indicator', null);
  }
  resetFilters2() {
    this.filters.Frmn = null;
    this.filters.Sector = null;
    this.filters.Aspects = null;
    this.filters.Indicator = null;

    this.filters.startDate = null;
    this.filters.endDate = null;

  }


  emptyChart(): void {
    this.chartDataVariation1 = {
      labels: [],
      datasets: [],
    };
  }
  emptyChart1(): void {
    this.chartDataVariation2 = {
      labels: [],
      datasets: [],
    };
  }
}
