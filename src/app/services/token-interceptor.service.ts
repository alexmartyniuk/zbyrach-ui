import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private accountService: AccountService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.accountService.getToken();
    let newHeaders = req.headers;
    if (token) {
      newHeaders = newHeaders.append('AuthToken', token);
    }

    const authRequest = req.clone({ headers: newHeaders });
    return next.handle(authRequest).catch((err: HttpErrorResponse) => {            
      if (err.status == 401) {        
        this.accountService.authenticationFailedHandler(req.url);        
      }
      return Observable.throw(err);
    });
  }
}
