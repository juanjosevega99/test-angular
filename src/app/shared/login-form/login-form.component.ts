import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms' 
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss', '../login/login.component.scss']
})
export class LoginFormComponent implements OnInit {

  email:string;
  pass:string;
  signError:boolean;

  seepass:boolean = false;  
  Typetext = 'password';

  constructor( public authentication: AuthFireServiceService, public route: Router ) { }

  ngOnInit() {
    this.signError = true;
    
    if( this.authentication.user ){
      this.route.navigate(['options']);
    }
  }

  login(){
    
    this.authentication.login(this.email, this.pass)
    .then(res => {

      this.route.navigate(['log']);

    }).catch(err => {
      this.signError = false;
        
      }
    );
    this.email = ''; 
    this.pass = '';

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
