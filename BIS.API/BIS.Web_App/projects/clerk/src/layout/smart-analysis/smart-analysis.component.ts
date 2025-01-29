import { Indicator } from './../../../../sharedlibrary/src/model/attribute.model';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { FilterModel, FilterModel4 } from 'projects/sharedlibrary/src/model/dashboard.model';
import { Aspect, Sector } from 'projects/sharedlibrary/src/model/attribute.model';
import { FilterType } from 'projects/sharedlibrary/src/model/enum';
import { GetMeanvalueColorDirective } from 'projects/sharedlibrary/src/directives/get-meanvalue-color.directive';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';

@Component({
  selector: 'app-smart-analysis',
  imports: [SharedLibraryModule, BaseChartDirective,GetMeanvalueColorDirective],
  providers: [BisdefaultDatePipe],
  templateUrl: './smart-analysis.component.html',
  styleUrl: './smart-analysis.component.scss'
})
export class SmartAnalysisComponent implements OnInit, OnDestroy {
  // savedNotes: IsavedNotes[] = [];
  fmnList = [];
  sectorList: Sector[] = [];
  aspectList: Aspect[] = [];
  indicatorList: Indicator[] = [];
  indicatorList4: Indicator[] = [];
  filterModel: FilterModel = new FilterModel();
  filterModel4: FilterModel4 = new FilterModel4();
  //chart variables
  input30Days: ChartData<'line'>;
  inputLastYear: ChartData<'line'>;
  aspect30Days: ChartData<'line'>;
  aspectLastYear: ChartData<'line'>;
  indicator30Days: ChartData<'line'>;
  indicatorLastYear: ChartData<'line'>;
  entriesChart: ChartData<'line'>;
  meanChartList;

  // Using BehaviorSubject for reactivity
  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([]);
  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  // Map to track selected charts by their IDs
  selectedCharts: { [key: string]: boolean } = {
    chart0: false,
    chart1: false,
    chart2: false,
    chart3: false,
  };

