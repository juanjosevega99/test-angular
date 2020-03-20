import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { AngularFireAuth } from "@angular/fire/auth";  
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  email:string="";
  password:string="";

  constructor( private fauth: AngularFireAuth, private spinner :NgxSpinnerService,private rputer: Router) { }

  login(){
    /* this.spinner.show() */
   this.fauth.auth.signInWithEmailAndPassword(this.email,this.password).then(
     (response)=> {
      this.spinner.hide(); 
      this.rputer.navigate(['principal']);
    }

   ).catch((err)=> {
    this.spinner.hide()   
    alert("An error has ocurred")})
  }

  ngOnInit() {
  }

}
