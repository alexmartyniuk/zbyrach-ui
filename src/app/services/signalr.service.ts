import { Injectable } from '@angular/core';
import { Article } from '../models/article';
import * as signalR from '@aspnet/signalr';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: signalR.HubConnection;

  private onNewArticleSubject: Subject<Article> = new Subject<Article>();

  public onNewArticle$: Observable<Article> = this.onNewArticleSubject.asObservable();

  private baseUrl: string = environment.apiUrl;

  constructor(private accountService: AccountService, private http: HttpClient) { }

  public async startConnection(user: User): Promise<any> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl + 'newarticles?AuthToken=' + this.accountService.getToken())
      .build();

    try {
      await this.hubConnection.start();

      this.hubConnection.on('newarticle', (data) => {
        this.onNewArticleSubject.next(data);
      });

      if (user) {
        await this.hubConnection.invoke('Subscribe', user.id.toString());
      }
    } catch (err) {
      console.error('Error while starting connection: ' + err);
    }
  }

  public async stopConnection(user: User) {
    try {
      if (user) {
        await this.hubConnection.invoke('Unsubscribe', user.id.toString());
      }

      this.hubConnection.off('newarticle');

      await this.hubConnection.stop();
    } catch (err) {
      console.error('Error while stoping connection: ' + err);
    }
  }
}
