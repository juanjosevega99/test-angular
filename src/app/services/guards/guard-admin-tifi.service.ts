import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardAdminTifiService implements CanActivate {


  constructor() {
  }

  canActivate() {
    
    let profilest = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : {nameCharge:''};


    if (profilest.nameCharge.toLocaleLowerCase() == "administradortifi") {

      return true;

    } else {

      return false;
    }
  }
}
