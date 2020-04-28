import { Component} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';


@Component({
  selector: 'app-login-forget',
  templateUrl: './login-forget.component.html',
  styleUrls: ['./login-forget.component.scss', '../login/login.component.scss']
})
export class LoginForgetComponent{

  // elemento para manejar la forma del componente
  forma:FormGroup;
  emailinvalid=false;
  emailsuccess=false;

  constructor( public firebaseservice: AuthFireServiceService ) {

    this.forma = new FormGroup({
      //parametros
      'email': new FormControl('', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])
      
    })
  }

  forgetPass(){
      
      this.firebaseservice.forgetPassword(this.forma.get('email').value)
      .then(res => {
        this.emailsuccess = true;
        this.emailinvalid = false;
      }
      ).catch(err =>{

        if(err.code == 'auth/user-not-found'){
          this.emailinvalid = true;
        }
      } 
      );
  }

}
