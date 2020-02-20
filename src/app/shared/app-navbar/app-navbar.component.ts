import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {

  date:String;
  time:String;
  today:Date;
  constructor() { }

  ngOnInit() {
    this.today = new Date();
    this.time = this.today.toLocaleString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
    this.date = this.today.toLocaleString('es-ES',{weekday:'short',day:'2-digit',month:'long',year:'numeric'});
  }
}

