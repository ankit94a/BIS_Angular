import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'projects/sharedlibrary/src/model/user.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
// import { InSyncDialogActionModule } from 'projects/shared/src/lib/component/insync-dialog-action/insync-dialog-action.module';
// import { InSyncDialogTitleModule } from 'projects/shared/src/lib/component/insync-dialog-title/insync-dialog-title.module';
// import { InSyncApiService } from 'projects/shared/src/lib/insync-api.service';
// import { Role } from 'projects/shared/src/lib/model/role';
// import { User } from 'projects/shared/src/lib/model/user';
// import { UtilService } from 'projects/shared/src/lib/util.service';
// import { SharedModule } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-user-password',
  standalone:true,
  imports:[SharedLibraryModule],
  templateUrl: './user-password.component.html'
})
export class UserPasswordComponent implements OnInit {

  user:User;
  constructor(private dialogRef: MatDialogRef<UserPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService,
    private toastr: ToastrService) {
    this.user = data;

  }
  ngOnInit(): void {
  }
  close(result = false) {
    this.dialogRef.close(result);
  }

  onSubmit() {
    if (this.user.id > 0 && this.user.password!=undefined) {
      this.apiService.putWithHeader('user/password', this.user)
        .subscribe((result) => {
          if (result) {
            this.toastr.success("password updated successfully", "Success");
            this.close(true);
          }
          else {
            this.toastr.error("Some issue in updating user password", "Error")
          }
        })
    }
  }
  reset() {
    this.user = new User();
  }
}
