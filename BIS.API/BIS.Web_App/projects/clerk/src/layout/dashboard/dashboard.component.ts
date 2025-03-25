import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SharedLibraryModule } from '../../../../sharedlibrary/src/shared-library.module';
import { ApiService } from '../../../../sharedlibrary/src/services/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { DashboardFmnAspect } from 'projects/sharedlibrary/src/model/dashboard-fmn-aspect';
import { DasboardChart, DashboardInputCount, FilterModel } from 'projects/sharedlibrary/src/model/dashboard.model';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { Division } from 'projects/sharedlibrary/src/model/base.model';

@Component({
  selector: 'app-dashboard',
  imports: [SharedLibraryModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboardCount:DashboardInputCount = new DashboardInputCount();
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  // Map to track selected charts by their IDs
  selectedCharts: { [key: string]: boolean } = {
    chart0: false,
    chart1: false,
    chart2: false,
    chart3: false,
  };

  frmnList:any[]=[];
  sectorList: any = [];
  filterModel: FilterModel = new FilterModel();
  indicatorFilter:FilterModel = new FilterModel();

  sectorInputChartData:ChartData<'pie'>;
  sector30DaysChartData:ChartData<'pie'>;
  sectorTodayChartData:ChartData<'pie'>;
  sector12MonthsChartData:ChartData<'line'>;

  frmInputChartData:ChartData<'pie'>;
  frm30DaysChartData:ChartData<'pie'>;
  frmTodayChartData:ChartData<'pie'>;
  frm12MonthsChartData:ChartData<'line'>;

  aspectAllChartData:ChartData<'pie'>;
  aspect30DaysChartData:ChartData<'pie'>;
  aspectTodayChartData:ChartData<'pie'>;
  aspect12MonthsChartData:ChartData<'line'>;

  // Indicator
  indicatorData:ChartData<'pie'>;
  indicatorTop5Data:ChartData<'pie'>;

  // EnLocation
  enLocationData:ChartData<'pie'>;
  enLocationData7Days:ChartData<'pie'>;

  public barChartLabels: string[] = [];
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] }
  private sectorColorMap: { [key: string]: string } = {};

  constructor(private apiService: ApiService,private authService:AuthService) {
    this.getFrmDetails();
    this.getSector();
  }

  ngOnInit(): void {

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
            this.indicatorFilter.frmn = [];
          }
          this.filterModel.frmn.push({ ...frm });
          this.indicatorFilter.frmn.push({ ...frm });
          this.getAll();
        }
      }
    })
  }
  syncModels(selectedItems: any) {
    this.indicatorFilter.frmn = [...selectedItems];  // Sync with the second model
    this.getAll();
  }

  getAll(){
    this.getCount();
    this.getFrmAndAspect();
    this.getIndicatorAndLocation();
  }

  getFrmAndAspect() {
    this.getFrmInputData();
    this.getFrm30DaysData();
    this.getFrmTodayData();
    this.getFrm12MonthsData();
    this.getAspectAllData()
    this.getAspect30DaysData();
    this.getAspectTodayData();
    this.getAspect12MonthsData();
    this.getSectorInputData()
    this.getSectorInput30DaysData();
    this.getSectorInputTodayData();
    this.getSector12MonthsData();
  }
  getIndicatorAndLocation() {
    this.getIndicatorData();
    this.getTop5IndicatorData();
    this.getTop5EnLocationData();
    this.getTop5EnLoc7DaysData();
  }
  getSector() {
    this.apiService.getWithHeaders('MasterData/sector').subscribe(res => {
      if (res) {
        this.sectorList = res;
      }
    })
  }
  getFrmnList(id){
    this.apiService.getWithHeaders('corps/frmlist/'+id).subscribe(res =>{
      if(res){
        this.frmnList = res;
        this.filterModel.frmn = [];
        this.filterModel.frmn.push(res[res.length - 1].name)
      }
    })
  }
  isAnyCheckboxSelected(): boolean {
    return Object.values(this.selectedCharts).some(selected => selected);
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
    switch(chartId){
      case 'Sector_wise_Inputs':index = 0; break;
      case 'Sector_wise(Last_30_Days)': index = 1; break;
      case 'Sector_wise(Today)' : index = 2; break;
      case 'Sector_wise(Last_12_Months)' : index = 3; break;
      // fmn chart
      case 'Fmn_wise_Inputs' :index = 4; break;
      case 'Fmn_wise(Last_30_Days)': index = 5; break;
      case 'Fmn_wise(Today)' : index = 6; break;
      case 'Fmn_wise_(Last_12_Months)' : index = 7; break;
      // aspect chart
      case 'All_Aspect' : index = 8; break;
      case 'Aspect (Last_30_Days)': index = 9; break;
      case 'Aspect_Today' : index = 10; break;
      case 'Aspect (Last_12_Months)' : index = 11; break;
      // indicator chart
      case 'Top_10_Indicators(Last_7_Days)': index = 12; break;
      case 'Top_5_Indicators': index = 13; break;
      case 'Top_5_Location' : index = 14; break;
      case 'Top_5_Loc(7_Days)' : index = 15; break;
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

  // Getting Input Counts
   getCount() {
   this.apiService.postWithHeader('dashboard/count', this.filterModel).subscribe(res => {
     if (res) {
       this.dashboardCount = res;
     }
   })
 }

  // Getting Sector Chart Data
  getSectorInputData(){
    this.apiService.postWithHeader('dashboard/sector',this.filterModel).subscribe(res =>{
      if(res){
        this.sectorInputChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getSectorInput30DaysData(){
    this.apiService.postWithHeader('dashboard/sector/30days',this.filterModel).subscribe(res =>{
      if(res){
        this.sector30DaysChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getSectorInputTodayData(){
    this.apiService.postWithHeader('dashboard/sector/today',this.filterModel).subscribe(res =>{
      if(res){
        this.sectorTodayChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getSector12MonthsData() {
    this.apiService.postWithHeader('dashboard/sector/last12Months', this.filterModel).subscribe(res => {
      if (res) {
        this.prepareChartData(res);
      }
    });
  }

  prepareChartData(chartData: { name: any[], frmnData: { [key: string]: number[] } }) {
    this.barChartLabels = chartData.name.map(label => label.toString()); // Convert dynamic labels to strings

    const datasets = Object.keys(chartData.frmnData).map(sector => ({
      label: sector.toString(), // Ensure dynamic key is converted to a string
      data: chartData.frmnData[sector],
      backgroundColor: this.getSectorColor(sector.toString()) // Ensure correct color assignment
    }));

    this.barChartData = {
      labels: this.barChartLabels,
      datasets
    };
  }

  getSectorColor(sector: string): string {
    if (!this.sectorColorMap[sector]) {
      // Assign colors cyclically from the bgColor array
      const colorIndex = Object.keys(this.sectorColorMap).length % this.bgColor.length;
      this.sectorColorMap[sector] = this.bgColor[colorIndex];
    }
    return this.sectorColorMap[sector];
  }


  // Getting Frmn Chart Data
  getFrmInputData(){
    this.apiService.postWithHeader('dashboard/fmn',this.filterModel).subscribe(res =>{
      if(res){
        this.frmInputChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getFrm30DaysData(){
    this.apiService.postWithHeader('dashboard/fmn/30days',this.filterModel).subscribe(res =>{
      if(res){
        this.frm30DaysChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getFrmTodayData(){
    this.apiService.postWithHeader('dashboard/fmn/today',this.filterModel).subscribe(res =>{
      if(res){
        this.frmTodayChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getFrm12MonthsData() {
    this.apiService.postWithHeader('dashboard/fmn/last12Months', this.filterModel).subscribe(res => {
      if (res) {
        this.frm12MonthsChartData = {
          labels: res.name,
          datasets: Object.keys(res.frmnData).map((frmn,index) => {
            const lineColor = this.bgColor[index % this.bgColor.length];
            return {
              label: frmn,
              data: res.frmnData[frmn],
              borderColor: lineColor,
              borderWidth: 1.9,
              fill: false,
              tension: 0.4
            };
          })
        };
      }
    });
  }

  // getFrm12MonthsData(){
  //   this.apiService.postWithHeader('dashboard/fmn/last12Months',this.filterModel).subscribe(res =>{
  //     if(res){
  //       debugger;
  //       console.log(res)
  //       this.frm12MonthsChartData = {
  //         labels: res.name,
  //         datasets: [
  //           {
  //             data: res.count, label: res.name,
  //             borderColor: '#8AB2A6',
  //             borderWidth: 1.9,
  //             fill: false,
  //             tension: 0.4,
  //           },
  //         ],
  //       };
  //     }
  //   })
  // }
  // Getting Aspect Chart Data
  getAspectAllData(){
    this.apiService.postWithHeader('dashboard/aspect',this.filterModel).subscribe(res =>{
      if(res){
        this.aspectAllChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name
            },
          ],
        };
      }
    })
  }
  getAspect30DaysData(){
    this.apiService.postWithHeader('dashboard/aspect/30days',this.filterModel).subscribe(res =>{
      if(res){
        this.aspect30DaysChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name
              ,backgroundColor:this.bgColor

            },
          ],
        };
      }
    })
  }
  getAspectTodayData(){
    this.apiService.postWithHeader('dashboard/aspect/today',this.filterModel).subscribe(res =>{
      if(res){
        this.aspectTodayChartData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name},
          ],
        };
      }
    })
  }
  getAspect12MonthsData() {
    this.apiService.postWithHeader('dashboard/aspect/last12Months', this.filterModel).subscribe(res => {
      if (res) {
        console.log(res)
        const colors = ['#F38C79', '#8AB2A6', '#E27D60', '#85CDCA', '#C38D9E', '#41B3A3']; // Different colors for aspects
        this.aspect12MonthsChartData = {
          labels: res.name, // Month-Year labels
          datasets: Object.keys(res.frmnData).map((aspect, index) => {
            return {
              label: aspect, // Aspect Name
              data: res.frmnData[aspect], // Aspect-wise count
              borderColor: this.bgColor[index % this.bgColor.length], // Assign different colors
              borderWidth: 1.9,
              fill: false,
              tension: 0.4
            };
          })
        };
      }
    });
  }

  // Getting Indicator Chart Data
  getIndicatorData(){
    this.apiService.postWithHeader('dashboard/indicator',this.indicatorFilter).subscribe(res =>{
      if(res){
        this.indicatorData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getTop5IndicatorData(){
    this.apiService.postWithHeader('dashboard/indicator/top5',this.indicatorFilter).subscribe(res =>{
      if(res){
        this.indicatorTop5Data = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getTop5EnLocationData(){
    this.apiService.postWithHeader('dashboard/location',this.indicatorFilter).subscribe(res =>{
      if(res){
        this.enLocationData = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }
  getTop5EnLoc7DaysData(){
    this.apiService.postWithHeader('dashboard/location/7days',this.filterModel).subscribe(res =>{
      if(res){
        this.enLocationData7Days = {
          labels: res.name,
          datasets: [
            { data: res.count, label: res.name },
          ],
        };
      }
    })
  }

  public  bgColor= [
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(255, 159, 64, 0.8)',   // Orange
    'rgba(22, 196, 127, 0.8)',   // Green
    'rgba(255, 99, 132, 0.9)',   // Red
    'rgba(112, 128, 144, 0.7)',  // Gray
    'rgba(249, 253, 129, 0.7)',  // Yellow
    'rgba(153, 102, 255, 0.8)',  // Purple
    'rgba(75, 192, 192, 0.8)',   // Teal
    'rgba(255, 87, 51, 0.8)',    // Bright Red-Orange
    'rgba(128, 0, 128, 0.8)',    // Purple
    'rgba(255, 215, 0, 0.8)',    // Gold
    'rgba(0, 255, 127, 0.8)',    // Spring Green
    'rgba(70, 130, 180, 0.8)',   // Steel Blue
    'rgba(240, 128, 128, 0.8)',  // Light Coral
    'rgba(135, 206, 250, 0.8)',  // Light Sky Blue
    'rgba(199, 21, 133, 0.8)',   // Medium Violet Red
    'rgba(0, 128, 128, 0.8)',    // Teal
    'rgba(154, 205, 50, 0.8)',   // Yellow-Green
  ]
  public ChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        // display:false
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataLabel = tooltipItem.label;
            const dataValue = tooltipItem.raw;
            return ` ${dataValue}`;
          }
        }
      }
    },
    elements: {
      arc: {
        backgroundColor: this.bgColor
      },
    },
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Enable legend
        position: 'top', // Position at the top
        align: 'center', // Center align
        labels: {
          usePointStyle: true, // Use point style to match dataset colors
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const datasetLabel = tooltipItem.dataset.label || '';
            const dataValue = tooltipItem.raw;
            return `${datasetLabel}: ${dataValue}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
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
  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const sectorName = tooltipItem.dataset.label; // Get sector name
            const count = tooltipItem.raw; // Get count
            return `${sectorName}: ${count}`; // Format tooltip
          }
        }
      }
    }
  };

}
