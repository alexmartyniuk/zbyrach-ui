import { Component, OnInit } from '@angular/core';
import { Mailing, ScheduleType } from '../../models/mailing';
import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mailing',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.css']
})
export class MailingSettingsComponent implements OnInit {
  public userEmail: string;
  public numberOfArticles: number = 0;
  public schedule: ScheduleType = ScheduleType.Never;
  public scheduleValues: { key: number, value: string; }[];

  constructor(private router: Router, private api: ApiService, private accountService: AccountService) {
    this.scheduleValues = [
      { key: 2, value: "Every Day" },
      { key: 3, value: "Every Week" },
      { key: 4, value: "Every Month" },
      { key: 1, value: "Never" },
    ];
  }

  async ngOnInit() {
    this.userEmail = this.accountService.getUser().email;
    
    const settings = await this.api.getMyMailingSettings();
    this.numberOfArticles = settings.numberOfArticles;
    this.schedule = settings.scheduleType;
  }

  async save() {
    const settings = <Mailing>{
      numberOfArticles: this.numberOfArticles,
      scheduleType: Number(this.schedule)
    };

    await this.api.setMyMailingSettings(settings);
    
    this.router.navigate(['/']);
  }

}
