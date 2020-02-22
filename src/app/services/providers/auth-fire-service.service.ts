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

  constructor() { }
}
