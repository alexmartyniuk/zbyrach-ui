import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/user';
import { Tag } from '../models/tag';
import { MailingSettings } from '../models/mailing-settings';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'https://localhost:5001/';

  public async Login(token: string): Promise<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.baseUrl + 'account/login', { token: token })
      .toPromise();
  }

  public async Logout(): Promise<any> {
    return this.http
      .post(this.baseUrl + 'account/logout', null)
      .toPromise();
  }

  public async GetRelatedTags(name: string): Promise<Tag[]> {
    const url = this.baseUrl + `tags/${name}/related`;
    return this.http
      .get<Tag[]>(url)
      .toPromise();
  }

  public async GetMyTags(): Promise<Tag[]> {
    const url = this.baseUrl + 'tags/my';
    return this.http
      .get<Tag[]>(url)
      .toPromise();
  }

  public async SetMyTags(tags: string[]): Promise<any> {
    const url = this.baseUrl + 'tags/my';
    return this.http
      .post(url, tags)
      .toPromise();
  }

  public async GetMyMailingSettins(): Promise<MailingSettings> {
    const url = this.baseUrl + 'mailing/settings/my';
    return this.http
      .get<MailingSettings>(url)
      .toPromise();
  }

  public async SetMyMailingSettins(settings: MailingSettings): Promise<MailingSettings> {
    const url = this.baseUrl + 'mailing/settings/my';
    return this.http
      .post<MailingSettings>(url, settings)
      .toPromise();
  }

  public async GetArticlesForRead(): Promise<Article[]> {
    const url = this.baseUrl + 'articles/status/read';
    return this.http
      .get<Article[]>(url)
      .toPromise();
  }

  public async GetArticlePdf(article: Article): Promise<Blob> {
    const url = this.baseUrl + 'articles/pdf/' + article.id;

    const response = await this.http
      .get(url, { responseType: 'arraybuffer' })
      .toPromise();

    return new Blob([response], { type: 'application/pdf' });
  }
}

class LoginResponse {
  token: string;
  user: User;
}