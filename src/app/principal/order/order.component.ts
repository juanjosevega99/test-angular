import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { OrdersService } from 'src/app/services/orders.service';
// swall pop up
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  // variable to manage colors and fonts on statte
  expresionColor = {
    colorFont: '#2fae2b',
    colorProgress: 'warning',
    fontSmall: "Relajate",
    backgroundTimer: '#f1d1ac'
  };

  // variable to desplegate table detail
  showdetail = false;

  // variables to manage start or not cronometer
  // startCronometer = false;
  // stopOrder = false;

  // to manage the hour to show in cronometer
  // timeToralOut = '';

  timeInMinutos = 0;

  // time to start cronometer
  timeLimit = 0;

  // percent to progressbar
  percent = 0;
  // maxpercent = this.percent + 100;

  // to progress bar reset function setTimeout
  progressbar: any;

  // to disable button
  buttonDisable = {
    disable:true,
    color:"#d2d2d2"
  }

  @Input()
  order: OrderByUser = {};

  @Input()
  index: number;

  @Output() indexOrder: EventEmitter<number>;

  constructor(private orderservice: OrdersService) {
    this.indexOrder = new EventEmitter();
  }

  ngOnInit() {


    this.progressbar = setInterval(() => {

      this.changeStatusProgressBar();

    }, 3000)


    // let initprogress = setInterval(() => {

    //   this.changeStatusProgressBar();

    //   if (this.stopOrder) {

    //     clearInterval(initprogress);

    //   }

    // }, 3000);

    // let postcronometer = setInterval(() => {

    //   this.InitCronometer();

    //   if (this.stopOrder) {
    //     clearInterval(postcronometer);
    //   }

    // }, 1000);


    // let precronometer = setInterval(() => {

    //   this.cronometer();

    //   if (this.startCronometer) {
    //     console.log("limpando");

    //     clearInterval(precronometer);
    //   }

    // }, 1000);


  }

  showDetail() {
    console.log("clic en item");
    this.showdetail = !this.showdetail;
  }

  // cronometer() {

  //   // datedelivery = 31/3/2020
  //   let datedelivery = new Date(this.order.DateDelivery).toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
  //   // today = 31/3/2020
  //   let today = new Date().toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });

  //   // hours
  //   // time today = 4:21 PM
  //   let timeToday = new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  //   let timeDelivery = new Date(this.order.DateDelivery).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  //   // timecronometer = 30 minutos || 1:15 min
  //   let timeCronometer = this.order.timeTotal;

  //   // console.log( "comparando", datedelivery, today);

  //   // console.log("time cronometer", timeCronometer);

  //   let hourtoday = parseInt(timeToday.split(" ")[0].split(":")[0]);
  //   let minutstoday = parseInt(timeToday.split(" ")[0].split(":")[1]);

  //   let hoursCronometer = 0;
  //   let minutsCronometer = 0;

  //   if (datedelivery == today) {

  //     switch (timeCronometer.split(" ")[1]) {

  //       case 'min':
  //         hoursCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[0]);
  //         minutsCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[1]);
  //         break;

  //       case 'minutos':
  //         minutsCronometer = parseInt(timeCronometer.split(" ")[0]);
  //         break
  //     }

  //     if ((minutstoday + minutsCronometer) > 59) {
  //       hoursCronometer += 1;
  //       minutsCronometer = 0;
  //     }
  //     // hour to compare with hour delivery 
  //     let hourCompare = (hourtoday + hoursCronometer) + ":" + (minutstoday + minutsCronometer) + " " + timeDelivery.split(" ")[1];
  //     console.log("comparando", hourCompare, timeDelivery);

  //     if (hourCompare === timeDelivery) {
  //       console.log("son iguales");

  //       this.startCronometer = true;
  //     }

  //   }
  // }


  // InitCronometer() {

  //   if (this.startCronometer) {

  //     // timecronometer = 30 minutos || 1:15 min
  //     let timeCronometer = this.order.timeTotalCronometer;

  //     let hoursCronometer = 0;
  //     let minutsCronometer = 0;

  //     let seconds = new Date().getSeconds();

  //     if (seconds >= 59) {

  //       switch (timeCronometer.split(" ")[1]) {

  //         case 'min':
  //           minutsCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[1]);
  //           minutsCronometer -= 1;
  //           hoursCronometer = parseInt(timeCronometer.split(" ")[0].split(":")[0]);
  //           hoursCronometer = minutsCronometer == 0 ? hoursCronometer -= 1 : hoursCronometer;
  //           this.timeToralOut = hoursCronometer + ':' + minutsCronometer + " " + 'min';
  //           this.timeInMinutos = (hoursCronometer * 60) + minutsCronometer;
  //           break;

  //         case 'minutos':
  //           minutsCronometer = parseInt(timeCronometer.split(" ")[0]);
  //           minutsCronometer -= 1;
  //           this.timeToralOut = minutsCronometer + " " + 'minutos';
  //           this.timeInMinutos = minutsCronometer;
  //           break
  //       }

  //       if (hoursCronometer < 0 && minutsCronometer < 0) {
  //         this.stopOrder = true;
  //       }
  //       // this.changeStatusOrder(this.timeInMinutos);

  //       // asign new cronometer
  //       this.order.timeTotalCronometer = this.timeToralOut;
  //     }
  //   }
  // }

  changeStatusOrder(minuts: number) {

    if (minuts <= 0) {
      this.order.orderStatus = 'El pedido esta listo'
      this.expresionColor.colorFont = "#dfb308";
      this.expresionColor.colorProgress = "success";
      this.expresionColor.fontSmall = "Confirmar";
      this.expresionColor.backgroundTimer = '#bfd5b2'
      this.order.timeTotalCronometer = 0 + " " + 'minutos';
      this.buttonDisable.disable = false;
      this.buttonDisable.color = "#bfd5b2";


    } else if (minuts <= 10) {

      this.order.orderStatus = `nuestro cliente llega en ${minuts} min`;
      this.expresionColor.colorFont = "#ac0f17";
      this.expresionColor.colorProgress = "danger";
      this.expresionColor.fontSmall = 'Falta poco';
      this.expresionColor.backgroundTimer = '#ffb6b9';
      // this.startCronometer = true;
      this.order.timeTotalCronometer = minuts + " " + 'minutos';
      this.buttonDisable.color = '#ffb6b9';

    } else if (minuts <= this.timeLimit) {
      this.order.orderStatus = 'empieza a preparar el pedido';
      this.expresionColor.colorFont = "#ac0f17";
      this.expresionColor.colorProgress = "danger";
      this.expresionColor.fontSmall = 'Prepara';
      this.expresionColor.backgroundTimer = '#ffb6b9';
      this.order.timeTotalCronometer = minuts > 60 ? this.convertToHours(minuts) : minuts + " " + 'minutos';

    }
    else {

      this.order.orderStatus = 'Relajate';
      this.expresionColor.colorFont = '#dfb308';
      this.expresionColor.colorProgress = 'warning';
      this.expresionColor.fontSmall = 'Relajate';

    }
  }

  changeStatusProgressBar() {

    let today = new Date().getTime() / (1000 * 60);
    let goal = new Date(this.order.DateDelivery).getTime() / (1000 * 60);
    let percent = 100;
    let minuts = 0;

    minuts = Math.floor(goal - today);

    this.changeStatusOrder(Math.floor(minuts));

    if (minuts > 0) {

      percent = Math.abs(Math.floor((100 - minuts - 1) - (minuts / (minuts + 1))));
      console.log(percent);
      console.log("minutres", minuts);


      this.percent = percent;

    }
    else {
      this.percent = 100;
      // stop count
      clearTimeout(this.progressbar);
    }

  }

  // ================================

  getTimeLimit(): number {

    // timecronometer = 30 minutos || 1:15 min
    let timeCronometer = this.order.timeTotal;

    let hours = 0;
    let minuts = 0;

    switch (timeCronometer.split(" ")[1]) {

      case 'min':
        hours = parseInt(timeCronometer.split(" ")[0].split(":")[0]);
        minuts = parseInt(timeCronometer.split(" ")[0].split(":")[1]);
        break;

      case 'minutos':
        minuts = parseInt(timeCronometer.split(" ")[0]);
        break
    }

    if ((minuts) > 59) {
      hours += 1;
      minuts = 0;
    }

    return (hours * 60) + minuts;

  }

  confirOrder() {

    let status = {
      orderStatus: "Entregado",
      id: this.order.id
    };

    this.orderservice.putCharge(status).subscribe(res => {
      console.log(res);
      this.expresionColor.fontSmall = "Entregado";
      this.showdetail = false;

      this.indexOrder.emit(this.index);
    })

    document.getElementById(this.order.code).style.backgroundColor = "#4e4f4f";

  }

  convertToHours(minuts: number): string {

    let hours = minuts / 60;
    let minut = minuts % 60;
    return hours + ":" + minut + " " + "min"

  }

  // pop up to confim order
  swallUpdateState(idProfile?, newState?) {
    Swal.fire({

      title: 'Estás seguro?',
      text: "de que deseas actualizar el estado de este perfil!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
      
    })
    .then((result) => {

      if (result.value) {
        console.log("aceptado")
      }

    })
  }

}
