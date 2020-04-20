import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private api: ApiService) { }

  public async getArticlesForRead(): Promise<Article[]> {
    return this.api.getArticlesForRead();
  }

  public async openPdf(article: Article): Promise<any> {
    const newTab = window.open('/assets/loading.html', '_blank');

    const blob = await this.api.getArticlePdf(article);    
    const url = window.URL.createObjectURL(blob);

    newTab.location.href = url;
  }
}
