import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  date:String;
  time:String;
  today:Date
  constructor() { 
    
  }

  ngOnInit() {
    this.today = new Date();
    this.time = this.today.getHours()+":"+this.today.getMinutes()
    this.date = this.today.getFullYear()+'/'+(this.today.getMonth()+1)+'/'+this.today.getDate();
  }

}
