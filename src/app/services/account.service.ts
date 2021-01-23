import { Injectable, Injector } from '@angular/core';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { ApiService } from './api.service';
import { SetLanuageRequest, User } from '../models/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private loginStateChangeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loginStateChanged$: Observable<boolean> = this.loginStateChangeSubject.asObservable();

  public defaultLanguage: string = 'en';

  constructor(private api: ApiService, private authService: AuthService, private injector: Injector,
    private translate: TranslateService) {

    window.addEventListener("storage", this.storageEventListener.bind(this));

    const token = this.getToken();
    if (token) {
      this.loginStateChangeSubject.next(true);
    } else {
      this.loginStateChangeSubject.next(false);
    }
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      if (event.key == 'token' && event.newValue == null) {
        this.removeToken();
      }
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
      if (this.getLanguage()) {
        this.translate.setDefaultLang(this.getLanguage());
      } else {
        this.translate.setDefaultLang(this.defaultLanguage);
      }

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

  public authenticationFailedHandler(returnUrl: string = ""): void {
    this.removeToken();
    const router = this.injector.get(Router);
    router.navigate(['greeting']);
  }

  public async setLanguage(language: string): Promise<void> {
    const changed = this.getLanguage() !== language;
    localStorage.setItem('lang', language);
    this.translate.setDefaultLang(language);

    if (this.isLogedIn() && changed) {
      await this.api.setLanguage({ language: language });
    }
  }

  public getLanguage(): string {
    return localStorage.getItem('lang');
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
    this.loginStateChangeSubject.next(true);
  }

  private removeToken() {
    localStorage.removeItem('token');
    this.loginStateChangeSubject.next(false);
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  private setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.language) {
      localStorage.setItem('lang', user.language);
    }
  }

  private removeUser() {
    localStorage.removeItem('user');
  }
}