  // fmnList: string[] = ["33 Corps", "27 Mtn Div", "17 Mtn Div", "111 Sub Area", "20 Mtn Div", "3 Corps", "2 Mtn Div", "56 Mtn Div", "57 Mtn Div", "4 Corps", "5 Mtn Div", "21 Mtn Div", "71 Mtn Div", "17 Corps", "59 Mtn Div", "23 Mtn Div"];
  //sectorList: string[] = ['None', 'PSS', 'MSS', 'Cho_la', 'Doka_la'];
  //aspectList: string[] = ['None', 'Svl / Counter Svl', 'Friction / Belligerence', 'Ae Activity', 'Conc of Tps', 'Armr / Arty / AD / Engrs Indn', 'Mob', 'Infra Devp', 'Dumping of WLS', 'Heightened Diplomatic Eng', 'Collapse of Diplomatic Ties', 'Propoganda', 'Internal Issues', 'Cyber', 'Def', 'Interactions'];
  // indicatorList: string[] = ['None', 'Placement of addl Svl Eqpt', 'Incr Recce', 'Incr in OP loc', 'Jamming', 'Enhanced Tourist Influx']
  chartList: string[] = ['Monthly', 'Daily', 'Weekly']
  constructor(private apiService: ApiService, private datePipe: DatePipe, private authService: AuthService,private masterDataService:MasterDataFilterService) {
    var divisionName = this.authService.getDivisionName();
    if (divisionName != undefined && divisionName != '' && divisionName != null) {
      this.fmnList.push(divisionName);
      this.filterModel.frmn = this.fmnList;
      this.filterModel4.frmn = this.fmnList;
    }
    this.filterModel4.filterType = FilterType.Daily;
    this.getSector();
    this.getAspect();
    this.getEntries();
  }
  isAnyCheckboxSelected(): boolean {
    return Object.values(this.selectedCharts).some(selected => selected);
  }
  getMeanData(date){
    debugger
    let filterDate = new FilterModel()
    filterDate.startDate = date;
    filterDate.endDate = date;
    this.apiService.postWithHeader('masterdata/dateRange',filterDate).subscribe(res =>{
      const {Header,DataList} = this.masterDataService.getMasterData(res);
      this.tableHeaderSubject.next(Header);
       this.masterDataListSubject.next(DataList);
    })
  }
  downloadSelectedGraphs(): void {
    Object.keys(this.selectedCharts).forEach(chartId => {
      if (this.selectedCharts[chartId]) {
        this.download(chartId);
      }
    });
  }
  download(chartId: string): void {
    let index = 0;
    switch (chartId) {
      case 'chart0': index = 0; break;
      case 'chart1': index = 1; break;
      case 'chart2': index = 2; break;
      case 'chart3': index = 3; break;
      // fmn chart
      case 'chart4': index = 4; break;
      case 'chart5': index = 5; break;
      case 'chart6': index = 6; break;
      case 'chart7': index = 7; break;
      // aspect chart
      case 'chart8': index = 8; break;
      case 'chart9': index = 9; break;
      case 'chart10': index = 10; break;
      case 'chart11': index = 11; break;
      // indicator chart
      case 'chart12': index = 12; break;
      case 'chart13': index = 13; break;
      case 'chart14': index = 14; break;
      case 'chart15': index = 15; break;
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
  getAllData() {
    this.get30DaysInput();
    this.get30DaysAspect();
    this.get30DaysIndicator();
    this.getlastYearInput();
    this.getlastYearAspect();
    this.getlastYearIndicator();
  }
  ngOnInit(): void {
    this.getAllData();
    // this.getFrmnDataAll();
    // this.getFrmnDataAll30();
    // this.getAspect30();
    // this.getAspect30LY();
    // this.getIndicators30Day();
    // this.getIndicators30DaysLY();
    // this.getFrmnAll();
    // this.getFrmnAll2();
    // this.getMeanWeek();
    // this.getMeanMonth();
    // this.getWeeklyEntries();
    // this.getMEntries();
    // this.getDEntries();
    // this.onChange1('');

    // this.getNoOfInputChart();
    // this.getNoOfInputChartLY();
    // this.getAspectChart();
    // this.getAspectChartLY();
    // this.getIndicatorChart();
    // this.getIndicatorChartLY();
    // this.getVariationChart1();
    // this.getVariationChart2();

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
        display: false, // Initially hidden; will be set dynamically
        text: '',       // Placeholder text
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
    this.apiService.postWithHeader('smartanalysis/getentries', this.filterModel4).subscribe(res => {
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
  get30DaysInput() {
    this.apiService.postWithHeader('smartanalysis/30days', this.filterModel).subscribe(res => {
      if (res) {
        this.input30Days = {
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
          ],
        };
      }
    });
  }
  getlastYearInput() {
    this.apiService.postWithHeader('smartanalysis/30days/lastyear', this.filterModel).subscribe(res => {
      if (res) {
        this.inputLastYear = {
          labels: res.name,
          datasets: [
            {
              data: res.count, label: res.name,
              backgroundColor: 'rgba(151, 126, 201, 0.5)', // Semi-transparent blue
              borderColor: 'rgba(150, 68, 150, 0.5)', // Solid blue
              borderWidth: 1.2,
              fill: true, // Fill area under the line
              tension: 0.4, // Adds smoothness to the line
            },
          ],
        };
        // Update the chart title dynamically
        //  this.lineChartOptions.plugins.title.display = true;
        //  this.lineChartOptions.plugins.title.text = `ankit`;
      }
    })
  }
  get30DaysAspect() {
    this.apiService.postWithHeader('smartanalysis/aspect/30days', this.filterModel).subscribe(res => {
      if (res) {
        this.aspect30Days = {
          labels: res.name,
          datasets: [
            {
              data: res.count, label: res.name,
              backgroundColor: 'rgba(151, 126, 201, 0.5)', // Semi-transparent blue
              borderColor: 'rgba(150, 68, 150, 0.5)', // Solid blue
              borderWidth: 1.2,
              fill: true, // Fill area under the line
              tension: 0.4, // Adds smoothness to the line
            },
          ],
        };
      }
    })
  }
  getlastYearAspect() {
    this.apiService.postWithHeader('smartanalysis/aspect/30days/lastyear', this.filterModel).subscribe(res => {
      if (res) {
        this.aspectLastYear = {
          labels: res.name,
          datasets: [
            {
              data: res.count, label: res.name,
              backgroundColor: 'rgba(151, 126, 201, 0.5)', // Semi-transparent blue
              borderColor: 'rgba(150, 68, 150, 0.5)', // Solid blue
              borderWidth: 1.2,
              fill: true, // Fill area under the line
              tension: 0.4, // Adds smoothness to the line
            },
          ],
        };
      }
    })
  }
  get30DaysIndicator() {
    this.apiService.postWithHeader('smartanalysis/indicator/30days', this.filterModel).subscribe(res => {
      if (res) {
        this.indicator30Days = {
          labels: res.name,
          datasets: [
            {
              data: res.count, label: res.name,
              backgroundColor: 'rgba(151, 126, 201, 0.5)', // Semi-transparent blue
              borderColor: 'rgba(150, 68, 150, 0.5)', // Solid blue
              borderWidth: 1.2,
              fill: true, // Fill area under the line
              tension: 0.4, // Adds smoothness to the line
            },
          ],
        };
      }
    })
  }
  getlastYearIndicator() {
    this.apiService.postWithHeader('smartanalysis/indicator/30days/lastyear', this.filterModel).subscribe(res => {
      if (res) {
        this.indicatorLastYear = {
          labels: res.name,
          datasets: [
            {
              data: res.count, label: res.name,
              backgroundColor: 'rgba(151, 126, 201, 0.5)', // Semi-transparent blue
              borderColor: 'rgba(150, 68, 150, 0.5)', // Solid blue
              borderWidth: 1.2,
              fill: true, // Fill area under the line
              tension: 0.4, // Adds smoothness to the line
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
  getIndicatorForEntries(event) {
    if (event != undefined && event != null) {
      this.getEntries()
      this.apiService.postWithHeader('attribute/indicatorlist', event).subscribe(res => {
        if (res) {
          this.indicatorList4 = res;
        }
      })
    }
  }
  removeIndicator() {
    this.indicatorList = []
  }
  onFilterChange($event) {

  }
  onFilterChange1(filterKey: string): void {
    debugger
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
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Fmn',
        data: [30, 45, 28, 50, 60, 33, 45, 40, 55, 48, 62, 70],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Semi-transparent blue
        borderColor: 'rgba(54, 162, 235, 1)', // Solid blue
        borderWidth: 1.2,
        fill: true, // Fill area under the line
        tension: 0.4, // Adds smoothness to the line
      },
    ],
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top', // Show the legend at the top
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

  // Chart Data - Complete data
  completeChartData: ChartData<'line', number[], string | string[]> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Fmn',
        data: [30, 45, 28, 50, 60, 33, 45, 40, 55, 48, 62, 70],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Semi-transparent blue
        borderColor: 'rgba(54, 162, 235, 1)', // Solid blue
        borderWidth: 1.2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Sales',
        data: [22, 38, 45, 60, 75, 50, 80, 65, 60, 58, 80, 90],
        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Semi-transparent red
        borderColor: 'rgba(255, 99, 132, 1)', // Solid red
        borderWidth: 1.2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [40, 55, 48, 70, 80, 60, 75, 65, 72, 68, 85, 100],
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Semi-transparent green
        borderColor: 'rgba(75, 192, 192, 1)', // Solid green
        borderWidth: 1.2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Function to get chart data based on chart type using switch case
  getChartData(chartType: string): ChartData<'line', number[], string | string[]> {
    let filteredDatasets = [];

    switch (chartType) {
      case 'Fmn':
        filteredDatasets = this.completeChartData.datasets.filter(dataset => dataset.label === 'Fmn');
        break;
      case 'Sales':
        filteredDatasets = this.completeChartData.datasets.filter(dataset => dataset.label === 'Sales');
        break;
      case 'Expenses':
        filteredDatasets = this.completeChartData.datasets.filter(dataset => dataset.label === 'Expenses');
        break;
      default:
        filteredDatasets = this.completeChartData.datasets; // Return all datasets if no match
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



  //FOR CHARTSN AP
  private unsubscribe$ = new Subject<void>();


  // public lineChartOptions: ChartOptions<'line'> = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: false,
  //       position: 'top',
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: function (tooltipItem) {
  //           const dataValue = tooltipItem.raw;
  //           return ` ${dataValue}`;
  //         }
  //       }
  //     }
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: 'Dates',
  //       },
  //       ticks: {
  //         autoSkip: false,
  //         maxRotation: 60,
  //         minRotation: 60,
  //       },
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: 'Values',
  //       },
  //       beginAtZero: true,
  //     },
  //   },
  // };


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
  @ViewChild('myChartLineFrmnLastYear') myChartLineFrmnLastYear!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartIndicators30Days') myChartIndicators30Days!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartIndicators30DaysLY') myChartIndicators30DaysLY!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartAspect30') myChartAspect30!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartAspect30LY') myChartAspect30LY!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartFrmn') myChartFrmn!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartFrmn2') myChartFrmn2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartWeeklyEntry') myChartWeeklyEntry!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartMEntry') myChartMEntry!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartDEntry') myChartDEntry!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartMeanW') myChartMeanW!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChartMeanMo') myChartMeanMo!: ElementRef<HTMLCanvasElement>;

  filters: {
    Sector?: string, Aspects?: string, Source?: string, Indicator?: string, Frmn?: string, startDate?: string,
    endDate?: string
  } = {};

  filters1: {
    Sector?: string, Aspects?: string, Source?: string, Indicator?: string, Frmn?: string, startDate?: string,
    endDate?: string
  } = {};
  filters2: {
    Sector?: string, Aspects?: string, Source?: string, Indicator?: string, Frmn?: string, startDate?: string,
    endDate?: string
  } = {};
  filters3: {
    Sector?: string, Aspects?: string, Source?: string, Indicator?: string, Frmn?: string, startDate?: string,
    endDate?: string
  } = {};
  getFrmnDataAll(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/getfrmn30Days?last30Days=true";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.apiService.getWithHeaders(fullUrl)
      // this.apiService.getWithHeaders("Rpt/getfrmn30Days?last30Days=true")
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataLineFrmn = data;
          this.renderPieChartFrmn();
          // console.log('Filtered data:', this.chartDataLineFrmn);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderPieChartFrmn(): void {
    if (!this.chartDataLineFrmn || !this.myChartLineFrmn) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartLineFrmn) {
      this.chartLineFrmn.destroy();
    }

    const ctx = this.myChartLineFrmn.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartLineFrmn = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataLineFrmn.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataLineFrmn.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        },
        ]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90, // Rotate labels to 90 degrees
              minRotation: 90 // Ensure they are fully vertical
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  getFrmnDataAll30(): void {
    this.apiService.getWithHeaders("Rpt/getfrmn30Dayslastyear?last30Days=true")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataLineFrmnLastYear = data;
          this.renderPieChartFrmn30();
          // console.log('Filtered data:', this.chartDataLineFrmnLastYear);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderPieChartFrmn30(): void {
    if (!this.myChartLineFrmnLastYear || !this.myChartLineFrmnLastYear) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartLineFrmnLastYear) {
      this.chartLineFrmnLastYear.destroy();
    }

    const ctx = this.myChartLineFrmnLastYear.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartLineFrmnLastYear = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataLineFrmnLastYear.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataLineFrmnLastYear.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90, // Rotate labels to 90 degrees
              minRotation: 90 // Ensure they are fully vertical
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  getAspect30(): void {
    this.apiService.getWithHeaders("Rpt/getaspect30?last30Days=true")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataAspect30 = data;
          this.renderPieChartAspect30();
          // console.log('Filtered data:', this.chartDataAspect30);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderPieChartAspect30(): void {
    if (!this.chartDataAspect30 || !this.myChartAspect30) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartAspect30) {
      this.chartAspect30.destroy();
    }

    const ctx = this.myChartAspect30.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartAspect30 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataAspect30.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataAspect30.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',

          ],
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1.2
        },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90, // Rotate labels to 90 degrees
              minRotation: 90 // Ensure they are fully vertical
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
  }


  getAspect30LY(): void {
    this.apiService.getWithHeaders("Rpt/getaspect30LY?last30Days=true")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataAspect30LY = data;
          this.renderPieChartAspect30LY();
          // console.log('Filtered data:', this.chartDataAspect30LY);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderPieChartAspect30LY(): void {
    if (!this.chartDataAspect30LY || !this.myChartAspect30LY) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartAspect30LY) {
      this.chartAspect30LY.destroy();
    }

    const ctx = this.myChartAspect30LY.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartAspect30LY = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataAspect30LY.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataAspect30LY.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90, // Rotate labels to 90 degrees
              minRotation: 90 // Ensure they are fully vertical
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  getIndicators30Day(): void {
    this.apiService.getWithHeaders("Rpt/gettoptenindicators30?last30Days=true")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataIndicators30Days = data;
          this.renderPieChartIndicators30Day();
          // console.log('Filtered data:', this.chartDataIndicators30Days);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderPieChartIndicators30Day(): void {
    if (!this.chartDataIndicators30Days || !this.myChartIndicators30Days) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartIndicators30Days) {
      this.chartIndicators30Days.destroy();
    }

    const ctx = this.myChartIndicators30Days.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartIndicators30Days = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataIndicators30Days.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataIndicators30Days.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90, // Rotate labels to 90 degrees
              minRotation: 90 // Ensure they are fully vertical
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  getIndicators30DaysLY(): void {
    this.apiService.getWithHeaders("Rpt/gettoptenindicators30LY?last30Days=true")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataIndicators30DaysLY = data;
          this.renderPieChartIndicators30DayLY();
          // console.log('Filtered data:', this.chartDataIndicators30DaysLY);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderPieChartIndicators30DayLY(): void {
    if (!this.chartDataIndicators30DaysLY || !this.myChartIndicators30DaysLY) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartIndicators30DaysLY) {
      this.chartIndicators30DaysLY.destroy();
    }

    const ctx = this.myChartIndicators30DaysLY.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartIndicators30DaysLY = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataIndicators30DaysLY.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataIndicators30DaysLY.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90, // Rotate labels to 90 degrees
              minRotation: 90 // Ensure they are fully vertical
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  getFrmnAll(): void {
    this.apiService.getWithHeaders("Rpt/getfrmn")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataFrmn = data;
          this.renderChartFrmn();
          // console.log('Filtered data:', this.chartDataFrmn);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderChartFrmn(): void {
    if (!this.chartDataFrmn || !this.myChartFrmn) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartFrmn) {
      this.chartFrmn.destroy();
    }

    const ctx = this.myChartFrmn.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartFrmn = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataFrmn.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataFrmn.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  getFrmnAll2(): void {
    this.apiService.getWithHeaders("Rpt/getfrmn")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataFrmn2 = data;
          this.renderChartFrmn2();
          // console.log('Filtered data:', this.chartDataFrmn2);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  renderChartFrmn2(): void {
    if (!this.chartDataFrmn2 || !this.myChartFrmn2) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartFrmn2) {
      this.chartFrmn2.destroy();
    }

    const ctx = this.myChartFrmn2.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    this.chartFrmn2 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataFrmn2.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataFrmn2.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });

  }

