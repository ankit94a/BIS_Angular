import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'projects/clerk/src/app/app.component';
import { GenerateReportsListComponent } from 'projects/clerk/src/layout/generate-report/generate-reports-list/generate-reports-list.component';
import { LayoutComponent } from 'projects/clerk/src/layout/layout.component';
import { Division } from 'projects/sharedlibrary/src/model/base.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-corps-list',
  imports: [SharedLibraryModule],
  templateUrl: './corps-list.component.html',
  styleUrl: './corps-list.component.scss'
})
export class CorpsListComponent {
  corpsList:Division[]=[];
  isClerkApp:boolean=false;
  user;
  constructor(private apiService:ApiService,private router:Router,private authService:AuthService){
    this.getCorpsList();
    this.user = this.authService.getRoleType()
  }
  getCorpsList(){
    this.apiService.getWithHeaders('corps').subscribe(res =>{
      if(res){
        this.corpsList = res;
        this.corpsList.forEach(item =>{
          if(item.id == 1){
            item.imageUrl = '/assets/Eastern_Command.png'
          }else if(item.id == 2){
            item.imageUrl = '/assets/33Corps.jpg'
          }else if(item.id == 3){
            item.imageUrl = '/assets/3Corps.png'
          }else if(item.id == 4){
            item.imageUrl = '/assets/4Corps.png'
          }else{
            item.imageUrl = '/assets/17Corps.png'
          }
        })
      }
    })
  }
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }

  redirectUrl(corps){
let tokenStr = this.authService.getToken();
const decoded = this.decodeToken(tokenStr);

if (decoded) {
  decoded.corpsId = corps.id;
  localStorage.setItem("BIS_TOKEN", JSON.stringify(decoded));
  localStorage.setItem("BIS_CorpsName", corps.name);
  localStorage.setItem("BIS_CorpsId", corps.id);
}
    if(this.user == "10"){
      this.router.navigate(['/dashboard']);
    }else if(this.user == "15"){

    }else{

    }

  }
  openClerkApp(corps){
    this.isClerkApp = true;
    this.router.navigate(['/dashboard']);
  }
}
