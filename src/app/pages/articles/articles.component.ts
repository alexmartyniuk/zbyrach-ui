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

  public Articles: Article[];

  constructor(private accountService: AccountService, private articleService: ArticleService) { }

  async ngOnInit() {
    this.Articles = await this.articleService.getArticlesForRead();
  }

  public OpenPdf(article: Article) {
    this.articleService.openPdf(article);
  }

}
