import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  // category:Category=new Category();
  // wing:Wing[]=[];
  constructor(private apiSerive:ApiService,private toastr:ToastrService,private dailogRef:MatDialogRef<CategoryComponent>){
    this.getWing();
  }
  getWing(){
    this.apiSerive.getWithHeaders('attribute/wing').subscribe(res =>{
      if(res){
      // this.wing=res;
      }
    })
  }
  save(){
    // this.apiSerive.postWithHeader('attribute/category',this.category).subscribe(res =>{
    //   if(res){
    //     this.toastr.success("Category added successfully",'success');
    //     this.dailogRef.close(true);
    //   }
    // })
  }
}
