import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ArticleService } from '../../services/artilcle.service';
import { Article } from '../../models/article';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignalrService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  public articlesOriginal: Article[] = [];
  public tagsActivity: Map<string, boolean> = new Map<string, boolean>();
  private loginStateSubscription: Subscription;
  private newArticleSubscription: Subscription;

  constructor(private router: Router,
              private accountService: AccountService,
              private articleService: ArticleService,
              private route: ActivatedRoute,
              public signalrService: SignalrService) { }

  public get articlesFound(): boolean {
    return this.articlesOriginal.length > 0;
  }

  async ngOnInit() {
    this.newArticleSubscription = this.signalrService.onNewArticle$.subscribe((article: Article) => {
      this.onNewArticle(article);
    });
    this.loginStateSubscription = this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      if (logedin) {
        this.loadArticles();
        this.signalrService.startConnection(this.accountService.getUser());
      } else {
        this.router.navigate(['/greeting']);
      }
    });
  }

  public get articles(): Article[] {
    return this.articlesOriginal.filter(a => {
      if ([...this.tagsActivity.values()].includes(true) === false) {
        return true;
      }
      return a.tags.filter(t => this.tagsActivity.get(t)).length > 0;
    });
  }

  public get isOnlyOneTag(): boolean {
    return this.tagsActivity.size === 1;
  }

  private async loadArticles() {
    const lastSent = this.route.snapshot.data?.lastSent;
    if (lastSent) {
      this.articlesOriginal = await this.articleService.getLastSentArticles();
    } else {
      this.articlesOriginal = await this.articleService.getArticlesForRead();
    }
    this.updateTags();
  }

  private updateTags(): void {
    this.tagsActivity.clear();
    this.articlesOriginal.forEach(a => {
      a.tags.forEach(t => {
        this.tagsActivity.set(t, false);
      });
    });
  }

  private onNewArticle(article: Article) {
    this.articlesOriginal.push(article);
    this.updateTags();
  }

  public onClickTag(tag: string): void {
    const active = this.tagsActivity.get(tag);
    this.tagsActivity.set(tag, !active);
  }

  ngOnDestroy() {
    this.loginStateSubscription.unsubscribe();
    this.newArticleSubscription.unsubscribe();
    this.signalrService.stopConnection(this.accountService.getUser());
  }
}
