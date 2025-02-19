import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
// import { EduSynkToastrTranslateService } from 'projects/sharedLibrary/src/services/edusynk.toastr-translate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { InfoMessage } from 'projects/sharedLibrary/src/Constants';
// import { UploadModel } from 'projects/sharedLibrary/src/model/download.model';
// import { OnessysCoreApiService, AuthService, FileUploadService } from 'projects/sharedLibrary/src/services';
// import { Attachment } from '../../model/assignment.model';
import { SharedLibraryModule } from '../../shared-library.module';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  standalone:true,
  imports:[SharedLibraryModule]
})
export class FileUploadComponent implements OnInit {
  size = 0;
  selsize = 0;
  filesList: [];
  // uploadModel: UploadModel;
  // fileUrl:Attachment;

  constructor(public dialogRef: MatDialogRef<FileUploadComponent>, private router: Router,private detectorRef: ChangeDetectorRef) {
    // this.uploadModel = data;
  }

  ngOnInit() {
  }

  async fileUpload(event: any) {
    const files = event.target.files;
    const obj = event.target as HTMLInputElement;
    if (!obj || obj == null || !obj.files) {
      return('Invalid input element.');   
    }
    for (let i = 0; i < files.length; i++) {
      let file = obj.files[i];
      // let fileUrl = await this.uploadService.fileUploadEncryted(file,true)
      // this.uploadModel.fileUrl.push(fileUrl)
    }
  }

  save() {
    // this.ApiService.postWithHeader("upload", this.uploadModel).toPromise().then(res => {  
    //   if (res != null) {
    //     this.toaster.info(res, "Success");
    //     this.dialogRef.close(true);
    //   }
    //   else
    //   {
    //     this.toaster.error(InfoMessage.ExcelError, "Error");
    //   }
    // });
    // this.dialogRef.close(false);
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  getFileDetails(e: any) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.size += e.target.files[i].size;
      if (this.size <= 5000000) {
        this.selsize = this.size;
        this.filesList = e.target.files;
        this.fileUpload(e)
      }
      else {
        // this.toaster.error("This file exceeds the permissible limit.", "Error");
        this.size = this.selsize;
      }
    }
  }
}

