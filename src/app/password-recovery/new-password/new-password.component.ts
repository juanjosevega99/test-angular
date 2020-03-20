import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth"; 
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PasswordServiceService } from '../recovery-service/password-service.service'

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit{
  
  password:string;
  verifyPassword:string;
  
  constructor(private route: ActivatedRoute, private firebase: AngularFireAuth, private router : Router) { }

  ngOnInit() {
  }

  resetPassword(){
    const code = this.route.snapshot.queryParams['oobCode'];
    this.firebase.auth.confirmPasswordReset(code, this.password).then((res)=> {this.router.navigate(['/login'])})
    .catch((err)=> {console.log(err)})
  }

}
