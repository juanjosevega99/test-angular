import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfilesService } from '../../services/profiles.service';
import { Profiles } from 'src/app/models/Profiles';


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

  constructor(public authentication: AuthFireServiceService, public route: Router, private spinner: NgxSpinnerService,
    private serviceProfile: ProfilesService) { }

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

        let userlogged = res.user;

        // console.log(res);
        this.serviceProfile.getProfileById(userlogged.uid).subscribe((profileservice) => {

          let profile = {
            id: profileservice['_id'],
            idAllies: profileservice.idAllies,
            nameAllie: profileservice.nameAllie,
            idHeadquarter: profileservice.idHeadquarter,
            nameHeadquarter: profileservice.nameHeadquarter,
            nameCharge: profileservice.nameCharge,

          }

          localStorage.setItem('profile', JSON.stringify( profile ));

          this.spinner.hide();

          switch (profileservice.nameCharge.toLocaleLowerCase()) {

            case 'cajero':
              this.route.navigate(['main/principal-orders']);

            case 'asesor':
              this.route.navigate(['main/pqrList']);

            default:
              this.route.navigate(['main/options']);
          }

        })

      }).catch(err => {

        this.spinner.hide();
        this.signError = false;

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
