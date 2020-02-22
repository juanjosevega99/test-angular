import { Injectable } from '@angular/core';
//firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthFireServiceService {

  user: Observable< firebase.User >;

  constructor( private firebaseAuth: AngularFireAuth ) {
    this.user = this.firebaseAuth.authState;
   }

   //singIn
   login( email:string, password: string ): Promise<firebase.auth.UserCredential>{

    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
   
   }

   //sing Out (cerrar sesion)

   signOut(): Promise<void> {

     return this.firebaseAuth.auth.signOut();

   }


}
