import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss', '../login/login.component.scss']
})
export class LoginFormComponent implements OnInit {

  email: string;
  pass: string;
  signError: boolean;

  seepass: boolean = false;
  Typetext = 'password';

  loading: boolean = false;

  constructor(public authentication: AuthFireServiceService, public route: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.signError = true;

    // if( this.authentication.user ){
    //   this.route.navigate(['options']);
    // }
  }

  login() {
    this.spinner.show();
    this.authentication.login(this.email, this.pass)
      .then(res => {
        console.log(res);
        this.spinner.hide();
        this.route.navigate(['main']);

      }).catch(err => {
        this.signError = false;
        this.spinner.hide();
      }
      );
    this.email = '';
    this.pass = '';

  }

  seepassword() {
    this.seepass = !this.seepass;

    if (!this.seepass) {
      this.Typetext = 'password'
    } else {
      this.Typetext = 'text'
    }
  }

}
