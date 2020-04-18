import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ArticleService } from '../services/artilcle.service';
import { Article } from '../models/article';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  public Articles: Article[];

  constructor(private accountService: AccountService, private articleService: ArticleService) { }

  ngOnInit() {
    this.accountService.LoginStateChanged$.subscribe(async (logedin) => {
      if (logedin) {
        this.Articles = await this.articleService.getArticlesForRead();
      } else {
        this.Articles = [];
      }
    });
  }

  public OpenPdf(article: Article) {
    this.articleService.openPdf(article);
  }

}
