import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {

  date:String;
  time:String;
  today:Date;

  timeTick:any;
  
  constructor() { }

  ngOnInit() {
    
    this.tick();
    this.timeTick = setInterval( ()=>this.tick(), 20000 );
  }

  ngOnDestroy(){
    clearTimeout(this.timeTick);
  }

  tick(): void{

    this.today = new Date();
    this.time = this.today.toLocaleString('en-US',{ hour: 'numeric', minute: '2-digit', hour12: true });
    this.date = this.today.toLocaleString('es-ES',{weekday:"short", day:"2-digit", month:"short", year:"numeric"   });
    
  }


}
