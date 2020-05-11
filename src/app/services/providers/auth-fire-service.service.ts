import { Injectable } from '@angular/core';
//firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthFireServiceService {

  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, private route: Router) {
    this.user = this.firebaseAuth.authState;
  }

  // register/ Sign up with email/password
  SignUp(email:string, password:string) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  //singIn
  login(email: string, password: string): Promise<firebase.auth.UserCredential> {

    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);

  }

  //sing Out (cerrar sesion)
  signOut() {

    this.firebaseAuth.auth.signOut()
      .then(res => this.route.navigate(['log'])
      ).catch(err => {
      }
      );
  }

  // Recuperar contraseña
  forgetPassword(email): Promise<void> {
    return this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  //user is loged

  isLoged(): boolean {

    firebase.auth().onAuthStateChanged(user => {

      if (user) {
        return true;

      } else {
        return false;
      }

    })
    return false;
  }


}
