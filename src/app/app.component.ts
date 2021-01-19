import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isLogedIn: boolean;
  public userName: string;
  public userPictureUrl: string;
  public isAdmin: boolean = false;

  private subscription: Subscription;
  private _currentLanguage: string;

  private set currentLanguage(value: string) {
    this._currentLanguage = value;
    this.translate.setDefaultLang(this._currentLanguage);
  }

  private get currentLanguage(): string {
    return this._currentLanguage;
  }

  constructor(private accountService: AccountService, private translate: TranslateService) {
    let language = localStorage.getItem('lang');
    if (!language) {
      language = 'en';
    }
    this.currentLanguage = language;
  }

  async ngOnInit() {
    this.subscription = this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      this.isLogedIn = logedin;

      if (logedin) {
        const user = this.accountService.getUser();
        this.userName = user.name;
        this.isAdmin = user.isAdmin;
        this.userPictureUrl = user.pictureUrl;
      } else {
        this.userName = "";
        this.userPictureUrl = "";
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public async logout(): Promise<any> {
    return this.accountService.logout();
  }

  public async logIn(): Promise<void> {
    await this.accountService.login();
  }

  public changeLanguage(): void {
    if (this.currentLanguage === 'uk') {
      this.currentLanguage = 'en';
    } else {
      this.currentLanguage = 'uk';
    }
    localStorage.setItem('lang', this.currentLanguage);
  }
}
