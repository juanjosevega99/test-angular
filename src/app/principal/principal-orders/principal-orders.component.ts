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
import { NgxSpinnerService } from 'ngx-spinner';

// reservation
import { ReservationService } from 'src/app/services/reservation.service';
import { reservation } from 'src/app/models/reservation';
import { WebsocketsService } from 'src/app/services/websockets.service';
import { profileStorage } from 'src/app/models/ProfileStorage';
import { ShowContentService } from 'src/app/services/providers/show-content.service';


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
  idEvent: string = "";
  hourreservation = { id: "", valueToShow: "", value: "" };
  Tablereservation = { id: "", value: "" }
  Peoplereservation = { id: "", value: "" }
  idButton = '';
  idTable = '';
  idPeople = '';

  calendarEvents = [
    { publicId: "", title: 'event 1', date: '2020-04-04', target: 'evento1' },
    { publicId: "", title: 'event 1', date: '2020-04-06', target: 'evento2' },
    { publicId: "", title: 'event 2', date: '2020-04-05', target: 'evento3' },

  ];

  Reservations = [];
  // =========================
  // ====== profile ==========

  profilegen = {
    id: '123',
    name: 'pepito',
    idAllies: "5e7b744640e2af2d2f5a6610",
    idHedquart: "5e7b7cf227d3a60b0fb06494"
  }

  profile: profileStorage;



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
    private reservationService: ReservationService, private wesocket: WebsocketsService, private spinner: NgxSpinnerService,
    private showmenu: ShowContentService) {

    this.profile = this.showmenu.showMenus();

    this.preOrder = new FormGroup({

      'name': new FormControl(),
      'quantity': new FormControl(1),
      'dish': new FormControl()

    })

    // spinner
    this.spinner.show();

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

    
    this.wesocket.listen('newOrder').subscribe((res: Orders) => {

      // console.log("desde server", res);
      if (res.idHeadquartes == this.profile.idHeadquarter) {
        this.formatOrderUnit(res);
        this.orderList(this.orders);

      }
    });

    this.wesocket.listen("newReservation").subscribe((reservation: reservation) => {

      if (this.profile.idHeadquarter == reservation.idHeadquart) {

        if (this.idEvent == "" && this.datereservation != "") {
          this.calendarEvents.splice(this.calendarEvents.length - 1, 1);
          this.datereservation = "";
        }
        this.calendarEvents.push({ publicId: reservation._id, title: "reservado", date: reservation.date, target: reservation.date });
        this.Reservations.push(reservation);
        this.idEvent = "";
        this.resetIds();

      }
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
      idHeadquartes: this.profile.idHeadquarter,
      idDishe: idDishesa,
      typeOfServiceobj: reservation['_id'],
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
    console.log("to Last");

    let auxOrder: Orders = this.orders2[index];
    this.orders2.splice(index, 1);
    auxOrder.orderStatus = "Entregado";
    this.orders2.push(auxOrder);

  }

  orderList(ordersArray) {

    console.log(ordersArray.sort((a, b) => new Date(a.DateDelivery).getTime() - new Date(b.DateDelivery).getTime()));

    ordersArray.forEach((order: Orders, i) => {
      console.log(order.orderStatus);

      if (order.orderStatus == "Cancelada" || order.orderStatus == "Entregado") {
        this.tolast(i);
      }
    })

  }

  // ============================
  // === charge reservation =====
  loadReservations() {
    console.log("loading reservations");

    this.calendarEvents = [];
    this.Reservations = [];

    this.reservationService.getReservationsByHeadquart(this.profile.idHeadquarter).subscribe((reservations: reservation[]) => {

      this.Reservations = reservations;
      this.Reservations.forEach((res: reservation) => {

        this.calendarEvents.push({ publicId: res._id, title: 'Reservado', date: res['date'], target: res['date'] });

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

        this.Reservations.forEach((res: reservation) => {
          document.getElementById(res['hour']['id']).style.backgroundColor = background;
          document.getElementById(res.tables['id']).style.backgroundColor = background;
          document.getElementById(res.people['id']).style.backgroundColor = background;
        })
      }

    }
  }

  // ============================
  // ======= Calendar ===========
  eventClick(event) {

    // get id of event, this id is on order.typeOfServiceobj
    // console.log("from event", event.event._def.extendedProps.publicId);
    this.handleDateClick(event.event._def.extendedProps);

  }

  handleDateClick(event) {

    // event is a object { publicId:"", target:"" } or is a event of date with event{dateSrt:""}
    if (this.datereservation) {

      this.calendarEvents.splice(this.calendarEvents.length - 1, 1);

    }

    // setting date of event
    this.datereservation = event.target ? event.target : event.dateStr;

    // setting the id event's is necessary to use in setFree()  Reservation
    this.idEvent = event.publicId ? event.publicId : "";

    // this event should not id, because is a generic event only for see
    let objdate = { publicId: "", title: 'programar', date: this.datereservation, target: this.datereservation }
    this.calendarEvents.push(objdate);

    if (this.Reservations.length) {

      this.setColor();

      this.Reservations.forEach((res: reservation) => {

        if (event.publicId == res._id) {

          this.setColor("#ffb6b9", res);
          return

        }
      });

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

    // if exists date pickle and exist reservations
    if (this.idEvent && this.Reservations.length) {

      let countres = 0;
      this.Reservations.forEach((res: reservation) => {

        countres++;
        if (this.idEvent == res._id) {
          countres--;
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
              if (this.orders2.length) {
                let count = 0;
                this.orders2.forEach(order => {

                  count++;

                  if (res._id == order.typeOfServiceobj['idReservation']) {

                    count--;
                    order.orderStatus = "Cancelada";
                    // is necesary formater the typeOfService because the origin forma is alterate in formaterOrder
                    order.typeOfService = { type: "reservalo", tables: res['tables']['value'] }

                    this.serviceOrders.putCharge(order).subscribe(resorder => {
                      this.setColor("#fff", res);
                      this.reservationService.deleteReservation(res['_id']).subscribe(response => {
                        this.loadReservations();
                        // this.formaterOrders();

                        Swal.fire(
                          'mesa Liberada',
                        )

                      })

                    })

                  } else {

                    if (count == this.orders2.length) {
                      this.setColor();
                      this.reservationService.deleteReservation(res['_id']).subscribe(response => {
                        this.loadReservations();
                        // this.formaterOrders();
                        Swal.fire(
                          'mesa Liberada',
                        )
                        count = 0;

                      })
                    }
                  }

                })
              } else {
                this.setColor();
                this.reservationService.deleteReservation(res['_id']).subscribe(response => {
                  this.loadReservations();
                  // this.formaterOrders();
                  Swal.fire(
                    'mesa Liberada',
                  )
                })
              }
            }
          })

        } else {
          if (countres == this.Reservations.length) {

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
    reservation.idHeadquart = this.profile.idHeadquarter;
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

          this.reservationService.postReservation(reservation).subscribe((res: reservation) => {

            if (this.idEvent = "" && this.datereservation != "") {

              this.calendarEvents.splice(this.calendarEvents.length - 1, 1);
              this.datereservation = "";
            }
            // this.calendarEvents.push({ publicId: res._id, title: 'Reservado', date: res['date'], target: res['date'] });
            // this.Reservations.push(res);
            this.idEvent = "";
            // this.createOrder(reservation);
            // this.loadReservations();
            this.resetIds();
            this.setColor();
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
    this.serviceOrders.getOrdersByAllyHead(this.profile.idHeadquarter).subscribe((orders: Orders[]) => {

      orders.forEach(order => {
        this.formatOrderUnit(order);
      })
      this.spinner.hide();
      this.orders2 = this.orders;

    })

  }

  formatOrderUnit(order) {

    let ordertosave: OrderByUser = {};
    this.userservice.getUserById(order.idUser).subscribe((user: Users) => {
      ordertosave.idHeadquarter = order.idHeadquartes;
      ordertosave.code = order.code;
      ordertosave.id = order.id ? order.id : order._id;
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
  }

}
