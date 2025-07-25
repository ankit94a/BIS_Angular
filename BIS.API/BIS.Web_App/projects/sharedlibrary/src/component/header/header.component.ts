import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-header',
  standalone:true,
  imports:[SharedLibraryModule,RouterModule,NotificationComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  userName:string;
  facilityName:string ;
  roleType;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    if(this.authService.getDivisionName() != null && this.authService.getDivisionName() != 'null'){
      this.facilityName = this.authService.getDivisionName();
    }else if(this.authService.getCorpsName()?.() != null && this.authService.getCorpsName()?.() !== 'null'){
      this.facilityName = this.authService.getCorpsName()!();
    }else{
      this.facilityName = 'Admin'
    }
    this.roleType = this.authService.getRoleType();
    if(this.roleType != '7' && this.roleType != '8' && this.roleType != '9'){
    }
      this.userName = this.authService.getUserName()
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  onLoggedout() {
    this.authService.clear()
  }

}
