import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ArticleService } from '../../services/artilcle.service';
import { Article } from '../../models/article';
import { Router } from '@angular/router';
import { Tag } from 'src/app/models/tag';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  public articlesOriginal: Article[];
  public articlesFound: boolean = false;

  public tagsActivity: Map<string, boolean> = new Map<string, boolean>();
  public tags: Map<string, Tag> = new Map<string, Tag>();

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
      return a.tags.filter(t => this.tagsActivity.get(t)).length > 0;
    });
  }

  private async loadArticles() {
    this.articlesOriginal = await this.articleService.getArticlesForRead();
    this.articlesFound = this.articlesOriginal.length > 0;
    this.tagsActivity.clear();

    this.articlesOriginal.forEach(a => {
      a.tags.forEach(t => {
        this.tagsActivity.set(t, true);

        let newTag: Tag = { 'name': t, 'url': null, 'parentTagName': null };
        this.tags.set(t, newTag);
      });
    });
  }

  public openPdf(article: Article) {
    this.articleService.openPdf(article);
  }

  public onClickTag(tag: Tag): void {
    const active = this.tagsActivity.get(tag.name)
    this.tagsActivity.set(tag.name, !active);
  }

  public isActive(tag: Tag): boolean {
    return this.tagsActivity.get(tag.name);
  }

}
