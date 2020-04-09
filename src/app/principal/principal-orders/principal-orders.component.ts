import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
import { WebsocketsService } from 'src/app/services/websockets.service';


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
  // =========================
  // ====== profile ==========

  profile = {
    id: '123',
    name: 'pepito',
    idAllies: "5e7b744640e2af2d2f5a6610",
    idHedquart: "5e7b7cf227d3a60b0fb06494"
  }

  // ============================================
  // ====== to save dishes to reservation =======
  preOrder: FormGroup;
  listOfDishes: Dishes[];
  selectDishes = [];
  totalCash = 0;
  totalTime = 0;
  copilist = [];
  showmodal = false;


  Hours = []
  Tables = []


  orders = []
  orders2 = []
  constructor(private serviceOrders: OrdersService, private userservice: UsersService, private dishService: DishesService,
    private reservationService: ReservationService, private wesocket: WebsocketsService) {

    this.preOrder = new FormGroup({

      'name': new FormControl(),
      'quantity': new FormControl(1),
      'dish': new FormControl()

    })

    // init hours
    this.createHours();

    // init Tables
    this.createTables();


    this.formaterOrders();

    // load reservations
    this.loadReservations();

    this.dishService.getDishes().subscribe((dishes: Dishes[]) => {
      let diss = [];
      dishes.forEach(dis => {

        diss.push(dis);

      })

      this.listOfDishes = diss;
    })

  }

  ngOnInit() {

    // this.orderList();
    this.orders2 = this.orders;

    // listen websocket
    this.wesocket.listen('connection').subscribe(res => {
      console.log(res);
    })

    this.wesocket.listen('newOrder').subscribe(res => {
      console.log("desde server", res);
      this.formatOrderUnit(res);
    })

  }


  showToReservation() {
    if (this.datereservation && this.hourreservation.value && this.Peoplereservation.value && this.Tablereservation.value) {

      // comprobation if date is corect
      let dateres = new Date(this.datereservation + "T" + this.hourreservation.value);
      let today = new Date();

      if (dateres >= today) {

        this.copilist = this.listOfDishes.slice();
        // this.showmodal = true;
        this.setReservation();

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

  createOrder(reservation) {

    let idDishesa = [];

    this.selectDishes.forEach(diss => {
      let obj = {
        id: diss.id,
        quantity: diss.quantity
      }

      idDishesa.push(obj);
    });

    let dateres = new Date(this.datereservation + "T" + this.hourreservation.value);

    let order = {
      code: "R-05",
      idUser: "5e1f18008f7efe00172e5037",
      idAllies: this.profile.idAllies,
      idHeadquartes: this.profile.idHedquart,
      idDishe: idDishesa,
      typeOfServiceobj: reservation,
      typeOfService: { type: reservation['type'], tables: reservation['tables']['value'] },
      orderValue: this.totalCash,
      dateAndHourDelivey: dateres,
      chronometer: this.totalTime,
      orderStatus: "Relajate",
      deliveryStatus: false,
      costReservation: 2010,
    }

    this.serviceOrders.postCharge(order).subscribe(res => {
      // this.loadReservations();
      // this.resetIds();
      // Swal.fire(
      //   'Reservación Guardada',
      // )
    });
  }

  adddish() {

    const indexO = this.preOrder.value.dish;
    let dish = this.copilist.slice(indexO, indexO + 1);
    dish[0]['location'] = indexO;
    dish[0]['quantity'] = 1;

    this.selectDishes.push(dish[0]);
    this.totalTime = this.totalTime + parseFloat(dish[0]['preparationTime'][0]);
    this.totalCash = this.totalCash + dish[0]['price'];
  }

  removeDish(index) {

    this.totalCash = this.totalCash - this.selectDishes[index].price;
    this.totalTime = this.totalTime - parseFloat(this.selectDishes[index].preparationTime[0]);
    this.selectDishes.splice(index, 1);

  }

  updatePrice(index) {

    const idDish: string = index + "q";
    const quantityInput = parseInt(document.getElementById(idDish)['value']);

    const dish = this.selectDishes[index];

    const location = dish.location;
    const result = quantityInput * this.listOfDishes[location]['price'];

    dish['price'] = result;
    dish['quantity'] = quantityInput;
    this.selectDishes[index]['price'] = result;

    // update time and price total
    this.totalCash = 0;
    this.totalTime = 0;

    this.selectDishes.forEach(dis => {
      this.totalCash = this.totalCash + dis.price;
      this.totalTime = this.totalTime + parseInt(dis.preparationTime[0]);
    })

    this.dishService.getDishes().subscribe(platos => {
      this.listOfDishes = [];
      this.listOfDishes = platos;
    })

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
    console.log("loading reservations");

    this.calendarEvents = [];

    this.reservationService.getReservationsByHeadquart(this.profile.idHedquart).subscribe((reservations: reservation[]) => {

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
    this.Tablereservation = { id: '', value: '' };
    this.Peoplereservation = { id: '', value: '' };

    this.selectDishes = [];
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
        this.setColor("#ffb6b9", resToCompare);
        resToCompare = {};
      }
    }

  }

  getHour(event, id) {
    if (this.idButton) {

      document.getElementById(this.idButton).style.backgroundColor = "#fff";

    }

    document.getElementById(id).style.backgroundColor = "#54a735";
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

      this.Reservations.forEach((res: reservation) => {

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

            if (response.value) {

              this.orders2.forEach(order => {

                if (res.date == order.typeOfServiceobj['date'] && res.hour['value'] == order.typeOfServiceobj['hour']['value']) {

                  order.orderStatus = "Cancelada";
                  order.typeOfService = { type: order.typeOfServiceobj['type'], tables: order.typeOfServiceobj['tables']['value'] }

                  this.serviceOrders.putCharge(order).subscribe(resorder => {

                    this.reservationService.deleteReservation(res['_id']).subscribe(response => {
                      this.loadReservations();
                      this.formaterOrders();

                      Swal.fire(
                        'mesa Liberada',
                      )
                      return;
                    })

                  })

                }else{

                this.reservationService.deleteReservation(res['_id']).subscribe(response => {
                      this.loadReservations();
                      this.formaterOrders();

                      Swal.fire(
                        'mesa Liberada',
                      )
                      return;
                    })

                }

              })
              return;
            }
          })

        }else{
          Swal.fire({

            title: 'No existen reservas para la fecha',
            icon: 'warning',
            // showCancelButton: true,
            confirmButtonColor: '#542b81',
            // cancelButtonColor: '#542b81',
            confirmButtonText: 'Aceptar',
            // cancelButtonText: 'No'
    
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

    let dateres = new Date(this.datereservation + "T" + this.hourreservation.value);
    let reservation = {

      date: '',
      hour: {},
      tables: {},
      people: {},
      idHeadquart: "",
      type: "reservalo"

    }

    reservation.date = this.datereservation;
    reservation.hour = this.hourreservation;
    reservation.tables = this.Tablereservation;
    reservation.people = this.Peoplereservation;
    reservation.idHeadquart = this.profile.idHedquart;
    // this.resetIds();

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

          this.reservationService.postReservation(reservation).subscribe(res => {

            
            this.calendarEvents.splice(this.calendarEvents.length - 1, 1);
            this.calendarEvents.push({ title: 'Reservado', date: res['date'], target: res['date'] });
            // this.createOrder(reservation);
            // this.loadReservations();
            this.resetIds();
            Swal.fire(
              'Reservación Guardada',
            )

          })
        }
      })
  }

  // ========================================================
  // ========= funtion to formater all prders by ally =======
  // ========================================================
  formaterOrders() {
    this.orders2 = [];
    this.orders = [];
    this.serviceOrders.getOrdersByAllyHead(this.profile.idHedquart).subscribe((orders: Orders[]) => {

      orders.forEach(order => {
        this.formatOrderUnit(order);
      })

    })

  }

  formatOrderUnit(order) {

    let ordertosave: OrderByUser = {};
    this.userservice.getUserById(order.idUser).subscribe((user: Users) => {
      ordertosave.code = order.code;
      ordertosave.id = order.id;
      ordertosave.name = user.name + " " + user.lastname;
      ordertosave.typeOfServiceobj = order.typeOfServiceobj; //new change is nesscesary to order :)
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
            (((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60) : Math.floor(((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60)) + " " + "min";
          ordertosave.timeTotalCronometer = Math.floor(timeTotal / 60) + ":" + ((((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60) < 10 ? '0' +
            (((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60) : Math.floor(((timeTotal / 60) - Math.floor(timeTotal / 60)) * 60)) + " " + "min";
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
    this.orders2 = this.orders;
  }

}
