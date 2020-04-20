import { Injectable } from '@angular/core';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(private accountService: AccountService) { }

  public async Init(): Promise<void> {
    //do something on App start
  }
}
