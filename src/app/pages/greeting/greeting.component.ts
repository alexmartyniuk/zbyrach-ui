import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { ScheduleType } from 'src/app/models/mailing';

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

  constructor(private accountService: AccountService, private api: ApiService) { }

  async ngOnInit() {
    this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      this.isLogedIn = logedin;

      if (logedin) {
        const user = this.accountService.getUser();
        this.userName = user.name;
        
        const settingSummary = await this.api.getSettingsSummary();
        this.tagsText = this.getTagsText(settingSummary.numberOfTags);
        this.scheduleText = this.getScheduleText(settingSummary.scheduleType);
      } else {
        this.userName = "";
      }
    });
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
