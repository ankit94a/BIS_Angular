import { MAT_DATE_LOCALE } from "@angular/material/core";
import { ZipperTableComponent } from "./zipper-table.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomViewComponent } from "./custom-view.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MaterialModule } from "../../helpers/material";

@NgModule({
  declarations: [
    // ZipperTableComponent,
    // CustomViewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [
    // ZipperTableComponent
  ],
    providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
      
        {
          provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
          useValue: { subscriptSizing: 'dynamic' },
        },
       
      
    ]
})
export class ZipperTableModule { }
