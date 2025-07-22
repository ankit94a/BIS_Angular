import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlotlyModule } from 'angular-plotly.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'projects/sharedlibrary/src/component/confirm-dialog/confirm-dialog.component';
import { FilterModel, FmnModel, PredictionModel } from 'projects/sharedlibrary/src/model/dashboard.model';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-analysis-chart',
  imports: [SharedLibraryModule, PlotlyModule],
  templateUrl: './analysis-chart.component.html',
  styleUrl: './analysis-chart.component.scss'
})
export class AnalysisChartComponent {
  model: PredictionModel = new PredictionModel();
  plotlyData: any;
  plotlyLayout: any;
  plotlyConfig: any;
  title: string;
  filterModel:FilterModel = new FilterModel();
  masterDatas:masterData [] = [];
  frmn:FmnModel = new FmnModel();
  
  private tableHeaderSubject = new BehaviorSubject<string[]>([]);
  private masterDataListSubject = new BehaviorSubject<masterData[]>([])
  tableHeader$ = this.tableHeaderSubject.asObservable();
  masterDataList$ = this.masterDataListSubject.asObservable();
  constructor(private dailog: BISMatDialogService, @Inject(MAT_DIALOG_DATA) data,private masterDataService: MasterDataFilterService, private apiService: ApiService, private toastr: ToastrService, private spinnerService: NgxSpinnerService) {
    this.frmn = data.frmn[0];
    this.model = JSON.parse(JSON.stringify(data))
    this.model.frmn = [];
    this.model.frmn.push(data.frmn[0].name)
  }

  ngOnInit() {
    this.plotlyConfig = {
      responsive: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'anomaly_chart',
        height: 500,
        width: 900,
        scale: 2
      },
      modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d'],
    };
    this.plotlyLayout = {
      title: 'Anomaly Detection - ARIMA',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Observed Value' },
      legend: {
        orientation: 'h',
        x: 0.01,
        y: 1.2
      },
      margin: { t: 40, l: 50, r: 30, b: 80 },
      height: 430,
      hovermode: 'closest'
    };
    this.getData();
  }
  getData() {
    this.spinnerService.show(undefined, {
      type: 'square-jelly-box',
      bdColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      size: 'default'
    });
    if (this.model.startdate <= this.model.enddate) {
      this.apiService.modelApiCall(`${this.model.urlPath}`, this.model).subscribe(res => {
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

  onPointClick(event: any) {
    const point = event.points[0];
    const traceName = point.data.name;
    if (traceName === 'Anomalies') {
      this.dailog.confirmDialog("Are you want to show these anomalies").subscribe(res => {
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
      startdate:date,
      endDate:date,
      corpsId:this.frmn.corpsId,
      divisionId:this.frmn.divisionId
    }
    this.apiService.postWithHeader("masterdata/anamolies",anomali).subscribe( res =>{
      if(res){
        const { Header, DataList } = this.masterDataService.getMasterData(res);
        this.tableHeaderSubject.next(Header);
        this.masterDataListSubject.next(DataList);
      }
    })
  }

}
