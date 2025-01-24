import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';
import { UserPasswordComponent } from '../user-password/user-password.component';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { User } from 'projects/sharedlibrary/src/model/user.model';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './user-list.component.html',
  standalone:true,
  imports:[ SharedLibraryModule
   ],
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userList: User[];
  constructor(private dialogService:BISMatDialogService,private apiService:ApiService ){

  }
 ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.apiService.getWithHeaders('User/GetAll')
      .subscribe(Response => {
        if (Response) {
          this.userList = Response as User[];

        }
      });
  }
  open(user) {
    user.labelTitle = "User";
    this.dialogService.open(UserAddEditComponent, user).then(result => {
      if (result) {
        // this.fetchUser();
      }
    });
  }
  add() {
    let user = new User();
    this.open(user);
  }

  // view(user: User) {
  //   user.isView = true;
  //   this.open(Object.assign({}, user));
  // }

  // edit(user: User) {
  //   user.isView = false;
  //   this.open(Object.assign({}, user));
  // }
  // updatePassword(user){

  //   user.labelTitle = InSyncConstants.userPassword;
  //   this.dialogService.open(UserPasswordComponent, user) ;

  // }



}
