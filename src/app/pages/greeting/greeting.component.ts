import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {

  public isLogedIn: boolean = false;
  public isLoading: boolean = false;
  public userName: string;

  constructor(private accountService: AccountService, private notificationService: NotificationService) { }

  async ngOnInit() {
    this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      this.isLogedIn = logedin;

      if (logedin) {
        const user = this.accountService.getUser();
        this.userName = user.name;
      } else {
        this.userName = "";
      }
    });
  }

  public async logIn(): Promise<void> {
    try {
      this.isLoading = true;
      await this.accountService.login();

      this.notificationService.showSuccessMessage("Ви успішно увійшли!");
    } finally {
      this.isLoading = false;
    }
  }
}
