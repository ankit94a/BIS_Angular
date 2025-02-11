import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { Router } from '@angular/router';
import { bounceAnimation } from 'angular-animations';
import { AnimationEvent } from '@angular/animations';
import { ApiService } from '../../services/api.service';
import { SignalRService } from '../../services/signal-r.service';
import { TimeDifferencePipe } from '../../pipe/time-difference.pipe';
import { NotificationModel } from '../../model/notification.model';
import { BISMatDialogService } from '../../services/insync-mat-dialog.service';
import { NotificationActionComponent } from '../notification-action/notification-action.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [SharedLibraryModule],
  providers: [TimeDifferencePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  animations: [bounceAnimation({ duration: 1000 })]
})
export class NotificationComponent implements OnInit {
  notifications: NotificationModel[] = [];
  unreadNotificationCount:[]=[];
  currentPage = 0;
  hasMore = true;
  loading = false;
  dropdownVisible = false;


  constructor(private dialogService:BISMatDialogService,private router: Router, private apiService: ApiService, private signalRService: SignalRService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.getUnreadNotification();
    // this.signalRService.startConnection();
    // this.signalRService.onNotificationReceived((message) => {

    //   this.unreadNotificationCount++;
    //   if (this.notifications == undefined) {
    //     this.notifications = [];
    //   }
    //   this.animate(3);
    //   this.notifications.unshift(message);
    // });
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection();
  }

  openNotification(notify){
    this.dialogService.open(NotificationActionComponent,notify).then(res =>{
      if(res){
        let index = this.notifications.findIndex(item => item.id == notify.id);
        this.notifications.splice(index,1);
      }
    })
  }
  readUpdate(item) {
    if (!item.isRead) {
      this.apiService.postWithHeader('notification/updatestatus', item).subscribe(res => {
        if (res) {
          item.isRead = true;
          // this.unreadNotificationCount--;
        }
      })
    }
    this.dropdownVisible = false;
    // if (item.notificationType == NotifType.LeaveRequest) {
    //   this.router.navigateByUrl('/teacher-leave')
    // } else if (item.notificationType == NotifType.FeeAudit) {
    //   this.router.navigateByUrl('/fees/feereport')
    // }

  }
  loadNotifications(): void {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    // this.apiService.getWithHeaders(`notification/${ApplicationType.EduSynk_Admin}/${this.currentPage}`).subscribe((data) => {
    //   if (this.currentPage == 0) {
    //     this.notifications = [];
    //   }
    //   this.notifications = [...this.notifications, ...data.items];
    //   this.hasMore = data.totalPages - 1 > this.currentPage;
    //   this.currentPage++;
    //   this.loading = false;
    // });
  }
  onScroll() {
    this.loadNotifications();
  }
  openNotifications(): void {
    this.dropdownVisible = !this.dropdownVisible;
    // if (this.dropdownVisible) {
    //   this.loadNotifications();
    // }
  }
  getUnreadNotification() {
    this.apiService.getWithHeaders('notification/unread').subscribe(res => {
      if (res) {
        this.notifications = res;
      }
    })
  }
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
    if (this.dropdownVisible && !this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }
  times: number;
  counter = 0;
  animState = false;

  animate(times: number) {
    this.counter = 0;
    this.times = times;
    this.animState = !this.animState;
  }

  animDone(event: AnimationEvent) {
    if (this.counter < this.times - 1) {
      this.animState = !this.animState;
      this.counter++;
    }
  }
}
