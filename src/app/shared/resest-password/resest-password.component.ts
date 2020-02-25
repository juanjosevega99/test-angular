import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';

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
  restoresuccess = false;
  restoreunsuccess = false;

  constructor( public firebaseservice: AngularFireAuth, public router: Router, public route: ActivatedRoute ) {

    this.newpassword = new FormGroup({
      // '', [Validators.required, Validators.pattern("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}") ]
      'password' : new FormControl('', [Validators.required, Validators.pattern("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}") ]),
      'verifypassword' : new FormControl()
      // '', 
    })

    this.newpassword.controls['verifypassword'].setValidators([ 
      Validators.required, 
      this.noEqual.bind(this.newpassword) 
    ] )  

   }

  ngOnInit() {
    
  }

  send(){
    // console.log(this.newpassword);
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

  noEqual( control: FormControl ): { [ s:string ]: boolean } {
    let newpass:any = this

    if ( control.value !== newpass.get('password').value ){
      return {
        equal:true
      }
    }

    return null;

  }


  changeNewPass(){

    const code = this.route.snapshot.queryParams['oobCode'];
    this.firebaseservice.auth.confirmPasswordReset(code, this.newpassword.get('verifypassword').value )
    .then(res => {
      this.restoresuccess = true;
      console.log(res);
    }).catch(err=> {console.log(err)
    this.restoreunsuccess=true}
    )

  }


}
