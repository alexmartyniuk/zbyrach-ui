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
  public numberOfArticles: number = 0;
  public numberOfArticlesOptions: Options;
  public schedule: ScheduleType = ScheduleType.Never;
  public scheduleOptions: Options;
  
  private numberOfArticlesValues: { [id: number] : string; } = {
    1: "0",
    2: "5",
    3: "10",
    4: "20",
  };

  private scheduleValues: { [id: number] : string; } = {
    1: "Ніколи",
    2: "Раз на день",
    3: "Раз на тиждень",
    4: "Раз в місяць",
  };

  constructor(private router: Router, private api: ApiService, private accountService: AccountService) {
    this.numberOfArticlesOptions = {
      floor: 1,
      ceil: 4,
      step: 1,
      showTicks: true,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getLegend: (value: number): string => { 
        return this.numberOfArticlesValues[value]; 
      }      
    };

    this.scheduleOptions = {
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
