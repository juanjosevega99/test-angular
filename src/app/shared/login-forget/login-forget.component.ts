import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'


@Component({
  selector: 'app-login-forget',
  templateUrl: './login-forget.component.html',
  styleUrls: ['./login-forget.component.scss', '../login/login.component.scss']
})
export class LoginForgetComponent implements OnInit {

  // elemento para manejar la forma del componente
  forma:FormGroup;

  constructor() { 

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

}
