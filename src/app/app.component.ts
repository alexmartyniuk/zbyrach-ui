import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public isLogedIn: boolean;
  public userName: string;
  public userPictureUrl: string;
  public isAdmin = false;

  private subscription: Subscription;

  constructor(private accountService: AccountService, private translate: TranslateService) {
    let lang = this.accountService.getLanguage();
    if (!lang) {
      lang = this.accountService.defaultLanguage;
    }
    this.translate.setDefaultLang(lang);
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
        this.userName = '';
        this.userPictureUrl = '';
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

  public async changeLanguage(): Promise<void> {
    if (await this.accountService.getLanguage() === 'uk') {
      await this.accountService.setLanguage('en');
    } else {
      await this.accountService.setLanguage('uk');
    }
  }
}
