import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { ScheduleType } from 'src/app/models/mailing';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {

  public isLogedIn: boolean = false;
  public userName: string;
  public tagsText: string = "";
  public scheduleText: string = "";

  private scheduleValues: { [id: number]: string; } = {
    0: "невідомо",
    1: "ніколи",
    2: "раз на день",
    3: "раз на тиждень",
    4: "раз на місяць",
  };
  private returnUrl: string;
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.subscription = this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      this.isLogedIn = logedin;

      if (logedin) {
        const user = this.accountService.getUser();
        this.userName = user.name;

        const settingSummary = await this.api.getSettingsSummary();
        this.tagsText = this.getTagsText(settingSummary.numberOfTags);
        this.scheduleText = this.getScheduleText(settingSummary.scheduleType);

        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.userName = "";
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getTagsText(numberOfTags: number): string {
    if (numberOfTags % 10 == 1 && (numberOfTags > 20 || numberOfTags < 10)) {
      return `за ${numberOfTags} тегом`;
    } else {
      return `за ${numberOfTags} тегами`;
    }
  }

  private getScheduleText(scheduleType: ScheduleType): string {
    return this.scheduleValues[scheduleType];
  }

  public async logIn(): Promise<void> {
    await this.accountService.login();
  }
}
