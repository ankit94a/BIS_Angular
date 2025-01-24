import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'projects/sharedlibrary/src/model/dashboard.model';
import { GenerateReport, GraphImages } from 'projects/sharedlibrary/src/model/generatereport.model';
import { BisdefaultDatePipe } from 'projects/sharedlibrary/src/pipe/bisdefault-date.pipe';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-generate-reports-add',
  imports: [SharedLibraryModule],
  templateUrl: './generate-reports-add.component.html',
  styleUrl: './generate-reports-add.component.scss',
  providers: [BisdefaultDatePipe]
})
export class GenerateReportsAddComponent implements OnInit {
  selectedImages: GraphImages[] = []; // Array to store selected images
  reportForm: FormGroup;
  report: GenerateReport;
  currentDate = new Date()
  masterDataList = [];
  isNoDataFoundAlert: boolean = false;
  tableHeader = [];
  isAllChecked = false;
  filterModel: FilterModel = new FilterModel();
  constructor(@Inject(MAT_DIALOG_DATA) data, private apiService: ApiService, private toastr: ToastrService, private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<GenerateReportsAddComponent>) {
    // if(data.id > 0){
    //   this.report = data;
    //   this.getReportById(data.masterDataIds);
    // }else{
    this.createForm()
    // }
  }
  ngOnInit(): void {

  }
  getReportById(masterDataIds) {
    this.apiService.getWithHeaders('masterdata/idsList' + masterDataIds).subscribe(res => {
      if (res) {
        debugger
        this.report.masterData = res;
      }
    })
  }
  // Create the form
  createForm() {
    this.reportForm = this._formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reportType: [''],
      reportDate: [this.currentDate, Validators.required],
      reportTitle: [''],
      userId: [''],
      notes: [''],
      masterData: this._formBuilder.array([]) // Initialize as empty FormArray
    });
  }
  get masterData(): FormArray {
    return this.reportForm.get('masterData') as FormArray;
  }

  // Populate FormArray with checkboxes (based on the masterDataList)
  setMasterData() {
    this.masterDataList.forEach(item => {
      this.masterData.push(this._formBuilder.control(item.selected)); // Initialize with selected state
    });
  }

  // Handle individual row checkbox change event
  onRowCheckboxChange(item: any, i: number) {
    debugger
    const control = this.masterData.controls[i]; // Get the control corresponding to the current row
    control.setValue(item.selected); // Update the control with the current selected state
  }

  // Handle the master checkbox toggle (select all/deselect all)
  toggleAllCheckboxes() {
    if (this.isAllChecked) {
      this.masterDataList.forEach((item, i) => {
        item.selected = true;
        this.masterData.controls[i].setValue(true); // Set the corresponding form control value
      });
    } else {
      this.masterDataList.forEach((item, i) => {
        item.selected = false;
        this.masterData.controls[i].setValue(false); // Set the corresponding form control value
      });
    }
  }
  onDateChange(startDate, endDate) {
    const start = startDate.value;
    const end = endDate.value;
    if (start <= end) {
      this.filterModel.startDate = start;
      this.filterModel.endDate = end;
      this.apiService.postWithHeader('masterdata/dateRange', this.filterModel).subscribe(res => {
        if (res) {
          this.masterDataList = res;
          let uniqueHeader = new Set();
          this.masterDataList.forEach(item => {
            const keys = Object.keys(item);
            keys.forEach(key => {
              if (item[key] != null && item[key] !== "") {
                uniqueHeader.add(key);
              }
            });
          });
          this.tableHeader = [...uniqueHeader];
          this.masterDataList = this.masterDataList.map(item => {
            let reorderedItem = {};
            this.tableHeader.forEach(key => {
              if (item[key] != null && item[key] !== "") {
                reorderedItem[key] = item[key];
              }
            });
            this.isNoDataFoundAlert = false;
            return reorderedItem;
          });
        } else {
          this.isNoDataFoundAlert = true;
        }
      })
    } else {
      this.toastr.error("startdate must be smaller than enddate");
    }
    // You can perform additional logic here, like updating other form values, making API calls, etc.
  }
  save() {
    var selected = this.masterDataList.filter(item => item.selected)
    var idsString = JSON.stringify(selected.map(item => item.id));
    this.selectedImages.map(item =>{
      item.url = item.url.split(',')[1];
    })
    this.report = new GenerateReport();
    this.report.reportType = this.reportForm.value.reportType,
    this.report.notes = this.reportForm.value.notes,
    this.report.reportDate = this.reportForm.value.reportDate,
    this.report.reportTitle = this.reportForm.value.reportTitle,
    this.report.startDate = this.reportForm.value.startDate,
    this.report.endDate = this.reportForm.value.endDate,
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
  }
  closedialog() {
    this.dialogRef.close(true);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      Array.from(input.files).forEach((file) => {
        if (file.type.startsWith('image/')) {  // Ensure it's an image
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

}
