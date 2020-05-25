import { Injectable, Injector } from '@angular/core';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { ApiService } from './api.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private loginStateChangeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loginStateChanged$: Observable<boolean> = this.loginStateChangeSubject.asObservable();

  constructor(private api: ApiService, private authService: AuthService, private injector: Injector) {
    const token = this.getToken();
    if (token) {
      this.loginStateChangeSubject.next(true);
    } else {
      this.loginStateChangeSubject.next(false);
    }
  }

  public async login(): Promise<User> {
    try {
      const googleResponse = await this.authService
        .signIn(GoogleLoginProvider.PROVIDER_ID);

      const response = await this.api
        .login(googleResponse.idToken);

      this.setUser(response.user);
      this.setToken(response.token);

      return Promise.resolve(response.user);
    } catch (e) {
      this.removeToken();
      this.removeUser();

      return Promise.reject(e);
    }
  }

  public async logout(): Promise<any> {
    try {
      await this.authService.signOut();
      await this.api.logout();

      this.removeToken();
      this.removeUser();

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public isLogedIn(): boolean {
    return this.loginStateChangeSubject.value;
  }

  public getToken(): string {
    return sessionStorage.getItem('token');
  }

  public authenticationFailedHandler(returnUrl: string = ""): void {
    this.removeToken();
    const router = this.injector.get(Router);
    router.navigate(['greeting']);
  }

  private setToken(token: string) {
    sessionStorage.setItem('token', token);
    this.loginStateChangeSubject.next(true);
  }

  private removeToken() {
    sessionStorage.removeItem('token');
    this.loginStateChangeSubject.next(false);
  }

  public getUser(): User {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  private setUser(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  private removeUser() {
    sessionStorage.removeItem('user');
  }
}
