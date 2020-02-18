import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  date:String;
  time:String;
  today:Date;
  year:number = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
    this.today = new Date();
    this.time = this.today.toLocaleString('en-US',{ hour: 'numeric', minute: '2-digit', hour12: true });
    this.date = this.today.toLocaleString('es-ES',{weekday:"short", day:"2-digit", month:"short", year:"numeric"   });
  console.log(this.today.toLocaleString('en-US',{ hour: 'numeric', minute: '2-digit', hour12: true }));
  }

}
