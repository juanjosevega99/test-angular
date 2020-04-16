import { Component, OnInit } from '@angular/core';
import { AuthFireServiceService } from '../../../../services/providers/auth-fire-service.service';
import { Router } from '@angular/router';
import { ShowContentService } from 'src/app/services/providers/show-content.service';
import { profileStorage } from 'src/app/models/ProfileStorage';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  user:boolean;
  profile: profileStorage = new profileStorage;

  constructor( public firebaseservice: AuthFireServiceService, public route:Router, private showmenu: ShowContentService ) {

    this.user = this.firebaseservice.isLoged();

    if (this.user){
      console.log("usuario logeado", this.user);
      
    }else{
      console.log("usuario no logeado");
      // this.route.navigate(['log']);
    }

    this.profile = this.showmenu.showMenus();

   }

  ngOnInit() {
    console.log(this.profile);
    

  }

}
