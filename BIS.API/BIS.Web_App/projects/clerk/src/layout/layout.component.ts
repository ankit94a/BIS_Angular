import { Component } from '@angular/core';
import { SharedLibraryModule } from '../../../sharedlibrary/src/shared-library.module';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../sharedlibrary/src/component/header/header.component';
import { SidebarComponent } from '../../../sharedlibrary/src/component/sidebar/sidebar.component';
import { FooterComponent } from 'projects/sharedlibrary/src/component/footer/footer.component';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { filter } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-layout',
  imports: [SharedLibraryModule,RouterModule,HeaderComponent,SidebarComponent,FooterComponent,NgxSpinnerModule ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  sideBarOpen = true;
  isSideBarLoaded:boolean=false;
  typeSelected;
  currentRoute: string = '';
  constructor(private route:Router,public spinnerService: NgxSpinnerService) {
    this.typeSelected= 'ball-fussion';
    this.route.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });

  }

  ngOnInit(): void {

  }
  isLoaded($event){
    this.isSideBarLoaded = $event
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
