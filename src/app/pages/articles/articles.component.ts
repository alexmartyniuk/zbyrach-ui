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

  public articlesOriginal: Article[];
  public articlesFound: boolean = false;

  public tagsActivity: Map<string, boolean> = new Map<string, boolean>();

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

  public get articles(): Article[] {
    return this.articlesOriginal.filter(a => {
      if([...this.tagsActivity.values()].includes(true) === false){
        return true;
      } 
      return a.tags.filter(t => this.tagsActivity.get(t)).length > 0;
    });
  }

  public get isOnlyOneTag(): boolean {
    return this.tagsActivity.size === 1;
  }

  private async loadArticles() {
    this.articlesOriginal = await this.articleService.getArticlesForRead();
    this.articlesFound = this.articlesOriginal.length > 0;
    this.tagsActivity.clear();

    this.articlesOriginal.forEach(a => {
      a.tags.forEach(t => {
        this.tagsActivity.set(t, false);
      });
    });
  }

  public onClickTag(tag: string): void {
    const active = this.tagsActivity.get(tag)
    this.tagsActivity.set(tag, !active);
  }
}
