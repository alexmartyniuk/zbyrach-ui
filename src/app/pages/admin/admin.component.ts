import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public usersCount: number;
  public articlesCount: number;
  public tagsCount: number;
  public dbTotalRowsCount: number;
  public dbTotalSizeInBytes: string;
  public pdfsCount: number;
  public pdfsSize: string;

  model: NgbDateStruct;
  date: { year: number, month: number };

  private subscription: Subscription;

  constructor(private router: Router, private api: ApiService, private accountService: AccountService, private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.initDateModel();

    this.subscription = this.accountService.loginStateChanged$.subscribe(async (logedin) => {
      if (logedin) {
        await this.updateStatistic();
      } else {
        this.router.navigate(['/greeting']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public async cleanup(): Promise<any> {
    const daysCleanup = this.daysCleanup();
    if (daysCleanup < 1) {
      alert('Оберіть більший проміжок в часі. Мінімум = 1 день.');
    }

    await this.api.cleanup(daysCleanup);
    await this.updateStatistic();
  }

  private async updateStatistic() {
    const statistic = await this.api.getStatistic();
    this.usersCount = statistic.usersCount;
    this.articlesCount = statistic.articlesCount;
    this.tagsCount = statistic.tagsCount;
    this.dbTotalRowsCount = statistic.dbTotalRowsCount;
    this.dbTotalSizeInBytes = this.bytesToSize(statistic.dbTotalSizeInBytes);
    this.pdfsCount = statistic.pdfCashItemsCount;
    this.pdfsSize = this.bytesToSize(statistic.pdfCashDataSize);
  }

  private bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) { return '0 Byte'; }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  private daysCleanup(): number {
    const date1 = new Date();
    const date2 = new Date(this.model.year, this.model.month - 1, this.model.day);
    return Math.round((date1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
  }

  private initDateModel() {
    const now = new Date();
    now.setMonth(now.getMonth() - 3);
    this.model = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    };
  }
}
