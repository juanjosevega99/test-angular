import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfilesService } from '../../services/profiles.service';
import { Profiles } from 'src/app/models/Profiles';
import Swal from 'sweetalert2';


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
            permis: profileservice.permis

          }

          localStorage.setItem('profile', JSON.stringify( profile ));

          this.spinner.hide();

          console.log(profileservice.nameCharge.toLocaleLowerCase());
          switch (profileservice.nameCharge.toLocaleLowerCase()) {
            
            case 'cajero': 
            case 'administradorpdv': 
            case 'gerentegeneral':
              this.route.navigate(['main/principal-orders']);
              break;

            case 'asesor':
              this.route.navigate(['main/pqrList']);
              break;

            case 'contador':
              this.route.navigate([ '/main', 'reportGenerator' ]);
              break;

            default:
              this.route.navigate(['main/options']);
              break;
          }

        }, err =>{
          this.spinner.hide();
          Swal.fire(
            "Comprueba tu conexión a internet"
          )
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
