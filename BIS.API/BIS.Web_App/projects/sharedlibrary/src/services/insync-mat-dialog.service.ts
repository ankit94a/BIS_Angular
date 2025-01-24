import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../component/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class BISMatDialogService {

  confirmContent;
  constructor(private dialog: MatDialog) {

  }

  openWithHidingTemplate(componentName, dataObject, isHidingTemplate = true): Promise<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { ...dataObject, isHidingTemplate: isHidingTemplate };
    dialogConfig.width = '80vw';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.hasBackdrop = isHidingTemplate;

    const dialogRef = this.dialog.open(componentName, dialogConfig);
    return dialogRef.afterClosed().toPromise();
}


  open(compononetName, dataObject): Promise<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = dataObject;
    dialogConfig.width= '80vw';
    dialogConfig. maxWidth='80vw';
    const dialogRef = this.dialog.open(compononetName, dialogConfig);
    return dialogRef.afterClosed().toPromise();
  }

  confirmDialog(): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: this.confirmContent
    });
    return dialogRef.afterClosed();
  }
}
