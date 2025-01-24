import { NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './helpers/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from './pipe/pipes.module';
// import { PipesModule } from './pipe/pipes.module';
//do not delete this import ConfirmDialogModule
// import { CurrentColumnDirective } from './directive/current-column.directive';
// import { WarningDialogComponent } from './components/warning-dialog/warning-dialog.component';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';



@NgModule({
  declarations: [
    

  ],
  imports: [
    ToastrModule.forRoot() 

  ],
  exports: [
    // PipesModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,

  ],
  providers: [
    ToastrService],
})
export class SharedLibraryModule { }
