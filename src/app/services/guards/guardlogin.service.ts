import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardloginService implements CanActivate {

  constructor() {
  }

  canActivate( next:ActivatedRouteSnapshot, state: RouterStateSnapshot ) {

    let profilest = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null;

    if (profilest) {
      
      return true;

    } else {

      return false;
    }
  }
}
