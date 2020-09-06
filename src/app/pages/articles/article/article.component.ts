import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/artilcle.service';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;

  public user: User;
  
  constructor(private articleService: ArticleService, private accountService: AccountService) { 
    this.user = this.accountService.getUser();
  }

  ngOnInit() {
  }

  public openPdf(article: Article) {
    this.articleService.openPdf(article);
  }

}
