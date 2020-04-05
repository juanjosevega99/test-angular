import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Orders } from 'src/app/models/Orders';
import { UsersService } from 'src/app/services/users.service';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { Users } from 'src/app/models/Users';
import { DishesService } from 'src/app/services/dishes.service';
import { Dishes } from 'src/app/models/Dishes';

// fullcalendar
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid';

// swall
import Swal from 'sweetalert2';

// reservation
import { ReservationService } from 'src/app/services/reservation.service';
import { reservation } from 'src/app/models/reservation';


@Component({
  selector: 'app-principal-orders',
  templateUrl: './principal-orders.component.html',
  styleUrls: ['./principal-orders.component.scss']
})
export class PrincipalOrdersComponent implements OnInit {

  // ========================
  // ==== full calendar =====
  calendarPlugins = [dayGridPlugin, interactionPlugin, dayGridPlugin];

  datereservation: string = '';
  hourreservation = { id: '', valueToShow: '', value: '' };
  Tablereservation = { id: '', value: '' }
  Peoplereservation = { id: '', value: '' }
  idButton = '';
  idTable = '';
  idPeople = '';

  calendarEvents = [
    { title: 'event 1', date: '2020-04-04', target: 'evento1' },
    { title: 'event 1', date: '2020-04-06', target: 'evento2' },
    { title: 'event 2', date: '2020-04-05', target: 'evento3' },

  ];

  Reservations = [];

  Hours = []
  Tables = []


