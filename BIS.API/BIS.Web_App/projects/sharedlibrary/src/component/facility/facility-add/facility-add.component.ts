import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Facility } from 'projects/sharedlibrary/src/model/facility.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'lib-facility-add',
  imports: [SharedLibraryModule],
  templateUrl: './facility-add.component.html',
  styleUrl: './facility-add.component.css'
})
export class FacilityAddComponent {
  facility:Facility;
  constructor(@Inject(MAT_DIALOG_DATA) data, private apiService:ApiService,private toastr:ToastrService,private dialogRef:MatDialogRef<FacilityAddComponent>){
    this.facility = data == '' ? new Facility() : data;

  }

  preview(files,$event){

  }
  close(){
    this.dialogRef.close(true);
  }
  onSubmit() {
    this.facility.logoUrl="abbbbbbbbbbbbbbbbccccccccccccccccccc"
    if (this.facility.id > 0) {
      this.apiService.putWithHeader('facility', this.facility)
        .subscribe((result) => {
          if (result) {

            this.toastr.success("facility updated successfully", "Success");
            this.close();
          }
          else {
            this.toastr.error("Some issue in updating facility", "Error")
          }
        })
    }
    else {
      this.apiService.postWithHeader('facility', this.facility)
        .subscribe((result) => {
          if (result) {

            this.toastr.success("facility added successfully", "Success");
            this.close();
          }
          else {
            this.toastr.error("Some issue in adding facility", "Error")
          }
        })
    }

  }
  reset() {
    this.facility = new Facility();

  }
}
