import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize} from 'rxjs/operators';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {

  private activeRequests = 0;

  constructor(private uiService: UiService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.activeRequests === 0) {
      this.uiService.showSpinner();
    }

    this.activeRequests++;

    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0){
          this.uiService.hideSpinner();
        }
      })
    );
  }
}
