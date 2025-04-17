// import { InSyncDialogActionModule } from './../../../../../../shared/src/lib/component/insync-dialog-action/insync-dialog-action.module';
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Corps, Division } from "projects/sharedlibrary/src/model/base.model";
import { RoleType } from "projects/sharedlibrary/src/model/enum";
import { Facility } from "projects/sharedlibrary/src/model/facility.model";
import { roles } from "projects/sharedlibrary/src/model/permission.model";
import { Role } from "projects/sharedlibrary/src/model/role.model";
import { User } from "projects/sharedlibrary/src/model/user.model";
import { ApiService } from "projects/sharedlibrary/src/services/api.service";
import { UtilService } from "projects/sharedlibrary/src/services/util.service";
import { SharedLibraryModule } from "projects/sharedlibrary/src/shared-library.module";
// import { InSyncApiService } from "projects/shared/src/lib/insync-api.service";
// import { User } from "projects/shared/src/lib/model/user";
// import { Role } from "projects/shared/src/lib/model/role";
// import { UtilService } from "projects/shared/src/lib/util.service";
// import { SharedModule } from "projects/shared/src/public-api";
// import { InSyncDialogTitleModule } from 'projects/shared/src/lib/component/insync-dialog-title/insync-dialog-title.module';
// import { AddressModule } from 'projects/shared/src/lib/component/address/address.module';


@Component({
  selector: 'app-add-user',
  standalone:true,
  imports:[SharedLibraryModule],
  templateUrl: './user-add-edit.component.html'
})
export class UserAddEditComponent implements OnInit {
  user: User;
  roleList: roles[];
  facilityList:Facility[]=[];
  corps = ['HQ Eastern Comd','HQ 33 Corps','HQ 17 Corps','HQ 3 Corps','HQ 4 Corps']
  facilityType = ['Command','Corps','Division']
  divisionList:Division[]=[];
  corpsList :Corps [] = [];
  isDivisionUser:boolean=false;
  roleTypeList: { key: string, value: number }[] = [];
  constructor(private dialogRef: MatDialogRef<UserAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService,
    private toastr: ToastrService) {
    this.user = data;
    this.roleTypeList = Object.keys(RoleType)
    .filter(key => isNaN(Number(key))) // filter out numeric keys
    .map(key => ({ key: key, value: RoleType[key] }));
  }

  ngOnInit(): void {
    // this.getAllRoles();
    // this.getAllFacilities()
  }
  getCorps(){
    this.apiService.getWithHeaders('corps').subscribe(res =>{
      if(res){
        this.corpsList = res;
      }
    })
  }
  getDivision(corpsId){
    debugger
    this.apiService.getWithHeaders('corps/frmlist/'+corpsId).subscribe(res =>{
      if(res){
        this.divisionList = res;
      }
    })
  }
  getAllFacilities(){
    this.apiService.getWithHeaders('facility').subscribe(res =>{
      if(res){
        this.facilityList = res;
      }
    })
  }
  getDynamicDropDown(type){
    debugger
    if(type == 'Command'){

    }else if(type == 'Corps'){
      this.getCorps();
    }else{
      this.getCorps();
      this.isDivisionUser = true;
    }
  }
  onSubmit() {
console.log(this.user)
  //   if (this.user.id > 0) {
  //     this.apisService.putWithHeader('user', this.user)
  //       .subscribe((result) => {
  //         if (result) {
  //           this.toastr.success("user updated successfully", "Success");
  //           this.close(true);
  //         }
  //         else {
  //           this.toastr.error("Some issue in updating supplier", "Error")
  //         }
  //       })
  //   }
  //   else {
  //     if (this.user.roleId > 0) {
  //       this.apisService.postWithHeader('user', this.user)
  //         .subscribe((result) => {
  //           if (result) {
  //             this.toastr.success("User added successfully", "Success");
  //             this.close(true);
  //           }
  //           else {
  //             this.toastr.error("Some issue in adding user", "Error")
  //           }
  //         })
  //     } else {
  //       this.toastr.error("User cannot be add without role", "Error");
  //     }
  //   }

  }
  // reset() {

  //   this.user = new User();
  //   this.util.resetAddress(this.user);

  // }
  getAllRoles(){
    this.apiService.getWithHeaders('UserRole/GetAllRoles').subscribe(res =>{
      if(res){
        this.roleList = res;
        console.log(this.roleList)
      }
    })
  }
  closeDialog(){
    this.dialogRef.close(true)
  }
}
