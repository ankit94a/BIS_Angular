import { Component, OnInit } from '@angular/core';
import { UserPasswordComponent } from '../user-password/user-password.component';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { User } from 'projects/sharedlibrary/src/model/user.model';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AllCorps, AllDivision, RoleType } from 'projects/sharedlibrary/src/model/enum';

@Component({
  selector: 'app-userlist',
  templateUrl: './user-list.component.html',
  standalone:true,
  imports:[ SharedLibraryModule],
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userList: User[];
  RoleType = RoleType;
  Corps = AllCorps;
  Divison = AllDivision;
  constructor(private dialogService:BISMatDialogService,private apiService:ApiService ){

  }
 ngOnInit(): void {
    this.fetchUser();
  }

  edit(user){

  }
  remove(user){

  }
  view(user){
    user.isView = true;
    this.open(user);
  }
  fetchUser() {
    this.apiService.getWithHeaders('user/all')
      .subscribe(Response => {
        if (Response) {
          this.userList = Response as User[];
        }
      });
  }
  open(user) {
    user.labelTitle = "User";

  }
  add() {
    let user = new User();
    this.open(user);
  }

  update(user){
    this.dialogService.open(UserPasswordComponent, user,'22vw') ;
  }



}
