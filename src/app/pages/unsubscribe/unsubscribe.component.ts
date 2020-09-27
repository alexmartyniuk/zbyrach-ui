import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {
  public user: User;
  public isError: boolean = false;
  public isDataLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private accountService: AccountService, private injector: Injector) { }

  async ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');

    try {
      this.user = await this.apiService.unsubscribe(token);
    }
    catch {
      this.isError = true;
    }

    this.isDataLoaded = true;
  }

  public async logIn(): Promise<void> {
    await this.accountService.login();
    const router = this.injector.get(Router);
    router.navigate(['greeting']);
  }

}
