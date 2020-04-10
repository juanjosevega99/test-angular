import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { OrdersService } from 'src/app/services/orders.service';
// swall pop up
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  // variable to manage colors and fonts on statte
  expresionColor = {
    colorFont: '#2fae2b',
    colorProgress: 'warning',
    fontSmall: "Relajate",
    backgroundTimer: '#f1d1ac'
  };

  // variable to desplegate table detail
  showdetail = false;

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
    disable: true,
    color: "#d2d2d2"
  }

  @Input()
  order: OrderByUser = {};

  @Input()
  index: number;

  @Output() indexOrder: EventEmitter<number>;

  constructor(private orderservice: OrdersService, private spinner: NgxSpinnerService) {
    this.indexOrder = new EventEmitter();
  }

  ngOnInit() {

    this.progressbar = setInterval(() => {

      this.changeStatusProgressBar();

    }, 30000)

    setTimeout( ()=>{this.changeStatusProgressBar( )}, 2000 )

  }

  ngOnDestroy(){
    clearTimeout(this.progressbar);
  }

  showDetail() {
    console.log("clic en item");
    this.showdetail = !this.showdetail;
  }

  changeStatusOrder(minuts: number) {

    if (this.order.orderStatus != "Cancelada") {

      if (minuts <= 0) {

        this.expresionColor.colorFont = "#dfb308";
        this.expresionColor.colorProgress = "success";
        this.expresionColor.backgroundTimer = '#bfd5b2'
        this.order.timeTotalCronometer = 0 + " " + 'minutos';

        if (this.order.orderStatus != "Entregado") {
          this.order.orderStatus = 'El pedido esta listo'
          this.expresionColor.fontSmall = "Confirmar";
          this.buttonDisable.disable = false;
          this.buttonDisable.color = "#bfd5b2";
          document.getElementById(this.order.code).style.backgroundColor = "#fff";

        } else if (this.order.orderStatus == "Entregado") {
          this.expresionColor.fontSmall = "Entregado";
          document.getElementById(this.order.code).style.backgroundColor = "#4e4f4f";
          this.indexOrder.emit(this.index);
          this.percent = 100;
          clearTimeout(this.progressbar);

        } else {
          this.expresionColor.fontSmall = this.order.orderStatus;
          document.getElementById(this.order.code).style.backgroundColor = "#fff";
          // this.indexOrder.emit(this.index);
          this.percent = 100;

        }


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
    } else if (this.order.orderStatus == "Cancelada") {

      this.buttonDisable.disable = true;
      this.buttonDisable.color = "#bfd5b2";
      this.percent = 100;
      this.expresionColor.fontSmall = 'Cancelado';
      document.getElementById(this.order.code).style.backgroundColor = "#e5e5e5";
      clearTimeout(this.progressbar);

    } else {
      this.expresionColor.fontSmall = this.order.orderStatus;
      console.log(this.order.orderStatus);

    }

  }

  changeStatusProgressBar() {

    let delivery = new Date(this.order.DateDelivery);
    let now = new Date();

    let today = now.getTime() / (1000 * 60);
    let goal = delivery.getTime() / (1000 * 60);
    let minuts = Math.floor(goal - today);
    this.changeStatusOrder(Math.floor(minuts));

    // if the same day
    if (now.getDate() == delivery.getDate()) {
      this.timeLimit = this.getTimeLimit();

      let percent = 100;

      if (minuts >= 0) {

        percent = Math.abs(Math.floor((100 - minuts) - (minuts / (minuts + 1))));
        console.log("minutres", minuts);

        if (minuts > 100) {
          this.percent = 5;
        } else {

          this.percent = percent;
        }

      }
      else {
        this.percent = 100;
        // stop count
        clearTimeout(this.progressbar);
      }
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

  // ====================================
  // ========= Confirm orders ===========

  confirmOrder() {

    let status = {
      orderStatus: "Entregado",
      id: this.order.id
    };
    this.spinner.show();

    this.orderservice.putCharge(status).subscribe(res => {
      this.expresionColor.fontSmall = "Entregado";
      this.showdetail = false;

      this.indexOrder.emit(this.index);
      document.getElementById(this.order.code).style.backgroundColor = "#4e4f4f";
      this.spinner.hide();
    })


  }

  // ====================================
  // ========= minuts to hours ==========

  convertToHours(minuts: number): string {

    let hours = minuts / 60;
    let minut = Math.floor(minuts % 60);
    return hours + ":" + minut + " " + "min"

  }

  // pop up to confim order
  swallUpdateState() {

    let mensaje = '';

    switch (this.order.typeOfService) {
      case 'llevalo' || 'pidelo':
        mensaje = `¿confirmar la entrega del pedido con el código ${this.order.code} del ${this.order.dateAndHourDelivery} ?`;
        break;

      default:
        mensaje = `¿confirmar la entrega del pedido con el código ${this.order.code} del ${this.order.dateAndHourDelivery} con ${this.order.typeOfService.split(' ')[1]} mesas?`;
        break;
    }

    Swal.fire({

      title: '¿Estás seguro?',
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'

    })
      .then((result) => {

        if (result.value) {
          this.confirmOrder();
        }

      })
  }

}