  //             FOR WEEKLY,Monthly,DailyCharts
  getWeeklyEntries(): void {
    this.apiService.getWithHeaders("Rpt/weekly-entries-test")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataWeeklyEntry = data;
          this.renderChartWeeklyEntry();
          // console.log('Filtered data:', this.chartDataWeeklyEntry);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  getMEntries(): void {
    this.apiService.getWithHeaders("Rpt/monthly-entries-test")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataMEntry = data;
          this.renderChartMEntry();
          // console.log('Filtered data:', this.chartDataMEntry);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  getDEntries(): void {
    this.apiService.getWithHeaders("Rpt/daily-entries-chart")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataDEntry = data;
          this.renderChartDEntry(

          );
          // console.log('Filtered data:', this.chartDataDEntry);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  getMeanWeek(): void {
    this.apiService.getWithHeaders("Rpt/weekly-entries-test")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataMeanWeek = data;
          this.renderChartMeanW();
          // console.log('Filtered data:', this.chartDataMeanWeek);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  getMeanMonth(): void {
    this.apiService.getWithHeaders("Rpt/monthly-entries-test")
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataMeanMonth = data;
          this.renderChartMeanMo();
          // console.log('Filtered data:', this.chartDataMeanMonth);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }

  renderChartMeanW(): void {
    if (!this.chartDataMeanWeek || !this.myChartMeanW) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }



    const ctx = this.myChartMeanW.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }




