import { Component } from '@angular/core';
import { BISMatDialogService } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { Router } from '@angular/router';

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
      path:'detect-arima-anomalies/',
      description:'This model uses ARIMA to analyze historical data, detect anomalies, and forecast future trends with high accuracy. Ideal for monitoring time-series data like sales, performance metrics, or sensor values'
    },{
      name:'Seasonability Check',
      path:'detect-prophet-anomalies/',
      description:'Built with Facebook’s Prophet model, this tool provides robust forecasts for time-series data with support for seasonality, holidays, and trend changes. Ideal for business metrics, traffic, or demand forecasting'
    },{
      name:'Strange Event',
      path:'detect-isolation-anomalies-single/',
      description:'testing'
    },{
      name:'Deep Anomaly',
      path:'detect-lstm-anomalies/',
      description:'This LSTM-based model leverages deep learning to capture complex temporal patterns in sequential data. Ideal for high-accuracy forecasting in dynamic environments like finance, energy, or sensor networks'
    }
  ]

  constructor(private dialogService:BISMatDialogService,private router:Router){

  }
  get cardRows() {
  const rows = [];
  for (let i = 0; i < this.cards.length; i += 2) {
    rows.push(this.cards.slice(i, i + 2));
  }
  return rows;
}

openCardDetails(card: any) {
  this.router.navigate(['/analysis-form'], { queryParams: { path: card.path } });
}


}
