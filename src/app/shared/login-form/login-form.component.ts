import { Component, OnInit } from '@angular/core';
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfilesService } from '../../services/profiles.service';
import { AuthService } from '../../services/auth.service'
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

  constructor( private authService:AuthService, public authentication: AuthFireServiceService, public route: Router, private spinner: NgxSpinnerService, private serviceProfile: ProfilesService) {}

  ngOnInit() {
    // this.signError = true;

    if (localStorage.getItem('tifi_user')) {
      let user = JSON.parse(localStorage.getItem('tifi_user'));
      console.log('PROFILE HERE', user)
      this.navigateRoles(user.role.name)
    }

  }


  async login() {
    this.spinner.show()

    try {
      const user:any = await this.authService.login(this.email, this.pass).toPromise()
      this.spinner.hide()

      console.log('USER', user)

      this.navigateRoles(user.role.name)

    } catch (error) {
      this.spinner.hide()
      this.signError = true
    }
  }

  navigateRoles(role) {
    switch (role) {

      case 'Cajero':
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
        console.log('entro correctamente')
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
