import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-cdr-dashboard',
  imports: [SharedLibraryModule,BaseChartDirective],
  templateUrl: './cdr-dashboard.component.html',
  styleUrl: './cdr-dashboard.component.scss'
})
export class CdrDashboardComponent {
  fmnList: string[] = ["33 Corps", "27 Mtn Div", "17 Mtn Div", "111 Sub Area", "20 Mtn Div", "3 Corps", "2 Mtn Div", "56 Mtn Div", "57 Mtn Div", "4 Corps", "5 Mtn Div", "21 Mtn Div", "71 Mtn Div", "17 Corps", "59 Mtn Div", "23 Mtn Div"];
  sectorList:string[]=['None','PSS','MSS','Cho_la','Doka_la'];
  aspectList:string[]=['None','Svl / Counter Svl','Friction / Belligerence','Ae Activity','Conc of Tps','Armr / Arty / AD / Engrs Indn','Mob','Infra Devp','Dumping of WLS','Heightened Diplomatic Eng','Collapse of Diplomatic Ties','Propoganda','Internal Issues','Cyber','Def','Interactions'];
  indicatorList:string[]=['None','Placement of addl Svl Eqpt','Incr Recce','Incr in OP loc','Jamming','Enhanced Tourist Influx']
  staffList = ['Staff1','Staff2','Staff3']
  notesList = ['None','temp1','temp2','temp3']
  selected11: string = 'Monthly';
  selectedType11 = 'Daily';
  filterNew :{Sector?: string, Aspects?: string, Indicator?: string,startDate?: Date, endDate?: Date} ={};
  selectedNew = 'any';
  constructor(private apiService:ApiService){

  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Dataset 1',
        fill: true,
        tension: 0.5,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Dataset 2',
        fill: true,
        tension: 0.5,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255,99,132,0.2)',
      },
    ],
  };

  // Line Chart Options
  public lineChartOptions: ChartOptions<'line'> = {
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

  // Chart Type
  public lineChartType: ChartType = 'line';
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
