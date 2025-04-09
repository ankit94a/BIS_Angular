import { Component } from '@angular/core';
import { SharedLibraryModule } from '../../../sharedlibrary/src/shared-library.module';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../sharedlibrary/src/component/header/header.component';
import { SidebarComponent } from '../../../sharedlibrary/src/component/sidebar/sidebar.component';
import { FooterComponent } from 'projects/sharedlibrary/src/component/footer/footer.component';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-layout',
  imports: [SharedLibraryModule,RouterModule,HeaderComponent,SidebarComponent,FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  sideBarOpen = true;
  isSideBarLoaded:boolean=false;
  typeSelected;
  currentRoute: string = '';
  constructor(private route:Router) {
    this.typeSelected= 'ball-fussion';
    debugger
    this.route.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
      console.log('Current Route:', this.currentRoute);
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
