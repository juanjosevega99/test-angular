import { Component, OnInit, Input } from '@angular/core';
import { OrderByUser } from 'src/app/models/OrderByUser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  expresionColor = 'blue';
  showdetail = false;
  startCronometer = true;
  timeToralOut = '';
  stopOrder = false;

  @Input()
  order: OrderByUser = {};

  constructor() { }

  ngOnInit() {

    // let precronometer = setInterval(() => {

    //   this.InitCronometer();

    //   if (this.stopOrder) {
    //     clearInterval(precronometer);
    //   }

    // }, 1000);

    // let postcronometer = setInterval(() => {

    //   this.cronometer();

    //   if (this.startCronometer) {
    //     console.log("limpando");

    //     clearInterval(postcronometer);
    //   }

    // }, 1000);

  }

  showDetail() {
    console.log("clic en item");
    this.showdetail = !this.showdetail;
  }

  cronometer() {

    // datedelivery = 31/3/2020
    let datedelivery = new Date(this.order.DateDelivery).toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    // today = 31/3/2020
    let today = new Date().toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });

    // hours
    // time today = 4:21 PM
    let timeToday = new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    let timeDelivery = new Date(this.order.DateDelivery).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // timecronometer = 30 minutos || 1:15 min
    let timeCronometer = this.order.timeTotal;

    // console.log( "comparando", datedelivery, today);

    // console.log("time cronometer", timeCronometer);

    let hourtoday = parseInt(timeToday.split(" ")[0].split(":")[0]);
    let minutstoday = parseInt(timeToday.split(" ")[0].split(":")[1]);

    let hoursCronometer = 0;
    let minutsCronometer = 0;

    if (datedelivery == today) {

      switch (timeCronometer.split(" ")[1]) {

        case 'min':
          hoursCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[0]);
          minutsCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[1]);
          break;

        case 'minutos':
          minutsCronometer = parseInt(timeCronometer.split(" ")[0]);
          break
      }

      if ((minutstoday + minutsCronometer) > 59) {
        hoursCronometer += 1;
        minutsCronometer = 0;
      }
      // hour to compare with hour delivery 
      let hourCompare = (hourtoday + hoursCronometer) + ":" + (minutstoday + minutsCronometer) + " " + timeDelivery.split(" ")[1];
      console.log("comparando", hourCompare, timeDelivery);

      if (hourCompare === timeDelivery) {
        console.log("son iguales");

        this.startCronometer = true;
      }

    }
  }


  InitCronometer() {

    if (this.startCronometer) {

      // timecronometer = 30 minutos || 1:15 min
      let timeCronometer = this.order.timeTotalCronometer;
      
      let hoursCronometer = 0;
      let minutsCronometer = 0;

      let seconds = new Date().getSeconds();
      
      if ( seconds >= 59 ){

        switch (timeCronometer.split(" ")[1]) {
  
          case 'min':
            minutsCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[1]);
            minutsCronometer -= 1;
            hoursCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[0]);
            hoursCronometer =  minutsCronometer == 0 ? hoursCronometer -= 1 : hoursCronometer ;
            this.timeToralOut = hoursCronometer + ':' + minutsCronometer + " "+ 'min';
            break;
  
          case 'minutos':
            minutsCronometer = parseInt(timeCronometer.split(" ")[0]);
            minutsCronometer -= 1;            
            this.timeToralOut = minutsCronometer +" "+ 'minutos';
            break
        }

        if (hoursCronometer < 0 && minutsCronometer < 0) {
          this.stopOrder = true;
        }
  
        // asign new cronometer
        this.order.timeTotalCronometer = this.timeToralOut;
      }
    }
  }

}
