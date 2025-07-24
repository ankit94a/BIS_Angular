import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { authInterceptor } from 'projects/sharedlibrary/src/services/auth-interceptor.service';

@Component({
    selector: 'app-clerk',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useValue: authInterceptor,
        multi: true
      }
    ],
    standalone:true
})
export class AppComponent {
  title = 'BAIS';
  constructor(private toastr: ToastrService) {}

  ngOnInit(){
    this.toastr.toastrConfig.positionClass = 'toast-top-right';
  }
}
