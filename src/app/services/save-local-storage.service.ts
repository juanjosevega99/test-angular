import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveLocalStorageService {

  constructor() { }

  saveLocalStorageIdAlly(allyId: string) {
    localStorage.setItem("allyId", allyId)
  }

  getLocalStorageIdAlly() {
    let allyId = localStorage.getItem("allyId")
    return allyId;
  }

  saveLocalStorageIdHeadquarter(headquarterId: string) {
    localStorage.setItem("headquarterId", headquarterId)
  }

  getLocalStorageIdHeadquarter() {
    let headquarterId = localStorage.getItem("headquarterId")
    return headquarterId;
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
  saveLocalStorageIdTyc(idTyc: string) {
    localStorage.setItem("idTyc", idTyc)
  }

  getLocalStorageIdTyc() {
    let idTyc = localStorage.getItem("idTyc")
    return idTyc;
  }
  saveLocalStorageIdFrequentQuestion(idFrequentQuestion: string) {
    localStorage.setItem("idFrequentQuestion", idFrequentQuestion)
  }

  getLocalStorageIdFrequentQuestion() {
    let idFrequentQuestion = localStorage.getItem("idFrequentQuestion")
    return idFrequentQuestion;
  }

}