  orders = []
  orders2 = []
  constructor(private serviceOrders: OrdersService, private userservice: UsersService, private dishService: DishesService,
    private reservationService: ReservationService) {
    // init hours
    this.createHours();

    // init Tables
    this.createTables();
    let or = []
    this.serviceOrders.getOrders().subscribe((orders: Orders[]) => {

      orders.forEach(order => {
        let ordertosave: OrderByUser = {};
        this.userservice.getUserById(order.idUser).subscribe((user: Users) => {
          ordertosave.code = order.code;
          ordertosave.id = order.id;
          ordertosave.name = user.name + " " + user.lastname;
          ordertosave.typeOfService = order.typeOfService['type'] == 'reservalo' ? order.typeOfService['type'] + " " + order.typeOfService['tables'] + " mesas" : order.typeOfService['type'];
          ordertosave.purchaseAmount = order.orderValue;
          ordertosave.registerDate = this.convertDate(order.dateAndHourReservation);
          ordertosave.dateAndHourDelivery = this.convertDate(order.dateAndHourDelivey);
          ordertosave.DateDelivery = order.dateAndHourDelivey;
          ordertosave.orderStatus = order.orderStatus;
        });
        let objdishes = [];
        let timeTotal = 0;
        order.idDishe.forEach((iddish: any) => {
          let objDish: any = {};
          this.dishService.getDisheById(iddish.id).subscribe((dish: Dishes) => {
            objDish.quantity = iddish.quantity;
            objDish.name = dish.name;
            objDish.description = dish.description;
            objDish.timedish = dish.preparationTime[0] + " " + dish.preparationTime[1];
            objDish.valueDish = dish.price * iddish.quantity;
            switch (dish.preparationTime[1]) {
              case 'segundos':
                timeTotal = timeTotal + (parseInt(dish.preparationTime[0]) / 60);
                break;
              case "minutos":
                timeTotal = (timeTotal + parseInt(dish.preparationTime[0]));
                break;
              case 'horas':
                timeTotal = timeTotal + (parseInt(dish.preparationTime[0]) * 60);
                break;
            }
            if (timeTotal >= 60) {
              ordertosave.timeTotal = Math.floor(timeTotal / 60) + ":" + ((((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60) < 10 ? '0' +
                (((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60) : (((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60)) + " " + "min";
              ordertosave.timeTotalCronometer = Math.floor(timeTotal / 60) + ":" + ((((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60) < 10 ? '0' +
                (((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60) : (((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60)) + " " + "min";
            }
            else {
              ordertosave.timeTotal = timeTotal + " " + "minutos";
              ordertosave.timeTotalCronometer = timeTotal + " " + "minutos";
            }
          });
          objdishes.push(objDish);
        });
        ordertosave.nameDishe = objdishes;
        this.orders.push(ordertosave);
      })

    })
    // load reservations
      this.loadReservations();

  }

  ngOnInit() {

    // this.orderList();
    this.orders2 = this.orders;

  }


  createHours() {
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 31; min += 30) {
        let toHour = ''
        let objHour = { valueToShow: '', value: '' };

        if (hour < 12) {
          toHour = hour < 10 ? "0" + hour + ":" + (min < 30 ? '0' + min : min) + " am" : hour + ":" + (min < 30 ? '0' + min : min) + " am";
        } else {
          toHour = (hour - 12 && hour - 12 < 10) ? '0' + (hour - 12) + ":" + (min < 30 ? '0' + min : min) + " pm" : (hour - 12 > 0 ? (hour - 12) : hour)
            + ":" + (min < 30 ? '0' + min : min) + " pm";
        }

        objHour.valueToShow = toHour;
        objHour.value = (hour < 10 ? "0" + hour : hour) + ':' + (min < 30 ? '0' + min : min);

        this.Hours.push(objHour);
      }
    }
  }

  createTables() {
    for (let t = 1; t < 21; t++) {
      this.Tables.push(t);
    }
  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' }) + " " +
      d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // const n = date.toLocaleString('en-US', { hour12: true });
    return n;
  }


  tolast(index: number) {

    let auxOrder: Orders = this.orders2[index];
    this.orders2.splice(index, 1);
    auxOrder.orderStatus = "Entregado";
    this.orders2.push(auxOrder);

  }

  // ============================
  // === charge reservation =====
  loadReservations() {

    this.calendarEvents = [];

    this.reservationService.getReservations().subscribe((reservations: reservation[]) => {

      this.Reservations = reservations;
      this.Reservations.forEach((res: any) => {
        this.calendarEvents.push({ title: 'Reservado', date: res['date'], target: res['date'] });

      });
    })

    this.resetIds();
    this.setColor();
  }


  // ============================
  // ==== resets id =============
  resetIds() {
    this.idButton = '';
    this.idPeople = '';
    this.idTable = '';
    this.datereservation = '';
    this.hourreservation = { id: '', valueToShow: '', value: '' };
    this.Tablereservation = { id: '', value: '' }
    this.Peoplereservation = { id: '', value: '' }
  }

  setColor(color?: string, res?: {}) {

    let background = "#fff";

    if (color) {

      background = color;
      document.getElementById(res['hour']['id']).style.backgroundColor = background;
      document.getElementById(res['tables']['id']).style.backgroundColor = background;
      document.getElementById(res['people']['id']).style.backgroundColor = background;

    } else {

      if (this.Reservations.length) {

        this.Reservations.forEach((res: any) => {

          document.getElementById(res.hour['id']).style.backgroundColor = background;
          document.getElementById(res.tables['id']).style.backgroundColor = background;
          document.getElementById(res.people['id']).style.backgroundColor = background;
        })
      }

    }
  }

  // ============================
  // ======= Calendar ===========
  eventClick(event) {
    console.log("from event", event.event._def.extendedProps.target);
    this.handleDateClick(event.event._def.extendedProps.target);

  }
  handleDateClick(date) {

    let resToCompare = {};

    if (this.datereservation) {

      this.calendarEvents.splice(this.calendarEvents.length - 1, 1);

    }

    this.datereservation = date;
    let objdate = { title: 'programar', date: this.datereservation, target: this.datereservation }
    this.calendarEvents.push(objdate);

    if (this.Reservations.length) {

      this.setColor();

      this.Reservations.forEach((res: any) => {

        if (this.datereservation == res['date']) {

          resToCompare = res;
          return

        }
      });

      if (resToCompare['date']) {
        this.setColor("red", resToCompare);
        resToCompare = {};
      }
    }

  }

  getHour(event, id) {
    if (this.idButton) {

      document.getElementById(this.idButton).style.backgroundColor = "#fff";

    }

    document.getElementById(id).style.backgroundColor = "green";
    this.idButton = id;
    this.hourreservation = this.Hours[id];
    this.hourreservation.id = this.idButton;

  }

  getTables(event, id) {
    if (this.idTable) {

      document.getElementById(this.idTable).style.backgroundColor = "#fff";

    }

    document.getElementById(id + 't').style.backgroundColor = "green";
    this.idTable = id + 't';
    this.Tablereservation.value = event.target.textContent;
    this.Tablereservation.id = this.idTable;

  }

  getPeople(event, id) {
    if (this.idPeople) {

      document.getElementById(this.idPeople).style.backgroundColor = "#fff";

    }

    document.getElementById(id + 'p').style.backgroundColor = "green";
    this.idPeople = id + 'p';
    this.Peoplereservation.value = event.target.textContent;
    this.Peoplereservation.id = this.idPeople;

  }

  // ==========================================
  // ========= setReservation && setfree ======

  setFree() {

    if (this.datereservation && this.Reservations) {

      this.Reservations.forEach((res:reservation) => {

        if (this.datereservation == res['date']) {
          let dateres = new Date(res.date + "T" + res.hour['value']);

          Swal.fire({

            title: `¿Desea Liberar la mesa ${res.tables['value']} ?`,
            text: `del ${dateres.toLocaleString('es-ES', { weekday: "long", day: "2-digit", month: "short", year: "numeric" })} 
          a las ${ res.hour['valueToShow']} disponible para ${res.people['value']} personas`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#542b81',
            cancelButtonColor: '#542b81',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
  
          }).then(response => {
            
            if(response.value){

              this.reservationService.deleteReservation(res['_id']).subscribe(res => {
                Swal.fire(
                  'mesa Liberada',
                )
              })
              this.loadReservations();
              return;
            }
          })
          
        }

      })

    } else {

      Swal.fire({

        title: 'Seleccione una reserva',
        text: "No existen reservas para la fecha",
        icon: 'warning',
        // showCancelButton: true,
        confirmButtonColor: '#542b81',
        // cancelButtonColor: '#542b81',
        confirmButtonText: 'Aceptar',
        // cancelButtonText: 'No'

      })

    }

  }

  setReservation() {
    // comprobation if date is corect
    let reservation = {
      date: '',
      hour: {},
      tables: {},
      people: {}
    }

    if (this.datereservation && this.hourreservation.value && this.Peoplereservation && this.Tablereservation) {

      let dateres = new Date(this.datereservation + "T" + this.hourreservation.value);
      let today = new Date();

      if (dateres >= today) {
        reservation.date = this.datereservation;
        reservation.hour = this.hourreservation;
        reservation.tables = this.Tablereservation;
        reservation.people = this.Peoplereservation;
        this.resetIds();

        Swal.fire({

          title: `¿Ocupar mesa ${this.Tablereservation.value} ?`,
          text: `Para el ${dateres.toLocaleString('es-ES', { weekday: "long", day: "2-digit", month: "short", year: "numeric" })} 
        a las ${ this.hourreservation.valueToShow} disponible para ${this.Peoplereservation.value} personas`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Sí',
          cancelButtonText: 'No'

        })
          .then((result) => {

            if (result.value) {
              console.log(reservation);

              this.reservationService.postReservation(reservation).subscribe(res => {

                this.Reservations.push(reservation);
                this.calendarEvents.splice(this.calendarEvents.length - 1, 1);
                this.loadReservations();
                Swal.fire(
                  'Reservación Guardada',
                )
              })
            }

          })

      } else {
        Swal.fire({

          title: 'Fecha incorrecta',
          // text: "la Fecha es incorrecta",
          icon: 'warning',
          // showCancelButton: true,
          confirmButtonColor: '#542b81',
          // cancelButtonColor: '#542b81',
          confirmButtonText: 'Aceptar',
          // cancelButtonText: 'No'

        })
      }

    } else {
      Swal.fire({

        title: 'Por favor selecciona todos los campos',
        text: "Fecha, Hora, Personas, Mesas",
        icon: 'warning',
        // showCancelButton: true,
        confirmButtonColor: '#542b81',
        // cancelButtonColor: '#542b81',
        confirmButtonText: 'Aceptar',
        // cancelButtonText: 'No'

      })

    }

  }

}
