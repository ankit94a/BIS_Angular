import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';

@Component({
  selector: 'edusynk-dialog-action',
  templateUrl: './edusynk-dialog-action.component.html',
  standalone:true,
  imports:[SharedLibraryModule]
})
export class EduSynkDialogActionComponent implements OnInit {

  @Input() dataObject: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() reset = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }
  closedialog(result = false) {
    this.close.emit(false);
  }
  resetObj() {

    this.reset.emit(false);
  }
}
