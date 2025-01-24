import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { menupermission, menus, roles, UserRolePermission } from 'projects/sharedlibrary/src/model/permission.model';
import { Role, Roles } from 'projects/sharedlibrary/src/model/role.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'lib-role-permission',
  imports: [SharedLibraryModule,ReactiveFormsModule,CommonModule],
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css'
})
export class RolePermissionComponent {
  role:roles;
  rolelist!: roles[];
  menulist!: menus[];
  accessarray!: FormArray<any>;
  useraccess!: menupermission
  _response:any;

  constructor(@Inject(MAT_DIALOG_DATA) data,private dialogRef:MatDialogRef<RolePermissionComponent>, private builder: FormBuilder, private toastr: ToastrService, private apiServie: ApiService) {  
    this.role = data;
    this.loadmenus(data.code);
  }
  ngOnInit(): void {
    this.loadroles();
    this.loadmenus('');
  }
  closeDialog(){
    this.dialogRef.close(true)
  }
  roleform = this.builder.group({
    userrole: this.builder.control('', Validators.required),
    access: this.builder.array([])
  })

  Generatemenurow(input: menus,_access: menupermission,role:string) {
    return this.builder.group({
      menucode: this.builder.control(input.code),
      haveview: this.builder.control(_access.haveview),
      haveadd: this.builder.control(_access.haveadd),
      haveedit: this.builder.control(_access.haveedit),
      havedelete: this.builder.control(_access.havedelete),
      userrole:this.builder.control(role)
    })
  }

  Addnewrow(input: menus, _access: menupermission,role:string) {
    this.accessarray.push(this.Generatemenurow(input,_access,role))
  }

  get getrows() {
    return this.roleform.get('access') as FormArray;
  }

  loadroles() {
    this.apiServie.getWithHeaders('UserRole/GetAllRoles').subscribe(item => {
      this.rolelist = item;
    })
  }

  loadmenus(userrole: string) {
    this.accessarray = this.roleform.get('access') as FormArray;
    this.accessarray.clear();
    this.apiServie.getWithHeaders('UserRole/GetAllMenus').subscribe(item => {
      this.menulist = item;
      if (this.menulist.length > 0) {

        this.menulist.map((o: menus) => {

          if (userrole != '') {
            this.apiServie.getWithHeaders('UserRole/GetMenupermissionbyrole?userrole='+userrole+'&menucode=' + o.code).subscribe(item => {
              this.useraccess = item;
              this.Addnewrow(o, this.useraccess,userrole);
            })
          } else {
            this.Addnewrow(o, {
              code: '',
              name: '',
              haveview: false,
              haveadd: false,
              haveedit: false,
              havedelete: false,
              userrole: '',
              menucode: ''
            },'');
          }



        })
      }
    })
  }

  rolechange(event: any) {
    let selectedrole = event;
    this.loadmenus(selectedrole)

  }

  Saveroles() {

    if(this.roleform.valid){
      let formarry=this.roleform.value.access as menupermission[]
      this.apiServie.postWithHeader('UserRole/assignrolepermission',formarry).subscribe(item=>{
        this._response=item;
        if (this._response.result == 'pass') {
          this.toastr.success('Permission assigned successfully', 'Saved');
        } else {
          this.toastr.error('Failed due to : ' + this._response.message, 'Menu access assignment')
        }
      })
    }

  }
}