    this.chartMeanWeek = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataMeanWeek.labels,
        datasets: [{
          label: 'Mean',
          data: this.chartDataMeanWeek.data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2,

        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }

        },


      },

    });
  }
  renderChartMeanMo(): void {
    if (!this.chartDataMeanMonth || !this.myChartMeanMo) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartMeanMonth) {
      this.chartMeanMonth.destroy();
    }

    const ctx = this.myChartMeanMo.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }


    this.chartMeanMonth = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataMeanMonth.labels,
        datasets: [{
          label: 'Mean',
          data: this.chartDataMeanMonth,
          backgroundColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
            // 'rgba(199, 199, 199, 1)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2,

        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }

        },


      },

    });
  }

  renderChartWeeklyEntry(): void {
    if (!this.chartDataWeeklyEntry || !this.myChartWeeklyEntry) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartWeeklyEntry) {
      this.chartWeeklyEntry.destroy();
    }

    const ctx = this.myChartWeeklyEntry.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }





    this.chartWeeklyEntry = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataWeeklyEntry.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataWeeklyEntry.data,
          backgroundColor: this.chartDataWeeklyEntry.alerts,
          borderColor: this.chartDataWeeklyEntry.alerts,
          borderWidth: 1.2
        },
        {
          label: 'Mean',
          data: this.chartDataWeeklyEntry.data2,
          backgroundColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2,


        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
    this.createDataTable();
  }

  renderChartMEntry(): void {
    if (!this.chartDataMEntry || !this.myChartMEntry) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartMEntry) {
      this.chartMEntry.destroy();
    }

    const ctx = this.myChartMEntry.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    const meanValueArray = Array(this.chartDataMEntry.labels.length).fill(this.chartDataMeanMonth);

    this.chartMEntry = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataMEntry.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataMEntry.data,
          backgroundColor: this.chartDataMEntry.alerts,
          borderColor: this.chartDataMEntry.alerts,
          borderWidth: 1.2
        },
        {
          label: 'Mean',
          // data: this.chartDataMeanMonth.data,
          data: this.chartDataMEntry.data2,
          backgroundColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2,


        }
        ]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });
    this.createDataTable();
  }

  renderChartDEntry(): void {
    if (!this.chartDataDEntry || !this.myChartDEntry) {
      // this.renderEmptyPieChart(this.myChart111);
      return;
    }

    if (this.chartDEntry) {
      this.chartDEntry.destroy();
    }

    const ctx = this.myChartDEntry.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }




    this.chartDEntry = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDataDEntry.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataDEntry.data,
          backgroundColor: this.chartDataDEntry.alerts,
          borderColor: this.chartDataDEntry.alerts,
          borderWidth: 1.2
        },
        {
          label: 'Mean',
          data: this.chartDataDEntry.data2,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',

          ],
          borderColor: [
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1.2
        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: ''
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            },
            beginAtZero: true
          }
        }
      }
    });

    this.createDataTable();

  }
  // createDataTable(): void {
  //   const tableBody = document.getElementById('data-table-body');
  //   const meanTableBody = document.getElementById('mean-table-body');

  //   if (!tableBody || !meanTableBody) {
  //     console.error('Table body element not found.');
  //     return;
  //   }

  //   // Clear previous rows
  //   tableBody.innerHTML = '';
  //   meanTableBody.innerHTML = '';

  //   const meanValue = this.chartDataDEntry.data2[0] || 'N/A'; // Replace with actual mean calculation if needed

  //   // Update the Mean header value (optional if dynamic)
  //   const meanHeader = document.getElementById('mean-header');
  //   if (meanHeader) {
  //     meanHeader.textContent = `Mean: ${meanValue}`; // Show the mean value only once in the header
  //   }

  //   // Populate the table with labels and data
  //   this.chartDataDEntry.labels.forEach((label: string, index: number) => {
  //     const row = document.createElement('tr');
  //     const cell1 = document.createElement('td');
  //     const cell2 = document.createElement('td');
  //     const cell3 = document.createElement('td');

  //     row.style.backgroundColor = this.chartDataDEntry.alerts[index];

  //     cell1.textContent = label; // Label
  //     cell2.textContent = this.chartDataDEntry.data[index]; // Data
  //     // cell3.textContent = ''; // Mean (if applicable)

  //     const icon = document.createElement('span');
  //     icon.classList.add('arrow-icon'); // Apply arrow icon styling
  //     icon.textContent = '>>';  // Use a down arrow (Unicode character)

  //     icon.addEventListener('click', () => {
  //       event.stopPropagation();
  //       console.log("Icon clicked: ", label, meanValue);
  //       this.updateMeanTable(label, this.chartDataDEntry.data2[index]);  // Update the right table with the mean value
  //     });

  //     cell3.appendChild(icon);

  //     row.appendChild(cell1);
  //     row.appendChild(cell2);
  //     row.appendChild(cell3);

  //     tableBody.appendChild(row);
  //   });
  // }
  // updateMeanTable(label: string, meanValue: number): void {
  //   const meanTableBody = document.getElementById('mean-table-body');
  //   if (!meanTableBody) {
  //     console.error('Mean table body element not found.');
  //     return;
  //   }

  //   // Create a new row for the mean value
  //   const row = document.createElement('tr');
  //   const cell1 = document.createElement('td');
  //   const cell2 = document.createElement('td');

  //   cell1.textContent = label; // Label
  //   cell2.textContent = meanValue.toString(); // Mean value

  //   row.appendChild(cell1);
  //   row.appendChild(cell2);
  //   meanTableBody.appendChild(row);
  // }
  createDataTable(): void {
    const tableBody = document.getElementById('data-table-body');
    const meanTableBody = document.getElementById('mean-table-body');
    const meanTable = document.getElementById('mean-table');

    if (!tableBody || !meanTableBody || !meanTable) {
      console.error('Table body element not found.');
      return;
    }

    // Clear previous rows
    tableBody.innerHTML = '';
    meanTableBody.innerHTML = '';

    const meanValue = this.chartDataDEntry.data2[0] || 'N/A'; // Replace with actual mean calculation if needed

    // Update the Mean header value (optional if dynamic)
    const meanHeader = document.getElementById('mean-header');
    if (meanHeader) {
      meanHeader.textContent = `Mean: ${meanValue}`; // Show the mean value only once in the header
    }

    // Populate the table with labels and data
    this.chartDataDEntry.labels.forEach((label: string, index: number) => {
      const row = document.createElement('tr');
      const cell1 = document.createElement('td');
      const cell2 = document.createElement('td');
      const cell3 = document.createElement('td');

      row.style.backgroundColor = this.chartDataDEntry.alerts[index];

      cell1.textContent = label; // Label
      cell2.textContent = this.chartDataDEntry.data[index]; // Data

      const icon = document.createElement('span');
      icon.classList.add('arrow-icon'); // Apply arrow icon styling
      icon.textContent = '>>';  // Use a down arrow (Unicode character)

      icon.addEventListener('click', () => {
        event.stopPropagation();
        const relatedIds = this.chartDataDEntry.id[index];
        const queryParams = relatedIds.map(id => `ids=${id}`).join('&');
        console.log("Icon clicked: ", label, meanValue, relatedIds);
        // Pass the count along with the label to update the mean table with multiple rows
        // this.updateMeanTable(label, this.chartDataDEntry.data2[index], this.chartDataDEntry.data[index],relatedIds);
        this.apiService.getWithHeaders(`MasterData/by-ids?${queryParams}`).subscribe(data => {
          console.log('Data from API:', data);
          const frmn = data.map(item => item.frmn);   // Adjust based on the actual response structure
          const sector = data.map(item => item.sector); // Adjust based on the actual response structure
          const aspect = data.map(item => item.aspect);
          this.updateMeanTable(label, meanValue, this.chartDataDEntry.data[index], frmn, sector, aspect);
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

  updateMeanTable(label: string, meanValue: number, count: number, frmn: string[], sector: string, aspect: string,): void {
    const meanTableBody = document.getElementById('mean-table-body');
    if (!meanTableBody) {
      console.error('Mean table body element not found.');
      return;
    }

    // Clear previous rows
    meanTableBody.innerHTML = '';

    // Loop through the count for that label and populate the table with each entry's details
    for (let i = 0; i < count; i++) {
      const row = document.createElement('tr');

      // Add the label and mean value for each entry
      const cell1 = document.createElement('td');
      const cell2 = document.createElement('td');
      const cell3 = document.createElement('td');
      const cell4 = document.createElement('td'); // Frmn
      const cell5 = document.createElement('td');

      // Add the data you need for each entry (example: Frmns, Sectors, Aspects)
      cell1.textContent = label; // Label
      cell2.textContent = meanValue.toString(); // Mean Value
      cell3.textContent = frmn[i] || 'N/A';  // Add Frmns data
      cell4.textContent = sector[i] || 'N/A'; // Set the Frmn value
      cell5.textContent = aspect[i] || 'N/A';

      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell4);
      row.appendChild(cell5);

      meanTableBody.appendChild(row);
    }
  }


  //Dropdown for chart
  selected11: string = '';
  selectedType11 = '';
  onChange1(event: any) {
    this.selected11 = event.value;
    console.log(`Dropdown changed: ${this.selected11}`); // Debugging statement
    this.renderChart();

  }
  renderChart(): void {
    console.log(`Rendering chart for: ${this.selected11}`);

    // Destroy existing charts to avoid memory leaks
    this.chartWeeklyEntry?.destroy();
    this.chartMEntry?.destroy();
    this.chartDEntry?.destroy();

    // Render the chart based on the selected type
    switch (this.selected11) {
      case 'Weekly':
        // this.renderChartWeeklyEntry();
        this.getWeeklyEntries();
        break;
      case 'Monthly':
        // this.renderChartMEntry();
        this.getMEntries();

        break;
      case 'Daily':
        // this.renderChartDEntry();
        this.getDEntries();
        break;
      default:
        console.warn('Unknown chart type selected.');
    }
  }


  // FOR CHARTS

  chartDataInput: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  chartDataInputLY: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  chartDataAspect: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  chartDataAspectLY: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  chartDataIndicator: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  chartDataIndicatorLY: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  chartDataVariation1: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  chartDataVariation2: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  isLoadingPie: boolean = false;

  getNoOfInputChart(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/getfrmn30Days?last30Days=true";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataInput = {
            labels: data.labels,  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(0, 0, 0, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          this.isLoadingPie = false;
        },
      });
  }
  getNoOfInputChartLY(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    // const baseUrl = "Rpt/getfrmn30Dayslastyear?last30Days=true";
    const baseUrl = "Rpt/getfrmn30Dayslastyear?last30Days=true";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataInputLY = {
            labels: data.labels,  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(0, 0, 0, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          this.isLoadingPie = false;
        },
      });
  }
  getAspectChart(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/getaspect30?last30Days=true";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataAspect = {
            labels: data.labels,  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          this.isLoadingPie = false;
        },
      });
  }
  getAspectChartLY(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/getaspect30LY?last30Days=true";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataAspectLY = {
            labels: data.labels,  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          this.isLoadingPie = false;
        },
      });
  }
  getIndicatorChart(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/gettoptenindicators30?last30Days=true";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataIndicator = {
            labels: data.labels,  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(0, 0, 0, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          this.isLoadingPie = false;
        },
      });
  }
  getIndicatorChartLY(): void {
    const queryParams = Object.entries(this.filters)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/gettoptenindicators30LY?last30Days=true";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const updatedData = data.datasets[0].data;
          this.chartDataIndicatorLY = {
            labels: data.labels,  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          this.isLoadingPie = false;
        },
      });
  }
  getVariationChart1(): void {
    const queryParams = Object.entries(this.filters2)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/daily-entries-chart";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    console.log('Request URL:', fullUrl);
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          if (!data || !data.data || data.data.length === 0) {
            console.error('Invalid data format:', data);
            this.emptyChart();
            this.isLoadingPie = false;
            return;
          }
          const updatedData = data.data;
          this.chartDataVariation1 = {
            labels: data.labels || [],  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          console.error('Full URL causing error:', fullUrl);
          this.isLoadingPie = false;
        },
      });
  }
  getVariationChart2(): void {
    const queryParams = Object.entries(this.filters1)
      .filter(([key, value]) => value) // Include only non-empty filters
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Base URL
    const baseUrl = "Rpt/daily-entries-chart";

    // Full URL with query parameters
    const fullUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    this.isLoadingPie = true;
    this.apiService.getWithHeaders(fullUrl)  // API 1 for Pie Chart
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          if (!data || !data.data || data.data.length === 0) {
            console.error('Invalid data format:', data);
            this.emptyChart1();
            this.isLoadingPie = false;
            return;
          }
          const updatedData = data.data;
          this.chartDataVariation2 = {
            labels: data.labels,  // Assuming the API returns an array of labels
            datasets: [
              {
                data: updatedData,  // Assuming the API returns an array of values
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1.2,
              },
            ],
          };
          this.isLoadingPie = false;
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
          this.isLoadingPie = false;
        },
      });
  }
  // onDateRangeChange(): void {
  //   if (this.filters.startDate && this.filters.endDate) {
  //     // Print the final URL to the console
  //     const queryParams = Object.entries(this.filters)
  //       .filter(([key, value]) => value)
  //       .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  //       .join('&');
  //     console.log('Generated API URL:', `Rpt/daily-entries-chart?${queryParams}`);

  //     // Call the API to fetch the chart data based on the selected date range
  //     this.getVariationChart1();
  //   }
  // }
  onDateRangeChange(): void {
    console.log('Date range changed:', this.filters2.startDate, this.filters2.endDate);
    if (this.filters2.startDate && this.filters2.endDate) {
      // Format dates for the API
      const formattedStartDate = this.datePipe.transform(this.filters2.startDate, 'yyyy-MM-ddTHH:mm:ss.SSSSSSS');
      const formattedEndDate = this.datePipe.transform(this.filters2.endDate, 'yyyy-MM-ddTHH:mm:ss.SSSSSSS');

      if (formattedStartDate && formattedEndDate) {
        this.filters2.startDate = formattedStartDate;
        this.filters2.endDate = formattedEndDate;

        console.log('Filters with formatted dates:', this.filters2);

        // Call the API to update the chart
        this.getVariationChart1();
      } else {
        console.error('Invalid date format for start or end date.');
      }
    }
  }
  onDateRangeChange2(): void {
    console.log('Date range changed:', this.filters1.startDate, this.filters1.endDate);
    if (this.filters1.startDate && this.filters1.endDate) {
      // Format dates for the API
      const formattedStartDate = this.datePipe.transform(this.filters1.startDate, 'yyyy-MM-ddTHH:mm:ss.SSSSSSS');
      const formattedEndDate = this.datePipe.transform(this.filters1.endDate, 'yyyy-MM-ddTHH:mm:ss.SSSSSSS');

      if (formattedStartDate && formattedEndDate) {
        this.filters1.startDate = formattedStartDate;
        this.filters1.endDate = formattedEndDate;

        console.log('Filters with formatted dates:', this.filters1);

        // Call the API to update the chart
        this.getVariationChart2();
      } else {
        console.error('Invalid date format for start or end date.');
      }
    }
  }

  //For Resetting the Filters and Charts

  resetFilters() {
    // Reset ng-select values
    this.filters1.Frmn = null;
    this.filters1.Sector = null;
    this.filters1.Aspects = null;
    this.filters1.Indicator = null;

    // Reset date range picker values
    this.filters1.startDate = null;
    this.filters1.endDate = null;

    this.onFilterChange2('fmn', null);  // Resetting Fmn dropdown filter
    this.onFilterChange2('sector', null);  // Resetting Sector dropdown filter
    this.onFilterChange2('aspects', null);  // Resetting Aspects dropdown filter
    this.onFilterChange2('indicator', null);
  }
  resetFilters1() {
    // Reset ng-select values
    this.filters2.Frmn = null;
    this.filters2.Sector = null;
    this.filters2.Aspects = null;
    this.filters2.Indicator = null;

    // Reset date range picker values
    this.filters2.startDate = null;
    this.filters2.endDate = null;

    this.onFilterChange3('fmn', null);  // Resetting Fmn dropdown filter
    this.onFilterChange3('sector', null);  // Resetting Sector dropdown filter
    this.onFilterChange3('aspects', null);  // Resetting Aspects dropdown filter
    this.onFilterChange3('indicator', null);
  }
  resetFilters2() {
    // Reset ng-select values
    this.filters.Frmn = null;
    this.filters.Sector = null;
    this.filters.Aspects = null;
    this.filters.Indicator = null;

    // Reset date range picker values
    this.filters.startDate = null;
    this.filters.endDate = null;

    // this.onFilterChange1('fmn', null);  // Resetting Fmn dropdown filter
    // this.onFilterChange1('sector', null);  // Resetting Sector dropdown filter
    // this.onFilterChange1('aspects', null);  // Resetting Aspects dropdown filter
    // this.onFilterChange1('indicator', null);
  }

  // Method to empty the chart
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
