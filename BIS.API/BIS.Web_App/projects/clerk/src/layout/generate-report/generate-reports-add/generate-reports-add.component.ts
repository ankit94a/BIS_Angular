import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'projects/sharedlibrary/src/model/dashboard.model';
import { GenerateReport, GraphImages } from 'projects/sharedlibrary/src/model/generatereport.model';
import { masterData } from 'projects/sharedlibrary/src/model/masterdata.model';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { MasterDataFilterService } from 'projects/sharedlibrary/src/services/master-data-filter.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-generate-reports-add',
  imports: [SharedLibraryModule],
  templateUrl: './generate-reports-add.component.html',
  styleUrl: './generate-reports-add.component.scss',
  providers: [BisdefaultDatePipe]
})
export class GenerateReportsAddComponent implements OnInit {
  selectedImages: GraphImages[] = [];
  reportForm: FormGroup;
  report: GenerateReport;
  currentDate = new Date();
  tableHeader = [];
  masterDataList = [];
  isNoDataFoundAlert: boolean = false;
  isAllChecked = false;
  filterModel: FilterModel = new FilterModel();
  reportType = ['ISUM','DISUM','SITREP']
  constructor(@Inject(MAT_DIALOG_DATA) data,private masterDataService: MasterDataFilterService, private apiService: ApiService, private toastr: ToastrService, private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<GenerateReportsAddComponent>) {
    // if(data.id > 0){
    //   this.report = data;
    //   this.getReportById(data.masterDataIds);
    // }else{

    // }
  }
  ngOnInit(): void {
    this.createForm()
    this.onDateChange(this.reportForm.get('startDate').value, this.reportForm.get('endDate').value);
  }
  // getReportById(masterDataIds) {
  //   this.apiService.getWithHeaders('masterdata/idsList' + masterDataIds).subscribe(res => {
  //     if (res) {
  //       this.report.masterData = res;
  //     }
  //   })
  // }

  createForm() {
    this.reportForm = this._formBuilder.group({
      startDate: [this.currentDate, Validators.required],
      endDate: [this.currentDate, Validators.required],
      reportType: [''],
      reportDate: [this.currentDate, Validators.required],
      reportTitle: ['',Validators.required],
      notes: [''],
      masterData: this._formBuilder.array([])
    });
  }

  get masterData(): FormArray {
    return this.reportForm.get('masterData') as FormArray;
  }

  setMasterData() {
    this.masterDataList.forEach(item => {
      this.masterData.push(this._formBuilder.control(item.selected));
    });
  }

  onRowCheckboxChange(item: any, i: number) {
    const control = this.masterData.controls[i];
    control.setValue(item.selected);
  }

  toggleAllCheckboxes() {
    if (this.isAllChecked) {
      this.masterDataList.forEach((item, i) => {
        item.selected = true;
        this.masterData.controls[i].setValue(true);
      });
    } else {
      this.masterDataList.forEach((item, i) => {
        item.selected = false;
        this.masterData.controls[i].setValue(false);
      });
    }
  }

  onDateChange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start <= end) {
      this.filterModel.startDate = startDate;
      this.filterModel.endDate = endDate;
      this.apiService.postWithHeader('masterdata/dateRange', this.filterModel).subscribe(res => {
        if (res.length > 0) {
          this.masterDataList = res;
          const { Header, DataList } = this.masterDataService.getMasterData(res);
          this.tableHeader = Header;
          this.masterDataList = DataList;
          this.isNoDataFoundAlert = false;
        } else {
          this.masterDataList = [];
          this.isNoDataFoundAlert = true;
          this.toastr.warning("No input found for these date range",'warning')
        }
      })
    }
  }
  save() {
    if (this.reportForm.invalid) {
      this.toastr.error('Please fill all required fields', 'Error');
      return;
    }
    var selected = this.masterDataList.filter(item => item.selected)
    var idsString = JSON.stringify(selected.map(item => item.Id));
    this.report = new GenerateReport();
    this.report = this.reportForm.value;
    this.report.masterDataIds = idsString;
    this.report.graphs = this.selectedImages;
    this.apiService.postWithHeader('GenerateReport', this.report).subscribe(res => {
      if (res) {
        this.toastr.success("Report Created Successfully", 'Success');
        this.dialogRef.close(true);
      }
    })
  }

  resetObj() {
    this.createForm();
    this.masterDataList = [];
    this.selectedImages = [];
  }

  closedialog() {
    this.dialogRef.close(true);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      Array.from(input.files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              this.selectedImages.push({
                url: e.target.result.toString(),
                name: file.name,
              });
            }
          };
          reader.readAsDataURL(file);
        } else {
          this.toastr.error('Only image files are allowed', 'Error');
        }
      });
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

}
