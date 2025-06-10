import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aspect, Indicator } from 'projects/sharedlibrary/src/model/attribute.model';
import { FilterModel } from 'projects/sharedlibrary/src/model/dashboard.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-analysis-form',
  imports: [SharedLibraryModule],
  templateUrl: './analysis-form.component.html',
  styleUrl: './analysis-form.component.scss'
})
export class AnalysisFormComponent {
 currentDate = new Date();
analysisForm: FormGroup;
 frmnList:any[]=[];
 sectorList: any = [];
  aspectList: Aspect[] = [];
   indicators: Indicator[] = [];
  filterModel: FilterModel = new FilterModel();
 constructor( private _formBuilder: FormBuilder,private apiService:ApiService,private authService:AuthService){

 }
ngOnInit(): void {
    this.createForm();
    this.getFrmDetails();
    this.getSector();
    this.getAspect();
}
  createForm() {
     this.analysisForm = this._formBuilder.group({
       startDate: [this.currentDate, Validators.required],
       endDate: [this.currentDate, Validators.required],
       frmn: ['',Validators.required],
       sector: ['', Validators.required],
       aspect: ['',Validators.required],
       indicator: ['',Validators.required],
     });
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
          }
          this.filterModel.frmn.push({ ...frm });
        }
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
  close(){
    
  }
}
