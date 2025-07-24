import { Component } from '@angular/core';
import { SharedLibraryModule } from '../../../sharedlibrary/src/shared-library.module';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../sharedlibrary/src/component/header/header.component';
import { SidebarComponent } from '../../../sharedlibrary/src/component/sidebar/sidebar.component';
import { FooterComponent } from 'projects/sharedlibrary/src/component/footer/footer.component';
import { filter } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';


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
   position = { x: 1500, y: 650 };
  isDragging = false;
  offset = { x: 0, y: 0 };
  constructor(private route:Router,public spinnerService: NgxSpinnerService,private dialogService:BISMatDialogService ) {
    this.typeSelected= 'ball-fussion';
    this.route.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });
this.setDynamicPosition();
    this.typeSelected = 'ball-fussion';
  }
  setDynamicPosition() {
    const offsetX = 170;
    const offsetY = 170;

    this.position = {
      x: window.innerWidth - offsetX,
      y: window.innerHeight - offsetY
    };
  }


  isLoaded($event: any) {
    this.isSideBarLoaded = $event
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.offset.x = event.clientX - this.position.x;
    this.offset.y = event.clientY - this.position.y;

    document.addEventListener('mousemove', this.onDragBound);
    document.addEventListener('mouseup', this.stopDragBound);

    event.preventDefault();
  }

  onDrag = (event: MouseEvent): void => {
    if (this.isDragging) {
      const newX = event.clientX - this.offset.x;
      const newY = event.clientY - this.offset.y;

      this.position.x = Math.max(0, Math.min(newX, window.innerWidth - 60));
      this.position.y = Math.max(0, Math.min(newY, window.innerHeight - 60));
    }
  };
  stopDrag = (): void => {
    this.isDragging = false;
    localStorage.setItem('avatarPosition', JSON.stringify(this.position));
    document.removeEventListener('mousemove', this.onDragBound);
    document.removeEventListener('mouseup', this.stopDragBound);
  };
  onDragBound = this.onDrag.bind(this);
  stopDragBound = this.stopDrag.bind(this);
}

