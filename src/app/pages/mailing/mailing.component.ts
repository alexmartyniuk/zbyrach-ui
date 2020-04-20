import { Component, OnInit } from '@angular/core';
import { Mailing, ScheduleType } from '../../models/mailing';
import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-mailing',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.css']
})
export class MailingSettingsComponent implements OnInit {
  private readonly NUMBER_OF_ARTICLES_DEFAULT: number = 5;
  private readonly SCHEDULE_TYPE_DEFAULT: ScheduleType = ScheduleType.EveryWeek;

  public NumberOfArticles: number = this.NUMBER_OF_ARTICLES_DEFAULT;
  public Schedule: ScheduleType = this.SCHEDULE_TYPE_DEFAULT;
  public ScheduleValues: { key: number, value: string; }[];

  constructor(private api: ApiService, private accountService: AccountService) {
    this.ScheduleValues = [
      { key: 2, value: "Every Day" },
      { key: 3, value: "Every Week" },
      { key: 4, value: "Every Month" },
      { key: 1, value: "Never" },
    ];
  }

  async ngOnInit() {
    const settings = await this.api.GetMyMailingSettins();
    this.NumberOfArticles = settings.numberOfArticles;
    this.Schedule = settings.scheduleType;
  }

  async Save() {
    const settings = <Mailing>{
      numberOfArticles: this.NumberOfArticles,
      scheduleType: Number(this.Schedule)
    };

    await this.api.SetMyMailingSettins(settings);
  }

}
