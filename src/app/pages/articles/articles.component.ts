import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ArticleService } from '../../services/artilcle.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  public articles: Article[];

  public areArticleFound: boolean = false;

  constructor(private articleService: ArticleService) { }

  async ngOnInit() {
    this.articles = await this.articleService.getArticlesForRead();
    this.areArticleFound = this.articles.length > 0;
  }

  public openPdf(article: Article) {
    this.articleService.openPdf(article);
  }

}
