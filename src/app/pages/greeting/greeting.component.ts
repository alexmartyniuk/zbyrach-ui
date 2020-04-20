import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {

  public isLogedIn: boolean = false;
  public userName: string;

  constructor(private accountService: AccountService) { }

  async ngOnInit() {
    if (this.accountService.isLogedIn()) {
      this.setLogedIn();
    }
  }

  public async logInWithGoogle(): Promise<void> {
    try {
      await this.accountService.login();
      this.setLogedIn();
    } catch (error) {
      console.log(error);
    }
  }

  private setLogedIn() {
    this.userName = this.accountService.getUser().name;
    this.isLogedIn = true;
  }
}
