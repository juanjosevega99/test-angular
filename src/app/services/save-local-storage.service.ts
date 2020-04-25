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
  saveLocalStorageIdCoupon(idCoupon: string) {
    localStorage.setItem("idCoupon", idCoupon)
  }

  getLocalStorageIdCoupon() {
    let idCoupon = localStorage.getItem("idCoupon")
    return idCoupon;
  }

  saveLocalStorageIdPromotion(idPromotion : string){
    localStorage.setItem("idPromotion",idPromotion )
  }

  getLocalStorageIdPromotion(){
    let idPromotion = localStorage.getItem("idPromotion")
    return idPromotion;
  }

}
