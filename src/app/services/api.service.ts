import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Tag } from '../models/tag';
import { Mailing, SettingsSummary } from '../models/mailing';
import { Article } from '../models/article';
import { Statistic as Statistic } from '../models/statistic';

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

  public async getSettingsSummary(): Promise<SettingsSummary> {
    const url = this.baseUrl + 'mailing/settings/summary';
    return this.http
      .get<SettingsSummary>(url)
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

  public async getArticlePdf(articleId: number, userId: number): Promise<Blob> {
    const url = this.baseUrl + 'articles/' + articleId + '/pdf/?inline=false&userId=' + userId;

    const response = await this.http
      .get(url, { responseType: 'arraybuffer' })
      .toPromise();

    return new Blob([response], { type: 'application/pdf' });
  }

  public getArticleInlinePdfUrl(articleId: string, userId: string): string {
    return this.baseUrl + 'articles/' + articleId + '/pdf/?inline=true&userId=' + userId;
  }

  public async unsubscribe(token: string): Promise<User> {
    return this.http
      .post<User>(this.baseUrl + 'mailing/unsubscribe/' + token, {})
      .toPromise();
  }

  public async getStatistic(): Promise<Statistic> {
    const url = this.baseUrl + 'statistic';
    return this.http
      .get<Statistic>(url)
      .toPromise();
  }

  public async cleanup(daysCleanup: number): Promise<any> {
    const url = this.baseUrl + 'cleanup/' + daysCleanup;
    return this.http
      .delete(url)
      .toPromise();
  }
}

class LoginResponse {
  token: string;
  user: User;
}
