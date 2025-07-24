import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Aspect, Indicator } from 'projects/sharedlibrary/src/model/attribute.model';
import { FilterModel, PredictionModel } from 'projects/sharedlibrary/src/model/dashboard.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { ChartConfiguration } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { AnalysisChartComponent } from '../analysis-chart/analysis-chart.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';

@Component({
  selector: 'app-analysis-form',
  imports: [SharedLibraryModule, PlotlyModule],
  templateUrl: './analysis-form.component.html',
  styleUrl: './analysis-form.component.scss'
})
export class AnalysisFormComponent {
  currentDate = new Date();
  frmnList: any[] = [];
  sectorList: any = [];
  aspectList: Aspect[] = [];
  indicators: Indicator[] = [];
  filterModel: PredictionModel = new PredictionModel();
  urlPath;

  plotlyData: any[]=[];
  plotlyLayout: any;
  plotlyConfig: any;
  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([])
  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();
  constructor(private spinnerService: NgxSpinnerService, private masterDataService: MasterDataFilterService, private apiService: ApiService, private authService: AuthService, private toastr: ToastrService, private route: ActivatedRoute, private dailog: BISMatDialogService) {
    this.route.queryParams.subscribe(params => {
      const path = params['path'];

      if (path) {
        this.filterModel.urlPath = path;
      }
    });

  }
  ngOnInit(): void {
    this.getFrmDetails();
    this.getSector();
    this.getAspect();




  }
  onPointClick(event: any) {
    const point = event.points[0];
    const traceName = point.data.name;
    if (traceName === 'Anomalies') {
      this.dailog.confirmDialog("show these anomalies").subscribe(res => {
        if (res) {
          const date = point.x;
          const value = point.y;
          this.handleAnomalyClick(date, value);
        }
      })
    }
  }

