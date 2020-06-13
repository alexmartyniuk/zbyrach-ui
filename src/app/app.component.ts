import { Component, OnInit } from '@angular/core';
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

  constructor(private accountService: AccountService) {

  }

  async ngOnInit() {
    this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      this.isLogedIn = logedin;

      if (logedin) {
        const user = this.accountService.getUser();
        this.userName = user.name;
        this.userPictureUrl = user.pictureUrl;
      } else {
        this.userName = "";
        this.userPictureUrl = "";
      }
    });
  }

  public async logout(): Promise<any> {
    return this.accountService.logout();
  }

  public async logIn(): Promise<void> {
    await this.accountService.login();
  }

}
