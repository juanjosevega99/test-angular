import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  Stablishment:String= "KFC";
  headquarters:String= "Galerias";
  mostrar:String;

  constructor() { }

  ngOnInit() {

      // $('#dismiss, .overlay').on('click', function () {
      //     // hide sidebar
      //     $('#sidebar').removeClass('active');
      //     // hide overlay
      //     $('.overlay').removeClass('active');
      // });

      // $('#sidebarCollapse').on('click', function () {
      //     // open sidebar
      //     $('#sidebar').addClass('active');
      //     // fade in the overlay
      //     $('.overlay').addClass('active');
      //     $('.collapse.in').toggleClass('in');
      //     $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      // });
      
  }
 
  

}
