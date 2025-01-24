import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { role, roles } from 'projects/sharedlibrary/src/model/permission.model';
import { Role, Roles } from 'projects/sharedlibrary/src/model/role.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'lib-role-add',
  imports: [SharedLibraryModule],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css'
})
export class RoleAddComponent {
  role!:role
  corps = [];
  divison = [];
  constructor(@Inject(MAT_DIALOG_DATA) data,private apiService:ApiService,private dialogRef:MatDialogRef<RoleAddComponent>,private toastr:ToastrService){
   
     if(data != null && data != undefined){
      this.role = data;
     }else{
      this.role = new role()
      
     }
     this.getAllCorps();
  }
  getAllCorps(){
    this.apiService.getWithHeaders('corps').subscribe(res => {
      if(res){
        this.corps = res;
      }
    })
  }
  getAllDivision(corpsId){
    this.apiService.getWithHeaders('corsp/divison'+corpsId).subscribe(res =>{
      if(res){
        this.divison = res;
      }
    })
  }
  onSubmit(){

  }
  closeDialog(){
    this.dialogRef.close(true)
  }
}
