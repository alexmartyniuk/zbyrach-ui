import { Component, OnInit } from '@angular/core';
import { Mailing, ScheduleType } from '../../models/mailing';
import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-mailing',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.css']
})
export class MailingSettingsComponent implements OnInit {
  public userEmail: string;

  public numberOfArticlesSlider: number = 0;
  public numberOfArticlesSliderOptions: Options;
  public scheduleSlider: number = 0;
  public scheduleSliderOptions: Options;

  private numberOfArticlesValues: { [id: number]: number; } = {
    1: 0,
    2: 5,
    3: 10,
    4: 20,
  };

  private scheduleTypeValues: { [id: number]: ScheduleType; } = {
    1: ScheduleType.Never,
    2: ScheduleType.EveryDay,
    3: ScheduleType.EveryWeek,
    4: ScheduleType.EveryMonth,
  };

  private scheduleValues: { [id: number]: string; } = {
    1: "Ніколи",
    2: "Раз на день",
    3: "Раз на тиждень",
    4: "Раз в місяць",
  };

  constructor(private router: Router, private api: ApiService, private accountService: AccountService) {
    this.numberOfArticlesSliderOptions = {
      floor: 1,
      ceil: 4,
      step: 1,
      showTicks: true,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getLegend: (value: number): string => {
        return this.numberOfArticlesValues[value].toString();
      }
    };

    this.scheduleSliderOptions = {
      floor: 1,
      ceil: 4,
      step: 1,
      showTicks: true,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getLegend: (value: number): string => {
        return this.scheduleValues[value];
      }
    }
  }

  async ngOnInit() {
    this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      if (logedin) {
        this.userEmail = this.accountService.getUser().email;

        const settings = await this.api.getMyMailingSettings();
        this.numberOfArticlesSlider = this.getKeyByValue(this.numberOfArticlesValues, settings.numberOfArticles);
        this.scheduleSlider = this.getKeyByValue(this.scheduleTypeValues, settings.scheduleType);
      } else {
        this.router.navigate(['/greeting']);
      }
    });
  }

  async save() {
    const settings = <Mailing>{
      numberOfArticles: this.getValueByKey(this.numberOfArticlesValues, this.numberOfArticlesSlider),
      scheduleType: Number(this.scheduleSlider)
    };

    await this.api.setMyMailingSettings(settings);

    this.router.navigate(['/']);
  }

  public numberOfArticles(): number {
    return this.getValueByKey(this.numberOfArticlesValues, this.numberOfArticlesSlider);
  };

  public schedule(): string {
    return this.getValueByKey(this.scheduleValues, this.scheduleSlider);
  };

  private getKeyByValue(dict: { [id: number]: number; }, value: any): number {
    for (let key in dict) {
      if (dict[key] == value) {
        return parseInt(key);
      }
    }
  }

  private getValueByKey(dict: { [id: number]: any; }, value: any): any {
    return dict[value];
  }

}
