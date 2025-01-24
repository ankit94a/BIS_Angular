import { Component } from '@angular/core';
import { SharedLibraryModule } from '../../../sharedlibrary/src/shared-library.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../sharedlibrary/src/component/header/header.component';
import { SidebarComponent } from '../../../sharedlibrary/src/component/sidebar/sidebar.component';


@Component({
  selector: 'app-layout',
  imports: [SharedLibraryModule,RouterModule,HeaderComponent,SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  
  sideBarOpen = true;
  isSideBarLoaded:boolean=false;
  typeSelected;
  constructor() {
    this.typeSelected= 'ball-fussion';
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
