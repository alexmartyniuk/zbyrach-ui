import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { AccountService } from './account.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private notificationService: NotificationService, private accountService: AccountService,
              private translate: TranslateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.notificationService.showErrorMessage(this.translate.instant('General.LoginAgain'));
          this.accountService.authenticationFailedHandler(req.url);
          return throwError('Request is not authorized.');
        } else
          if (error.status >= 500) {
            this.notificationService.showErrorMessage(this.translate.instant('General.ServerError'));
            return throwError('Error communicating to the server.');
          } else {
            return throwError(error);
          }
      })
    );
  }
}
