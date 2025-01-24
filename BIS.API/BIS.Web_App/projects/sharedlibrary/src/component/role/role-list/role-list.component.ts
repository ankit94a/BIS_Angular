import { Component, OnInit } from '@angular/core';
import { Role } from 'projects/sharedlibrary/src/model/role.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { RolePermissionComponent } from '../role-permission/role-permission.component';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { RoleAddComponent } from '../role-add/role-add.component';
import { roles } from 'projects/sharedlibrary/src/model/permission.model';

@Component({
  selector: 'lib-role-list',
  imports: [SharedLibraryModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit{
  roleList: roles[];
  constructor(private apiService:ApiService,private dialogService:BISMatDialogService){

  }
  ngOnInit(): void {
    this.getAllRoles()
  }
  permision(role){
    role.isView = false;
    this.dialogService.open(RolePermissionComponent, role);
  }
  edit(role){
    role.isView = false;
    this.add(role);
  }
  view(role){
    role.isView = true;
    this.add(role);
  }
  add(role=''){
    this.dialogService.open(RoleAddComponent,role).then(res =>{
      if(res){
        this.getAllRoles()
      }
    })
  }
  getAllRoles(){
    this.apiService.getWithHeaders('UserRole/GetAllRoles').subscribe(res =>{
      if(res){
        this.roleList = res;
      }
    })
  }

}
