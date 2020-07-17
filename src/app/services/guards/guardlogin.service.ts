import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardloginService implements CanActivate {

  constructor() {
  }

  canActivate( next:ActivatedRouteSnapshot, state: RouterStateSnapshot ) {

    let profilest = localStorage.getItem('tifi_user') ? JSON.parse(localStorage.getItem('tifi_user')) : null;

    if (profilest) {
      
      return true;

    } else {

      return false;
    }
  }
}
