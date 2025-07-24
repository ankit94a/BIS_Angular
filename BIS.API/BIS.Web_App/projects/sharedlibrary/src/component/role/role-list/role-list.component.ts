import { Component, OnInit } from '@angular/core';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { RolePermissionComponent } from '../role-permission/role-permission.component';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { RoleAddComponent } from '../role-add/role-add.component';
import { roles } from 'projects/sharedlibrary/src/model/permission.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'lib-role-list',
  imports: [SharedLibraryModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit{
  roleList: roles[];
  constructor(private apiService:ApiService,private dialogService:BISMatDialogService,private toastr:ToastrService){

  }
  ngOnInit(): void {
    this.getAllRoles()
  }
  permision(role){
    role.isView = false;
    this.dialogService.open(RolePermissionComponent, role);
  }
  edit(role) {
    let cloneRole = Object.assign({}, role);
    cloneRole.isView = false;
    this.add(cloneRole);
  }

  view(role){
    role.isView = true;
    this.add(role);
  }
  add(role:roles = new roles()){
    this.dialogService.open(RoleAddComponent,role,'45vw').then(res =>{
      if(res){
        this.getAllRoles()
      }
    })
  }
  remove(item){
    this.dialogService.confirmDialog("remove " + item.roleName).subscribe(res => {
      if(res){
        this.apiService.getWithHeaders(`masterdata/deactivate/${item.id}/roles `).subscribe(res =>{
          if(res){
            this.toastr.success("delete successfully",'success');
            this.getAllRoles();
          }
        })
      }
    })
  }
  getAllRoles(){
    this.apiService.getWithHeaders('role/all').subscribe(res =>{
      if(res){
        this.roleList = res;
      }
    })
  }

}
