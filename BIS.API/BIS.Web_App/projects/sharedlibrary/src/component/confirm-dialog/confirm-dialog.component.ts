import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedLibraryModule } from '../../shared-library.module';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone:true,
  imports:[SharedLibraryModule]
})
export class ConfirmDialogComponent implements OnInit {
  message;
 
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data;
  }
  ngOnInit(): void {
  }
  
  onConfirm(): void {
    this.dialogRef.close(true);
  }
 
  onDismiss(): void {
    this.dialogRef.close(false);
  }
}