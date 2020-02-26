import { Component, OnInit } from '@angular/core';
import { AuthFireServiceService } from '../../../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  user:boolean;

  constructor( public firebaseservice: AuthFireServiceService, public route:Router ) {

    this.user = this.firebaseservice.isLoged();

    if (this.user){
      console.log("usuario logeado", this.user);
      
    }else{
      console.log("usuario no logeado");
      // this.route.navigate(['log']);

    }

   }

  ngOnInit() {

  }

}
