import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardCAGService implements CanActivate {


  constructor() {
  }

  canActivate() {

    let profilest = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : {nameCharge:''};
    
    if (profilest.nameCharge.toLocaleLowerCase() == "cajero" ||
        profilest.nameCharge.toLocaleLowerCase() == "administradorpdv" ||
        profilest.nameCharge.toLocaleLowerCase() == "gerentegeneral"||
        profilest.nameCharge.toLocaleLowerCase() == "administradortifi") {
 
      return true;

    } else {
      return false;
    }
  }
}
