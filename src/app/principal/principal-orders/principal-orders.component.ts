import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal-orders',
  templateUrl: './principal-orders.component.html',
  styleUrls: ['./principal-orders.component.scss']
})
export class PrincipalOrdersComponent implements OnInit {

  Hours = []

  constructor() { 
    this.createHours()
  }

  ngOnInit() {
  }

  getHour(event){
    // get the text in button
    console.log(event.target.textContent);
    
  }

  createHours(){
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 31; min+=30) {
        let toHour = ''
        if (hour < 12){
          toHour = hour < 10 ? "0"+ hour + ":" + (min < 30 ? '0' + min : min) + " am" : hour + ":" + (min < 30 ? '0' + min : min) + " am" ;
        }else{
          toHour = (hour - 12 && hour - 12 < 10 )? '0' + (hour - 12) + ":" + (min < 30 ? '0' + min : min) + " pm" : (hour - 12 > 0 ? (hour - 12) : hour  ) 
          + ":" + (min < 30 ? '0' + min : min) + " pm";
        }

        this.Hours.push(toHour);
      }
      
    }
  }
}
