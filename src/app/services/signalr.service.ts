import { Injectable } from '@angular/core';
import { Article } from '../models/article';
import * as signalR from "@aspnet/signalr";
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: signalR.HubConnection

  private onNewArticleSubject: Subject<Article> = new Subject<Article>();

  public onNewArticle$: Observable<Article> = this.onNewArticleSubject.asObservable();

  constructor(private accountService: AccountService, private http: HttpClient) { }

  public async startConnection(user: User): Promise<any> {

    let options: signalR.IHttpConnectionOptions = {
      httpClient: <signalR.HttpClient>{
        getCookieString: (url) => {
          return '';
        },
        post: (url, httpOptions) => {
          return this.http.post(url, null, {
            headers: httpOptions.headers,
            withCredentials: false
          })
            .toPromise()
            .then(
              res => {
                return {
                  statusCode: 200,
                  statusText: null,
                  content: JSON.stringify(res)
                };
              },
              err => err
            );
        }
      }
    }

    // TODO: replace url
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/newarticles?AuthToken=' + this.accountService.getToken())
      .build();

    try {
      await this.hubConnection.start();
      console.log('Connection started');

      this.hubConnection.on('newarticle', (data) => {
        this.onNewArticleSubject.next(data);
        console.log(data);
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
        this.hubConnection.invoke('Unsubscribe', user.id.toString());
      }
      await this.hubConnection.stop();
      console.log('Connection stoped');
    }
    catch (err) {
      console.error('Error while stoping connection: ' + err)
    }
  }
}
