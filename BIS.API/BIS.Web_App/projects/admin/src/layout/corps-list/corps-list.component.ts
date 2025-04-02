import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'projects/clerk/src/app/app.component';
import { GenerateReportsListComponent } from 'projects/clerk/src/layout/generate-report/generate-reports-list/generate-reports-list.component';
import { LayoutComponent } from 'projects/clerk/src/layout/layout.component';
import { Division } from 'projects/sharedlibrary/src/model/base.model';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
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
  constructor(private apiService:ApiService,private router:Router){
    this.getCorpsList()
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
  openClerkApp(corps){
    debugger
    this.isClerkApp = true;
    this.router.navigate(['/dashboard']);
  }
}
