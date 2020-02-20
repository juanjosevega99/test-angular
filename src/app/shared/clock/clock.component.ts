import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

  date:String;
  time:String;
  today:Date;
  year:number = new Date().getFullYear();

  constructor() { }

  ngOnInit() {

    setInterval( ()=>this.tick(), 1000 );
  }

  tick(): void{

    this.today = new Date();
    this.time = this.today.toLocaleString('en-US',{ hour: 'numeric', minute: '2-digit', hour12: true });
    this.date = this.today.toLocaleString('es-ES',{weekday:"short", day:"2-digit", month:"short", year:"numeric"   });
    
  }


}
