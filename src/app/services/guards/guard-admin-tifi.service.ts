import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardAdminTifiService implements CanActivate {


  constructor() {}

  canActivate() {
    
    let profilest = localStorage.getItem('tifi_user') ? JSON.parse(localStorage.getItem('tifi_user')) : {nameCharge:''};


    if (profilest.role.name === "Administrator" || profilest.role.name === "Domiciliario") {

      return true;

    } else {

      return false;
    }
  }
}
