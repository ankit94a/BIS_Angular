import { Component } from '@angular/core';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { AnalysisFormComponent } from '../analysis-form/analysis-form.component';

@Component({
  selector: 'app-ai-analysis',
  imports: [SharedLibraryModule],
  templateUrl: './ai-analysis.component.html',
  styleUrl: './ai-analysis.component.scss'
})
export class AIAnalysisComponent {
  cards = [
    {
      name:'Activity Trend',
      path:'detect-arima-anomalies'
    },{
      name:'Seasonability Check',
      path:'activity-trend'
    },{
      name:'Strange Event',
      path:'activity-trend'
    },{
      name:'Deep Anomaly',
      path:'detect-anomalies/'
    }
  ]

  constructor(private dialogService:BISMatDialogService){

  }
  get cardRows() {
  const rows = [];
  for (let i = 0; i < this.cards.length; i += 2) {
    rows.push(this.cards.slice(i, i + 2));
  }
  return rows;
}

openCardDetails(card){
  this.dialogService.open(AnalysisFormComponent,card)
}

}
