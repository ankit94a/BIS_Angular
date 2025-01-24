import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { BisdefaultDatePipe } from './bisdefault-date.pipe';
import { TimeDifferencePipe } from './time-difference.pipe';

@NgModule({
   declarations: [

   ],
   imports: [
      CommonModule,
      TimeDifferencePipe,
      BisdefaultDatePipe
   ],
   exports: [
      BisdefaultDatePipe,
      TimeDifferencePipe
     
   ],
   providers: [DatePipe]
})
export class PipesModule { }
