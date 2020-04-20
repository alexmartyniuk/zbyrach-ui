import { Injectable } from '@angular/core';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { ApiService } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private api: ApiService, private authService: AuthService) { }

  public async login(): Promise<User> {
    try {
      const googleResponse = await this.authService
        .signIn(GoogleLoginProvider.PROVIDER_ID);

      const response = await this.api.Login(googleResponse.idToken);

      this.setToken(response.token);
      this.setUser(response.user);

      return Promise.resolve(response.user);
    } catch (e) {
      this.removeToken();
      this.RemoveUser();

      return Promise.reject(e);
    }
  }

  public async logout(): Promise<any> {
    try {
      await this.authService.signOut();
      await this.api.Logout();

      this.removeToken();
      this.RemoveUser();

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

  private RemoveUser() {
    sessionStorage.removeItem('user');
  }
}
