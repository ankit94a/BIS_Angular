import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedLibraryModule } from '../../shared-library.module';
import { FileUploadComponent } from '../file-upload/file-upload.component';
// import { FileUploadComponent } from 'projects/sharedLibrary/src/components/file-upload/file-upload.component';
// import { DownloadModel, UploadModel } from 'projects/sharedLibrary/src/model/download.model';
// import { NotifType } from 'projects/sharedLibrary/src/model/enum.model';
// import { DownloadService } from 'projects/sharedLibrary/src/services';

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
  styles: [`
    .content {
      border: 2px solid #3f51b5;
      border-radius: 8px;
      width:140px;
      height:35px;
      display:flex;
      align-items:center;
      justify-content:center;
      background-color: #f5f7fa;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;
    }

    .content:hover {
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    .dropdown-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #e0e0e0;
      transition: background-color 0.2s;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background-color: #e3eafc;
    }
  `],
  standalone:true,
  imports: [SharedLibraryModule],
})
export class ActionDropdownComponent implements OnInit {

  @Input() sessionId: number;
  // @Input() notifType: NotifType;
  @Output() afterClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor( public dialog: MatDialog) { }

  ngOnInit() {
  }
  
  download(isSample) {
    // let downloadModel = new DownloadModel();
    // downloadModel.NotifType = this.notifType;
    // downloadModel.sessionId = this.sessionId;
    // downloadModel.IsSample = isSample;
    // this.downloadService.download(downloadModel);
  }

  import() {
    // let uploadModel = new UploadModel();
    // uploadModel.NotifType =this.notifType;
    // uploadModel.sessionId = this.sessionId;
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = uploadModel;
    // const dialogRef = this.dialog.open(FileUploadComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(
    //   data => {
    //     if (data) {
    //       this.afterClosed.emit(data);
    //     }
    //   }
    // );
  }
}
