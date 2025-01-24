import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ApiService } from './api.service';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  public baseUrl = environment.baseUrl;
  private hubConnection!: signalR.HubConnection;

  constructor(private apiService: ApiService) { }

  public startConnection = () => {

    const token = localStorage.getItem('BIS_TOKEN');
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl + 'edusynknotificationhub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets, // Optional: Use specific transport

        accessTokenFactory: () => token,
      }).withAutomaticReconnect().build();
    this.hubConnection.start();
  };
  onNotificationReceived(callback: (message: any) => void): void {
    this.hubConnection.on('ReceiveNotification', (msg) => {
      callback(msg);
    });
  }
  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('SignalR connection stopped'));
    }
  }
}
