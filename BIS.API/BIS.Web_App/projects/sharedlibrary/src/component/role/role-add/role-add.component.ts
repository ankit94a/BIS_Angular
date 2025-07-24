import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { roles } from 'projects/sharedlibrary/src/model/permission.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'lib-role-add',
  imports: [SharedLibraryModule],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css'
})
export class RoleAddComponent {
  role:roles = new roles();
  corps = [];
  divison = [];
  constructor(@Inject(MAT_DIALOG_DATA) data,private apiService:ApiService,private dialogRef:MatDialogRef<RoleAddComponent>,private toastr:ToastrService){
     if(data != null && data != undefined && data != ""){
      this.role = data;
     }
  }

  onSubmit(){
    if(this.role?.id > 0){
      this.apiService.putWithHeader('role',this.role).subscribe(res => {
        if(res){
          this.toastr.success("Role updated successfully",'success');
          this.closeDialog();
        }
      })
    }else{
      this.apiService.postWithHeader('role',this.role).subscribe(res => {
        if(res){
          this.toastr.success("Role added successfully",'success');
          this.closeDialog();
        }
      })
    }

  }
  closeDialog(){
    this.dialogRef.close(true)
  }
}
