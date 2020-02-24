import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"

@Component({
  selector: 'app-resest-password',
  templateUrl: './resest-password.component.html',
  styleUrls: ['./resest-password.component.scss', '../login/login.component.scss']
})
export class ResestPasswordComponent implements OnInit {

  seepass:boolean=false;
  Typetext:string='password';
  seepass1:boolean=false;
  Typetext1:string='password';

  //forms
  newpassword: FormGroup;

  constructor() {

    this.newpassword = new FormGroup({
      'password' : new FormControl('', [Validators.required, Validators.pattern("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}") ]),
      'verifypassword' : new FormControl()
    })
   

   }

  ngOnInit() {
    
  }

  send(){

    console.log(this.newpassword);
  }

  seepassword(){
    this.seepass = !this.seepass;

    if(!this.seepass){
      this.Typetext = 'password'
    }else{
      this.Typetext='text'
    }
  }

  seepassword1(){
    this.seepass1 = !this.seepass1;

    if(!this.seepass1){
      this.Typetext1 = 'password'
    }else{
      this.Typetext1='text'
    }
  }

  //verificar password


}
