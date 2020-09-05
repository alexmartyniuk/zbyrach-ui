import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/artilcle.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  
  constructor(private articleService: ArticleService) { }

  ngOnInit() {
  }

  public openPdf(article: Article) {
    this.articleService.openPdf(article);
  }

}
