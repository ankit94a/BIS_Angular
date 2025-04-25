import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { EnemyLocation, MasterLoc, Source } from 'projects/sharedlibrary/src/model/masterdata.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TablePaginationSettingsConfig } from 'projects/sharedlibrary/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/sharedlibrary/src/component/zipper-table/zipper-table.component';

@Component({
  selector: 'app-attribute',
  standalone: true,
  imports: [SharedLibraryModule,RouterModule,MatPaginatorModule],
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.scss'
})
export class AttributeComponent extends TablePaginationSettingsConfig implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sourceLocList:MasterLoc[]=[];
  sourceList:Source[]=[];
  typeLocList:Source[]=[];
  enemyLocList:EnemyLocation[]=[];
  activeTab: string = 'wing';
  displayedColumns: string[] = ['name', 'actions'];
  data = new MatTableDataSource<Source>(this.sourceList);
  dataSource = new MatTableDataSource<MasterLoc>(this.sourceLocList);

  dataSource1 = new MatTableDataSource<MasterLoc>(this.typeLocList);
  dataSource2 = new MatTableDataSource<EnemyLocation>(this.enemyLocList);
  categoryId:number;
  subCategoryId:number;
  wingId:number;

  // adding section
  isRefresh:boolean=false;
  name:string;
  @ViewChild('sourceAdd') sourceTemplate;
  @ViewChild('sourceLocAdd') sourceLocTemplate;
  @ViewChild('typeOfLocAdd') typeOfLocTemplate;
  @ViewChild('enemyLocAdd') enemyLocTemplate;

  columns = [
    {
      name: 'name', displayName: 'Input Level', isSearchable: false
    }
  ]
  constructor(private dialogService:BISMatDialogService,private apiService:ApiService,private dailog:MatDialog,private toastr:ToastrService){
    super();
    this.tablePaginationSettings.enableAction = true;
    // this.tablePaginationSettings.enableEdit = true;
    this.tablePaginationSettings.enableView = true;
    this.tablePaginationSettings.enableDelete = true;
    // this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
    this.getSource();
  }
  ngOnInit(): void {

  }

 public async onTabChange(event) {
    const selectedTab = event.index;
    switch (selectedTab) {
      case 0:
        this.activeTab = 'source';
        this.getSource();
        break;
      case 1:
        this.activeTab = 'source loc';
        this.getSourceLoc();
        break;
      case 2:
        this.activeTab = 'type of loc';
        this.getTypeOfLoc();
        break;
      case 3:
        this.activeTab = 'en loc name';
        this.getEnemyLoc();
        break;
      default:
        break;
    }
    this.name = '';
  }

  saveDropDown(type){
    this.apiService.getWithHeaders(`masterdata/${type}/${this.name}`).subscribe(res =>{
      if(res){
        this.toastr.success("Added Successfully",'success')
        if(type == 'addsource'){
          this.getSource();
        }else if(type = 'addlocsource'){
          this.getSourceLoc();
        }else if(type = 'addloctype'){
          this.getTypeOfLoc();
        }else {
          this.getEnemyLoc();
        }
        this.closeDialog();
      }
    })
  }
  edit(item){

  }
  view(item,type){
    this.dialogService.confirmDialog("remove " + item.name).subscribe(res => {
      if(res){
        this.apiService.getWithHeaders(`masterdata/deactivate/${item.id}/${type} `).subscribe(res =>{
          if(res){
            this.toastr.success("delete successfully",'success');
            if(type == 'MasterSources'){
              this.getSource();
            }else if(type == 'MasterLocations'){
              this.getSourceLoc();
              this.getTypeOfLoc();
            }else{
              this.getEnemyLoc();
            }
          }
        })
      }
    })
  }
  closeDialog(){
    this.dailog.closeAll();
  }
  getSource(){
    this.apiService.getWithHeaders('masterdata/source').subscribe(res =>{
      if(res){
      this.sourceList=res;
      this.data.data = this.sourceList;
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
      }
    })
  }
  getSourceLoc(){
    this.apiService.getWithHeaders('masterdata/loc/'+true).subscribe(res =>{
      if(res){
      this.sourceLocList=res;
      this.dataSource.data = this.sourceLocList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      }
    })
  }
  getTypeOfLoc(){
    this.apiService.getWithHeaders('masterdata/loc/'+false).subscribe(res =>{
      if(res){
      this.typeLocList=res;
      this.dataSource1.data = this.typeLocList;
      this.dataSource1.paginator = this.paginator;
      this.dataSource1.sort = this.sort;
      }
    })
  }

  getEnemyLoc(){
    this.apiService.getWithHeaders('masterdata/enloc').subscribe(res =>{
      if(res){
        this.enemyLocList=res;
        this.dataSource2.data = this.enemyLocList;
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      }
    })
  }
  addEnemyLoc(){
    this.dialogService.open(this.enemyLocTemplate,null,'30vw')
  }
  addSource(){
    this.dialogService.open(this.sourceTemplate,null,'30vw')
  }
  addSorceLoc(){
    this.dialogService.open(this.sourceLocTemplate,null,'30vw')
  }
  addTypeOfLoc(){
    this.dialogService.open(this.typeOfLocTemplate,null,'30vw')
  }

}
