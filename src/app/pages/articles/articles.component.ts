import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ArticleService } from '../../services/artilcle.service';
import { Article } from '../../models/article';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  public articles: Article[];
  public articlesFound: boolean = false;
  public isLoading: boolean = true;

  constructor(private router: Router, private accountService: AccountService, private articleService: ArticleService) { }

  async ngOnInit() {
    this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      if (logedin) {
        this.loadArticles();
      } else {
        this.router.navigate(['/greeting']);
      }
    });
  }

  private async loadArticles() {
    try {
      this.isLoading = true;
      this.articles = await this.articleService.getArticlesForRead();
      this.articlesFound = this.articles.length > 0;
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  public openPdf(article: Article) {
    this.articleService.openPdf(article);
  }

}
