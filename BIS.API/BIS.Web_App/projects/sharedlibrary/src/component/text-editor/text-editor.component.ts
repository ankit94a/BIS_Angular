import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SharedLibraryModule } from '../../shared-library.module';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  standalone:true,
  imports:[SharedLibraryModule]

})
export class TextEditorComponent implements OnInit {

  vendorInstructions:any
  config1: AngularEditorConfig = {
    editable: true,
    height: '20rem',
    minHeight: 'rem',
    width:'40rem',
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };
  config2: AngularEditorConfig = {
    height: '20rem',
    minHeight: 'rem',
    width:'40rem',
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

  config: AngularEditorConfig = {
  };

  constructor() {
      // this.config = this.vendorInstructions.isView == true? this.config2:this.config1;
    }

    close(result = false) {
    }

  ngOnInit(): void {
  }

}
