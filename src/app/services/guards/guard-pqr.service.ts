import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardPqrService implements CanActivate{

  constructor() {
  }

  canActivate() {

    let profilest = localStorage.getItem('tifi_user') ? JSON.parse(localStorage.getItem('tifi_user')) : {nameCharge:''};

    if (profilest.role.name == "Cajero" ||
        profilest.role.name == "administradorpdv" ||
        profilest.role.name == "gerentegeneral"||
        profilest.role.name == "Administrator"||
        profilest.role.name == "asesor") {

      return true;

    } else {

      return false;
    }
  }
}
