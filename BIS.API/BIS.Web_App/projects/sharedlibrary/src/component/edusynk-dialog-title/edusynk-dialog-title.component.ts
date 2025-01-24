import { Component, Input, OnInit } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';

@Component({
  selector: 'BIS-dialog-title',
  templateUrl: './edusynk-dialog-title.component.html',
  standalone:true,
  imports:[SharedLibraryModule]
})
export class BISDialogTitleComponent implements OnInit {

  @Input() dataObject: any;
  constructor() { }

  ngOnInit(): void {
  }
}
