import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'projects/sharedlibrary/src/model/user.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';


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
