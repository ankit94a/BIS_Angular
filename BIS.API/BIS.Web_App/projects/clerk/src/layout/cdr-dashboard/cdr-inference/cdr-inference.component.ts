import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Component, Inject, inject } from '@angular/core';
import { ApprovedReports, GenerateReport, GraphImages } from 'projects/sharedlibrary/src/model/generatereport.model';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';

@Component({
  selector: 'app-cdr-inference',
  imports: [SharedLibraryModule],
  templateUrl: './cdr-inference.component.html',
  styleUrl: './cdr-inference.component.scss'
})
export class CdrInferenceComponent {
  report:GenerateReport = new GenerateReport();
  selectedImages: GraphImages[] = [];
  cdrInference:ApprovedReports = new ApprovedReports();

  constructor(@Inject(MAT_DIALOG_DATA) data,private toastr:ToastrService,private apiService:ApiService,private dialog:MatDialog){
    this.report = data;
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
  submit(){
    this.cdrInference.generateReportId = this.report.id;
    this.cdrInference.graphs = this.selectedImages;
    this.apiService.postWithHeader('cdrdashboard/inference',this.cdrInference).subscribe(res =>{
      if(res){
        this.toastr.success("Inference added successfully",'success');
        this.close();
      }else{
        this.toastr.error("A technical issue has occurred. Please try again later.", 'Error');
      }
    })
  }

  close(){
    this.dialog.closeAll();
  }
}
