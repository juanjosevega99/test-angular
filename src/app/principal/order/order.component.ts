import { Component, OnInit, Input } from '@angular/core';
import { OrderByUser } from 'src/app/models/OrderByUser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  expresionColor = {
    colorFont: '#2fae2b',
    colorProgress: 'warning',
    fontSmall: "Relajate"
  };
  showdetail = false;
  startCronometer = true;
  timeToralOut = '';
  timeInMinutos = 0;
  stopOrder = false;
  percent = 0;

  // to progress bar
  progressbar;

  @Input()
  order: OrderByUser = {};

  constructor() { }

  ngOnInit() {


    let initprogress = setInterval(() => {

      this.changeStatusProgressBar();

      if (this.stopOrder) {

        clearInterval(initprogress);

      }

    }, 3000);

    // let cronometer = setInterval(() => {

    //   this.InitCronometer();

    //   if (this.stopOrder) {
    //     clearInterval(precronometer);
    //   }

    // }, 1000);

    // let precronometer = setInterval(() => {

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

      if (seconds >= 59) {

        switch (timeCronometer.split(" ")[1]) {

          case 'min':
            minutsCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[1]);
            minutsCronometer -= 1;
            hoursCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[0]);
            hoursCronometer = minutsCronometer == 0 ? hoursCronometer -= 1 : hoursCronometer;
            this.timeToralOut = hoursCronometer + ':' + minutsCronometer + " " + 'min';
            this.timeInMinutos = (hoursCronometer * 60) + minutsCronometer;
            break;

          case 'minutos':
            minutsCronometer = parseInt(timeCronometer.split(" ")[0]);
            minutsCronometer -= 1;
            this.timeToralOut = minutsCronometer + " " + 'minutos';
            this.timeInMinutos = minutsCronometer;
            break
        }

        if (hoursCronometer < 0 && minutsCronometer < 0) {
          this.stopOrder = true;
        }
        this.changeStatusOrder(this.timeInMinutos);

        // asign new cronometer
        this.order.timeTotalCronometer = this.timeToralOut;
      }
    }
  }

  changeStatusOrder(time: number) {

    if (time == 0) {
      this.order.orderStatus = 'El pedido esta listo'
      this.expresionColor.colorFont = "#dfb308";
      this.expresionColor.colorProgress = "success";
      this.expresionColor.fontSmall = "Confirmar";


    } else if (time > 0 && time <= 10) {
      this.order.orderStatus = 'nuestro cliente llega en 10 min';
      this.expresionColor.colorFont = "#ac0f17";
      this.expresionColor.colorProgress = "danger";
      this.expresionColor.fontSmall = 'Falta poco';


    } else {
      this.order.orderStatus = 'empieza a preparar el pedido';
      this.expresionColor.colorFont = "#ac0f17";
      this.expresionColor.colorProgress = "danger";
      this.expresionColor.fontSmall = 'Prepara';

    }
  }

  changeStatusProgressBar() {

      let today = new Date().getTime();
      let goal = new Date(this.order.DateDelivery).getTime();
      let percent = 100;

      if (today <= goal) {
  
        percent = Math.floor(100 / ((goal - today) / (1000 * 60)));
        console.log(percent, (100 / ((goal - today) / (1000 * 60))));
        this.percent = percent;
  
      }
      else {
        this.percent = 100;
        // stop count
        clearTimeout(this.progressbar);
      }
  }

}
