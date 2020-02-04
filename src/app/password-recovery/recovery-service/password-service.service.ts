import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth"; 
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class PasswordServiceService {

  constructor(private afAuth: AngularFireAuth) { 
  }

  getAuth() { 
    return this.afAuth.auth; 
  } 

  /** 
   * Initiate the password reset process for this user 
   * @param email email of the user 
   */ 
  resetPasswordInit(email: string) { 
    return this.afAuth.auth.sendPasswordResetEmail(
      email, 
      { url: 'http://localhost:4200/auth' }); 
    } 
}
