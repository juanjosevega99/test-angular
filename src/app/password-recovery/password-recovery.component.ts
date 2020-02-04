import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth"; 
import * as firebase from "firebase"; 
import { PasswordServiceService } from './recovery-service/password-service.service';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  email:string = "";

  constructor( private afAuth: PasswordServiceService ) { }

  resetPassword() { 
    if (!this.email) { 
      alert('Type in your email first'); 
    }
    this.afAuth.resetPasswordInit(this.email) 
    .then(
      () => alert('A password reset link has been sent to your email'+
      this.email), 
      (rejectionReason) => alert(rejectionReason)) 
    .catch(e => alert('An error occurred while attempting to reset your password')); 
  }

  ngOnInit() {
  }

}
