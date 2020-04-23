import { Injectable, Injector } from '@angular/core';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { ApiService } from './api.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private api: ApiService, private authService: AuthService, private injector: Injector) { }

  public async login(): Promise<User> {
    try {
      const googleResponse = await this.authService
        .signIn(GoogleLoginProvider.PROVIDER_ID);

      const response = await this.api.login(googleResponse.idToken);

      this.setToken(response.token);
      this.setUser(response.user);

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
    return this.getToken() != null;
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
  }

  private removeToken() {
    sessionStorage.removeItem('token');
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
