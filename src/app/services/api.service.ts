import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Tag } from '../models/tag';
import { Mailing } from '../models/mailing';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'https://zbyrach-api.herokuapp.com/';

  public async login(token: string): Promise<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.baseUrl + 'account/login', { token: token })
      .toPromise();
  }

  public async logout(): Promise<any> {
    return this.http
      .post(this.baseUrl + 'account/logout', null)
      .toPromise();
  }

  public async getRelatedTags(name: string): Promise<Tag[]> {
    const url = this.baseUrl + `tags/${name}/related`;
    return this.http
      .get<Tag[]>(url)
      .toPromise();
  }

  public async getMyTags(): Promise<Tag[]> {
    const url = this.baseUrl + 'tags/my';
    return this.http
      .get<Tag[]>(url)
      .toPromise();
  }

  public async setMyTags(tags: string[]): Promise<any> {
    const url = this.baseUrl + 'tags/my';
    return this.http
      .post(url, tags)
      .toPromise();
  }

  public async getMyMailingSettings(): Promise<Mailing> {
    const url = this.baseUrl + 'mailing/settings/my';
    return this.http
      .get<Mailing>(url)
      .toPromise();
  }

  public async setMyMailingSettings(settings: Mailing): Promise<Mailing> {
    const url = this.baseUrl + 'mailing/settings/my';
    return this.http
      .post<Mailing>(url, settings)
      .toPromise();
  }

  public async getArticlesForRead(): Promise<Article[]> {
    const url = this.baseUrl + 'articles/status/read';
    return this.http
      .get<Article[]>(url)
      .toPromise();
  }

  public async getArticlePdf(article: Article): Promise<Blob> {
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