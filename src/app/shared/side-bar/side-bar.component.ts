import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthFireServiceService } from '../../services/providers/auth-fire-service.service';
import { profileStorage } from '../../models/ProfileStorage';
import { ShowContentService } from 'src/app/services/providers/show-content.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {


  Stablishment: String = "KFC";
  headquarters: String = "Galerías";

  // // to show menu
  // options = false;
  // principal = false;
  // reports = false;
  // pqrs = false;

  profile:profileStorage;

  constructor(public firebaseservise: AuthFireServiceService, private showmenu: ShowContentService) {
    
    // get profile localstorage
    // let profile = JSON.parse(localStorage.getItem('profile'));
    // this.asigVariables(profile);
    this.profile = this.showmenu.showMenus();

  }

  ngOnInit() {

    $(document).ready(function () {


      $('#dismiss, .overlay').on('click', function () {
        // hide sidebar
        $('#sidebar').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
      });

      $('#sidebarCollapse').on('click', function () {
        // open sidebar
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
    });

  }

  signOut() {
    console.log("cerrar sesion");
    this.firebaseservise.signOut();
    localStorage.removeItem('profile');
  }

  // asigVariables(profile: any) {

  //   this.Stablishment = profile['nameAllie'];
  //   this.headquarters = profile['nameHeadquarter'];

  //   switch (profile['nameCharge']) {

  //     case 'cajero' || 'administradorPDv' || 'GerenteGeneral':
  //       this.principal = true;

  //     case 'asesor':
  //       this.pqrs = true;

  //     case 'contador':
  //       this.reports = true;

  //     case 'administradorTIFI':
  //       this.options = true;
  //   }
  // }

}
