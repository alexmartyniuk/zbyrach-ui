import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Article } from '../models/article';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private api: ApiService, private accountService: AccountService) { }

  public async getArticlesForRead(): Promise<Article[]> {
    return this.api.getArticlesForRead();
  }

  public async openPdf(article: Article): Promise<any> {
    const newTab = window.open('/assets/loading.html', '_blank');
    try {
      const user = this.accountService.getUser();
      const blob = await this.api.getArticlePdf(article.id, user.id);
      const url = window.URL.createObjectURL(blob);

      newTab.location.href = url;
    } catch {
      newTab.close();
    }
  }
}
