import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public accountService: AccountService, public router: Router) { }

  canActivate(): boolean {
    if (!this.accountService.isLogedIn()) {
      this.router.navigate(['greeting']);
      return false;
    }
    return true;
  }
}
