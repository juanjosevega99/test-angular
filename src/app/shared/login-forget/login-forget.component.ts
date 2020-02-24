import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';


@Component({
  selector: 'app-login-forget',
  templateUrl: './login-forget.component.html',
  styleUrls: ['./login-forget.component.scss', '../login/login.component.scss']
})
export class LoginForgetComponent implements OnInit {

  // elemento para manejar la forma del componente
  forma:FormGroup;
  emailinvalid:boolean;
  emailsuccess:boolean;

  constructor( public firebaseservice: AuthFireServiceService ) {
    this.emailinvalid = false;
    this.emailsuccess=false;

    this.forma = new FormGroup({
      //parametros
      'email': new FormControl('', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])
      
    })
  }

  ngOnInit() {
  }

  send(){ 
    console.log(this.forma)
    console.log(this.forma.value)
  }

  forgetPass(){
      console.log(this.forma.get('email').value );
      
      this.firebaseservice.forgetPassword(this.forma.get('email').value)
      .then(res => {
        console.log(res);
        this.emailsuccess = true;
      }
      ).catch(err =>{

        console.log(err.code)
        if(err.code == 'auth/user-not-found'){
          this.emailinvalid = true;
        }
      } 
      );
  }

}
