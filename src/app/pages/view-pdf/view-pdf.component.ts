import { Component, OnInit } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UiService } from 'src/app/services/ui.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.css']
})
export class ViewPdfComponent implements OnInit {

  pdfLoaded: boolean = false;  
  pdfSrc: string;  
  isError: boolean;
  pageCurrent: number = 0;
  pagesCount: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private apiService: ApiService, 
    private uiService: UiService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    const articleId = this.route.snapshot.paramMap.get('articleId');
    const userId = this.route.snapshot.paramMap.get('userId');
    this.uiService.showSpinner();
    this.pdfSrc = this.apiService.getArticleInlinePdfUrl(articleId, userId);
  }

  onLoadComplete(pdf: PDFDocumentProxy) {
    this.pdfLoaded = true;
    this.uiService.hideSpinner();
    this.pagesCount = pdf.numPages;
  }

  onError(error: any) {
    this.isError = true;
    this.uiService.hideSpinner();
    this.notificationService.showErrorMessage("Помилка виконання запиту до серверу.");
  }
}
