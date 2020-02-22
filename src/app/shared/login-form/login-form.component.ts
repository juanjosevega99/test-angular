import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms' 

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss', '../login/login.component.scss']
})
export class LoginFormComponent implements OnInit {

  email:string = 'user1';
  pass:string;
  seepass:boolean = false;
  
  Typetext = 'password'

  constructor() { }

  ngOnInit() {
  }

  send(forma:NgForm ){
    console.log("formulario para postear");
    console.log(forma);
    console.log( "valor", forma.value );
  }

  seepassword(){
    this.seepass = !this.seepass;

    if(!this.seepass){
      this.Typetext = 'password'
    }else{
      this.Typetext='text'
    }
  }

}
