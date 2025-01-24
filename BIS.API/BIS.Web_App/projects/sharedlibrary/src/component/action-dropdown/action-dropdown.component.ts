import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FileUploadComponent } from 'projects/sharedLibrary/src/components/file-upload/file-upload.component';
import { DownloadModel, UploadModel } from 'projects/sharedLibrary/src/model/download.model';
import { NotifType } from 'projects/sharedLibrary/src/model/enum.model';
import { DownloadService } from 'projects/sharedLibrary/src/services';
import { SharedLibraryModule } from '../../public-api';

@Component({
  selector: 'edusynk-action-dropdown',
  templateUrl: './action-dropdown.component.html',
  standalone:true,
  imports: [SharedLibraryModule,FileUploadComponent],
})
export class ActionDropdownComponent implements OnInit {

  @Input() sessionId: number;
  @Input() notifType: NotifType;
  @Output() afterClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private downloadService:DownloadService, public dialog: MatDialog) { }

  ngOnInit() {
  }
  
  download(isSample) {
    let downloadModel = new DownloadModel();
    downloadModel.NotifType = this.notifType;
    downloadModel.sessionId = this.sessionId;
    downloadModel.IsSample = isSample;
    this.downloadService.download(downloadModel);
  }

  import() {
    let uploadModel = new UploadModel();
    uploadModel.NotifType =this.notifType;
    uploadModel.sessionId = this.sessionId;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = uploadModel;
    const dialogRef = this.dialog.open(FileUploadComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.afterClosed.emit(data);
        }
      }
    );
  }
}