  handleAnomalyClick(date, value: number) {
    var anomali = {
      startdate: date,
      endDate: date,
      corpsId: this.filterModel.frmn[0].corpsId,
      divisionId: this.filterModel.frmn[0].divisionId
    }
    this.apiService.postWithHeader("masterdata/anamolies", anomali).subscribe(res => {
      if (res) {
        const { Header, DataList } = this.masterDataService.getMasterData(res);
        this.tableHeaderSubject.next(Header);
        this.masterDataListSubject.next(DataList);
      }
    })
  }
  save() {
    if (this.filterModel.startdate <= this.filterModel.enddate) {
      this.plotlyData = [];
      this.tableHeaderSubject.next(null);
      this.masterDataListSubject.next(null);
      this.spinnerService.show(undefined, {type: 'square-jelly-box',bdColor: 'rgba(0,0,0,0.8)',color: '#fff',size: 'medium'});
      const model = JSON.parse(JSON.stringify(this.filterModel))
      model.frmn = [];
      model.frmn.push(this.filterModel.frmn[0].name)
      this.apiService.postWithHeader('user/anomalies', model).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          const labels: string[] = [];
          const observedValues: number[] = [];
          const anomalyX: string[] = [];
          const anomalyY: number[] = [];

          res.forEach(item => {
            const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            labels.push(formattedDate);
            observedValues.push(item.observed);

            if (item.isAnomaly) {
              anomalyX.push(formattedDate);
              anomalyY.push(item.observed);
            }
          });

          // Line Plot for All Observed Data
          const trace1 = {
            x: labels,
            y: observedValues,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Observed',
            line: { color: 'blue' },
            marker: {
              size: 6,
              symbol: 'circle'
            },
            hoverinfo: 'x+y'
          };

          // Red dots for anomalies only
          const trace2 = {
            x: anomalyX,
            y: anomalyY,
            type: 'scatter',
            mode: 'markers',
            name: 'Anomalies',
            marker: {
              color: 'red',
              size: 10,
              symbol: 'circle'
            },
            hovertemplate: '%{x}<br>Value: %{y}<br><b>Anomaly</b><extra></extra>'
          };

          this.plotlyData = [trace1, trace2];
          this.plotlyLayout = {
            title: {
              text: res[0].title,
              x: 0.5,                 // Center the title
              xanchor: 'center',      // Anchor it from the center
              yanchor: 'top',
              font: {
                size: 18,              // (Optional) Title font size
                family: 'Arial, sans-serif',
                color: '#000',
                weight: 'bold'
              }
            },
            xaxis: {
              title: 'Date',
              tickangle: -60,
              tickfont: {
                size: 10
              },
              automargin: true
            },
            yaxis: {
              title: 'Observed Value',
              automargin: true
            },
            legend: {
              orientation: 'h',
              x: 0,
              y: 1.25,  // move legend above chart
              xanchor: 'left',
              yanchor: 'bottom'
            },
            margin: {
              t: 100,   // more top margin for legend
              l: 60,
              r: 30,
              b: 100   // more bottom margin for rotated ticks
            },
            height: 430,
            hovermode: 'closest'
          };

          this.plotlyConfig = {
            responsive: true
          };
        }
      });
    } else {
      this.toastr.error("EndDate must be greater than StartDate", "Error");
    }
  }

  // save() {
  //   this.dailog.open(AnalysisChartComponent,this.filterModel).then(res =>{
  //     if(res){

  //     }
  //   })

  // }

  setPath() {
    if (this.filterModel.isFuturePrediction) {
      this.filterModel.startdate = this.currentDate;
      this.filterModel.enddate = null;
      if (this.urlPath === 'detect-arima-anomalies/') {
        this.urlPath = 'detect-arima-future-prediction/'
      } else if (this.urlPath === 'detect-prophet-anomalies/') {
        this.urlPath = 'detect-prophet-anomalies-future/'
      } else if (this.urlPath === 'detect-lstm-anomalies/') {
        this.urlPath = 'forecast-lstm-future/'
      } else {
        this.urlPath = 'detect-isolation-anomalies-single-future/'
      }
    } else {
      this.filterModel.startdate = null;
      this.filterModel.enddate = null;
      if (this.urlPath === 'detect-arima-future-prediction/') {
        this.urlPath = 'detect-arima-anomalies/'
      } else if (this.urlPath === 'detect-prophet-anomalies-future/') {
        this.urlPath = 'detect-prophet-anomalies/'
      } else if (this.urlPath === 'forecast-lstm-future/') {
        this.urlPath = 'detect-lstm-anomalies/'
      } else {
        this.urlPath = 'detect-isolation-anomalies-single/'
      }
    }
  }




  getFrmDetails() {
    this.apiService.getWithHeaders('dashboard/FmnDetails').subscribe(res => {
      if (res) {
        debugger
        this.frmnList = res;
        // var divisionId = parseInt(this.authService.getDivisionId());
        // var corpsId = parseInt(this.authService.getCorpsId());
        // var frm = this.frmnList.find(item => item.corpsId === corpsId && item.divisionId === divisionId).name;
        // this.filterModel.frmn = frm
        // if (frm) {
        //   if (!this.filterModel.frmn) {
        //     this.filterModel.frmn = [];
        //   }
        //   this.filterModel.frmn.push({ ...frm });
        // }
      }
    })
  }
  getSector() {
    this.apiService.getWithHeaders('MasterData/sector').subscribe(res => {
      if (res) {
        this.sectorList = res;
      }
    })
  }
  getAspect() {
    this.apiService.getWithHeaders('attribute/allaspect').subscribe(res => {
      if (res) {
        this.aspectList = res;
      }
    })
  }
  getIndicator(event) {
    let apsectId = this.aspectList.find(item => item.name == event)?.id;
    this.apiService.getWithHeaders('attribute/indicator/' + apsectId).subscribe(res => {
      if (res) {
        this.indicators = res;
      }
    })
  }
  close() {

  }


  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Observed',
        fill: false,
        tension: 0.3,
        borderColor: 'blue',
        backgroundColor: 'blue',
        pointBackgroundColor: 'blue',
        pointBorderColor: 'white',
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false, // <-- Important
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        enabled: true
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Observed'
        }
      }
    }
  };


}
