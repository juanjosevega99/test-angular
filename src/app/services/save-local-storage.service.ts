import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveLocalStorageService {

  constructor() { }

  saveLocalStorageIdAlly(idAlly: string) {
    localStorage.setItem("idAlly", idAlly)
  }

  getLocalStorageIdAlly() {
    let idAlly = localStorage.getItem("idAlly")
    return idAlly;
  }

  saveLocalStorageIdHeadquarter(idHeadquarter: string) {
    localStorage.setItem("idHeadquarter", idHeadquarter)
  }

  getLocalStorageIdHeadquarter() {
    let idHeadquarter = localStorage.getItem("idHeadquarter")
    return idHeadquarter;
  }


}
