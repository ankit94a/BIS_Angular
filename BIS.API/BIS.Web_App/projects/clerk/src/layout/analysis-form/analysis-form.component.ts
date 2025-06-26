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
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-analysis-form',
  imports: [SharedLibraryModule,BaseChartDirective],
  templateUrl: './analysis-form.component.html',
  styleUrl: './analysis-form.component.scss'
})
export class AnalysisFormComponent {
  currentDate = new Date();
  analysisForm: FormGroup;
  frmnList: any[] = [];
  sectorList: any = [];
  aspectList: Aspect[] = [];
  indicators: Indicator[] = [];
  filterModel: PredictionModel = new PredictionModel();
  modelType;
   lineChartLabels: string[] = [];
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
  constructor(@Inject(MAT_DIALOG_DATA) data, private apiService: ApiService, private authService: AuthService, private toastr: ToastrService) {
    this.modelType = data;
  }
  ngOnInit(): void {
    // this.createForm();
    this.getFrmDetails();
    this.getSector();
    this.getAspect();
  }
  // createForm() {
  //    this.analysisForm = this._formBuilder.group({
  //      startDate: [this.currentDate, Validators.required],
  //      endDate: [this.currentDate, Validators.required],
  //      frmn: ['',Validators.required],
  //      sector: ['', Validators.required],
  //      aspect: ['',Validators.required],
  //      indicator: ['',Validators.required],
  //    });
  //  }



  showGraphVisualization(model: any[]) {
    if (!model || model.length === 0) {
      this.lineChartData.datasets = [];
      this.lineChartData.labels = [];
      return;
    }

    const labels = model.map(entry => entry.Date);
    const observedData = model.map(entry => entry.Observed);
    const residualData = model.map(entry => parseFloat(entry.Residual.toFixed(2)));

    // Update chart data
    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Observed',
          data: observedData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          tension: 0.4,
          pointRadius: 4
        },
        {
          label: 'Residual',
          data: residualData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.4,
          pointRadius: 4
        }
      ]
    };

  }
  save() {
    if (this.filterModel.startdate <= this.filterModel.enddate) {
      this.apiService.modelApiCall(`${this.modelType.path}`, this.filterModel).subscribe(res => {
        if (res) {
          this.showGraphVisualization(res)
        }
      })
    } else {
      this.toastr.error("EndDate must be greater then StartDate", "error");
    }
  }

  getFrmDetails() {
    this.apiService.getWithHeaders('dashboard/FmnDetails').subscribe(res => {
      if (res) {
        this.frmnList = res;
        var divisionId = parseInt(this.authService.getDivisionId());
        var corpsId = parseInt(this.authService.getCorpsId());
        var frm = this.frmnList.find(item => item.corpsId === corpsId && item.divisionId === divisionId).name;
        this.filterModel.frmn = frm
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
}
