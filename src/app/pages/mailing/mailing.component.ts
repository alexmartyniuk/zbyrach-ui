import { Component, OnDestroy, OnInit } from '@angular/core';
import { Mailing, ScheduleType } from '../../models/mailing';
import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { Options } from 'ng5-slider';
import { Subscription } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mailing',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.css']
})
export class MailingSettingsComponent implements OnInit, OnDestroy {
  public userEmail: string;
  public showContent = false;
  public numberOfArticlesSlider = 0;
  public numberOfArticlesSliderOptions: Options;
  public scheduleSlider = 0;
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
    1: 'Mailing.Never',
    2: 'Mailing.OncePerDay',
    3: 'Mailing.OncePerWeek',
    4: 'Mailing.OncePerMonth',
  };

  private loginStateSubscription: Subscription;
  private langChangeSubscription: Subscription;

  constructor(private router: Router, private api: ApiService, private accountService: AccountService,
              private translate: TranslateService) { }

  async ngOnInit() {
    this.langChangeSubscription = this.translate.onDefaultLangChange.subscribe((event: LangChangeEvent) => {
      this.initSliderOptions();
    });

    this.initSliderOptions();

    this.loginStateSubscription = this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      if (logedin) {
        this.userEmail = this.accountService.getUser().email;

        const settings = await this.api.getMyMailingSettings();
        this.numberOfArticlesSlider = this.getKeyByValue(this.numberOfArticlesValues, settings.numberOfArticles);
        this.scheduleSlider = this.getKeyByValue(this.scheduleTypeValues, settings.scheduleType);
        this.showContent = true;
      } else {
        this.router.navigate(['/greeting']);
      }
    });
  }

  ngOnDestroy() {
    this.loginStateSubscription.unsubscribe();
    this.langChangeSubscription.unsubscribe();
  }

  async save() {
    const settings = {
      numberOfArticles: this.getValueByKey(this.numberOfArticlesValues, this.numberOfArticlesSlider),
      scheduleType: Number(this.scheduleSlider)
    } as Mailing;

    await this.api.setMyMailingSettings(settings);

    this.router.navigate(['/']);
  }

  public numberOfArticles(): number {
    return this.getValueByKey(this.numberOfArticlesValues, this.numberOfArticlesSlider);
  }

  public schedule(): string {
    return this.getValueByKey(this.scheduleValues, this.scheduleSlider);
  }

  private getKeyByValue(dict: { [id: number]: number; }, value: any): number {
    for (const key in dict) {
      if (dict[key] === value) {
        return parseInt(key);
      }
    }
  }

  private getValueByKey(dict: { [id: number]: any; }, value: any): any {
    return dict[value];
  }

  private initSliderOptions(): void {
    this.scheduleSliderOptions = {
      floor: 1,
      ceil: 4,
      step: 1,
      showTicks: true,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getLegend: (value: number): string => {
        return this.translate.instant(this.scheduleValues[value]);
      }
    };

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
  }
}
