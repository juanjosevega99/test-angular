import { Component, OnInit } from '@angular/core';
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfilesService } from '../../services/profiles.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss', '../login/login.component.scss']
})
export class LoginFormComponent implements OnInit {

  email: string;
  pass: string;
  signError = false;

  seepass: boolean = false;
  Typetext = 'password';

  loading: boolean = false;

  constructor(public authentication: AuthFireServiceService, public route: Router, private spinner: NgxSpinnerService,
    private serviceProfile: ProfilesService) { }

  ngOnInit() {
    // this.signError = true;

    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      this.navigateProfile(profile);
    }
  }

  login() {
    this.spinner.show();
    this.authentication.login(this.email, this.pass)
      .then(res => {

        let userlogged = res.user;

        // console.log(res);
        this.serviceProfile.getProfileById(userlogged.uid).subscribe((profileservice) => {

          // console.log("en el login", profileservice);          
          if (profileservice) {

            let profile = {
              id: profileservice['_id'],
              idAllies: profileservice.idAllies,
              nameAllie: profileservice.nameAllie,
              idHeadquarter: profileservice.idHeadquarter,
              nameHeadquarter: profileservice.nameHeadquarter,
              nameCharge: profileservice.nameCharge,
              permis: profileservice.permis,
              photo: profileservice.photo,
              email: profileservice.email
            }

            localStorage.setItem('profile', JSON.stringify(profile));

            this.spinner.hide();

            // console.log(profileservice.nameCharge.toLocaleLowerCase());
            this.navigateProfile(profileservice);

          } else {
            this.spinner.hide();
            Swal.fire({ title: "No es posible iniciar sesión, por favor comunicate con soporte",
            icon:'warning'
          })
          }

        }, err => {
          this.spinner.hide();
          Swal.fire(
            "Comprueba tu conexión a internet"
          )
        })

      }).catch(err => {

        this.spinner.hide();
        this.signError = true;

      }
      );

    this.email = '';
    this.pass = '';

  }

  navigateProfile(profileservice) {
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
        this.route.navigate(['/main', 'reportGenerator']);
        break;

      default:
        this.route.navigate(['main/options']);
        break;
    }

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
