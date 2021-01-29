import { Component, OnInit } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ArticleService } from 'src/app/services/artilcle.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.css']
})
export class ViewPdfComponent implements OnInit {

  pdfLoaded = false;
  pdfSrc: string;
  isError: boolean;
  pageCurrent = 0;
  pagesCount = 0;
  articleId: string;
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private articleService: ArticleService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('articleId');
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.pdfSrc = this.apiService.getArticleInlinePdfUrl(this.articleId, this.userId);
  }

  onLoadComplete(pdf: PDFDocumentProxy) {
    this.pdfLoaded = true;
    this.pagesCount = pdf.numPages;
  }

  onError(error: any) {
    this.isError = true;
    this.notificationService.showErrorMessage(this.translate.instant('General.ServerError'));
  }

  public openPdf(articleId: string) {
    this.articleService.openPdf(Number(articleId));
  }
}
