import { NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './helpers/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from './pipe/pipes.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [


  ],
  imports: [
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    ToastrService],
})
export class SharedLibraryModule { }
