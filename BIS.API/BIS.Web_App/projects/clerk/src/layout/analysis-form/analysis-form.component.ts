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
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-analysis-form',
  imports: [SharedLibraryModule, BaseChartDirective],
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
  constructor(private apiService: ApiService, private authService: AuthService, private toastr: ToastrService, private route: ActivatedRoute,private datePipe:DatePipe) {
    this.route.queryParams.subscribe(params => {
      const path = params['path'];

      if (path) {
        this.urlPath = path;
        console.log('Path:', this.urlPath);
      }
    });

  }
  ngOnInit(): void {
    this.getFrmDetails();
    this.getSector();
    this.getAspect();
  }

 save() {
  if (this.filterModel.startdate <= this.filterModel.enddate) {
    this.apiService.modelApiCall(`${this.urlPath}`, this.filterModel).subscribe(res => {
      if (res) {
        const labels: string[] = res.map(item =>
          new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        );

        const observedValues: number[] = res.map(item => item.observed);

        this.lineChartData = {
          labels: labels,
          datasets: [
            {
              data: observedValues,
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
      }
    });
  } else {
    this.toastr.error("EndDate must be greater than StartDate", "Error");
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
