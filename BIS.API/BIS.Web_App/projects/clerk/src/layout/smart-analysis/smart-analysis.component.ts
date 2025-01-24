import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { ChartListModel } from 'projects/sharedlibrary/src/model/smart-analysis.model';

@Component({
  selector: 'app-smart-analysis',
  imports: [SharedLibraryModule,BaseChartDirective],
  templateUrl: './smart-analysis.component.html',
  styleUrl: './smart-analysis.component.scss'
})
export class SmartAnalysisComponent implements OnInit, OnDestroy {
  // savedNotes: IsavedNotes[] = [];
  fmnList: string[] = ["33 Corps", "27 Mtn Div", "17 Mtn Div", "111 Sub Area", "20 Mtn Div", "3 Corps", "2 Mtn Div", "56 Mtn Div", "57 Mtn Div", "4 Corps", "5 Mtn Div", "21 Mtn Div", "71 Mtn Div", "17 Corps", "59 Mtn Div", "23 Mtn Div"];
  sectorList:string[]=['None','PSS','MSS','Cho_la','Doka_la'];
  aspectList:string[]=['None','Svl / Counter Svl','Friction / Belligerence','Ae Activity','Conc of Tps','Armr / Arty / AD / Engrs Indn','Mob','Infra Devp','Dumping of WLS','Heightened Diplomatic Eng','Collapse of Diplomatic Ties','Propoganda','Internal Issues','Cyber','Def','Interactions'];
  indicatorList:string[]=['None','Placement of addl Svl Eqpt','Incr Recce','Incr in OP loc','Jamming','Enhanced Tourist Influx']
  chartList:string[] = ['Monthly','Daily','Weekly']
  chartListModel:ChartListModel=new ChartListModel()
  constructor(private apiService:ApiService){

    this.getDEntries();
  }

  onFilterChange($event){

  }
  onFilterChange1(filterKey: string, event: any): void {
    this.filters[filterKey] = event;
    this.getFrmnDataAll();

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
        display: true,
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

   ngOnInit(): void {
     this.getFrmnDataAll();
     this.getFrmnDataAll30();
     this.getAspect30();
     this.getAspect30LY();
     this.getIndicators30Day();
     this.getIndicators30DaysLY();
     this.getFrmnAll();
     this.getFrmnAll2();
     this.getMeanWeek();
     this.getMeanMonth();
     this.getWeeklyEntries();
     this.getMEntries();
     this.onChange1('');

  }

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

  filters: { Sector?: string, Aspects?: string, Source?: string, Indicator?: string, Frmn?: string,} = {};

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
debugger
    this.chartFrmn = new Chart(ctx, {
      type: 'line',
      data: {
        // labels: this.chartDataFrmn.labels,
        labels:this.chartDataDEntry.labels,
        datasets: [{
          label: 'Variation',
          data: this.chartDataDEntry.data,
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
        labels: this.chartDataDEntry.labels,
        datasets: [{
          label: 'Fmn',
          data: this.chartDataDEntry.data,
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


    this.apiService.postWithHeader("Rpt/weekly-entries-test",this.chartListModel)
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {

          console.log('Filtered data from API:', data);
          this.chartDataWeeklyEntry = data;
          this.chartDataDEntry = data;
          this.renderChartWeeklyEntry();
          console.log('Filtered data:', this.chartDataWeeklyEntry);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  getMEntries(): void {
    this.apiService.postWithHeader("Rpt/monthly-entries-test",this.chartListModel)
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
          // console.log('Filtered data from API:', data);
          this.chartDataMEntry = data;
          this.chartDataDEntry = data;
          this.renderChartMEntry();
          // console.log('Filtered data:', this.chartDataMEntry);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }

      });
  }
  getDEntries(): void {
    this.apiService.postWithHeader("Rpt/daily-entries-chart",this.chartListModel)
      .pipe(
        takeUntil(this.unsubscribe$) // Unsubscribe when `unsubscribe$` emits
      ).subscribe({
        next: (data) => {
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
    this.apiService.postWithHeader("Rpt/weekly-entries-test",this.chartListModel)
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
    this.apiService.postWithHeader("Rpt/monthly-entries-test",this.chartListModel)
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
  createDataTable(): void {

    const tableBody = document.getElementById('data-table-body');
    if (!tableBody) {
      console.error('Table body element not found.');
      return;
    }

    // Clear previous rows
    tableBody.innerHTML = '';

    // Populate the table with labels and data
    this.chartDataDEntry.labels.forEach((label: string, index: number) => {
      const row = document.createElement('tr');
      const cell1 = document.createElement('td');
      const cell2 = document.createElement('td');
      const cell3 = document.createElement('td');

      row.style.backgroundColor = this.chartDataDEntry.alerts[index];

      cell1.textContent = label; // Label
      cell2.textContent = this.chartDataDEntry.data[index]; // Data
      cell3.textContent = this.chartDataDEntry.data2[index]; // Mean (if applicable)

      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      tableBody.appendChild(row);
    });
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
}
