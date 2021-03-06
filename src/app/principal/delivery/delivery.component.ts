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
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

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
  clearnextbypromo = false;

  orders = []
  orders2 = []

  reservationOndaySelected: reservation = { _id: '', date: '', hour: { id: '' }, people: {}, tables: {}, idHeadquart: '' }
  hourswithreservations = [];
  tableswithreservations = [];

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


  }

  ngOnInit() {

    // this.orderList();
    this.orders2 = this.orders;


    this.wesocket.listen('newOrder').subscribe((res: any) => {
      console.log('res', res)
      this.formatOrderUnit(res)
      this.orderList(this.orders)
    })
  }

  loadDishes() {
    this.dishService.getDishesByIdAlly(this.profile.allyId).subscribe((dishes: Dishes[]) => {
      let diss = [];
      dishes.forEach(dis => {

        diss.push(dis);

      })

      this.listOfDishes = diss;
    })
  }


  showToReservation() {

    if (this.reservationOndaySelected.tables['value'] != this.Tablereservation.value) {
      if (this.datereservation && this.hourreservation.value && this.Peoplereservation.value && this.Tablereservation.value) {

        // comprobation if date is corect
        let dateres = new Date(this.datereservation + "T" + this.hourreservation.value);
        let today = new Date();

        if (dateres >= today) {

          // this copilist is use when implemented the other part of reservation.
          // this.copilist = this.listOfDishes.slice();
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

    } else {


      Swal.fire({

        title: 'La hora que seleccionaste ya tiene una reserva para este dia',
        text: "Por favor selecciona otra opcion",
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
      allyId: this.profile.allyId,
      idHeadquartes: this.profile.headquarterId,
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

    // this.serviceOrders.postCharge(order).subscribe(res => {
    //   // this.loadReservations();
    //   // this.resetIds();
    //   // Swal.fire(
    //   //   'Reservación Guardada',
    //   // )
    // });
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
    this.Hours = [];
    let idb = 0;
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 31; min += 30) {
        let toHour = ''
        let objHour = { valueToShow: '', value: '', id: idb + 'b' };
        idb++;

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

  orderList(ordersArray) {

    ordersArray.forEach((order: Orders, i) => {

      if (order.orderStatus == "Cancelada" || order.orderStatus == "Entregado") {
        this.tolast(i);
      }
    })

  }

  // ============================
  // === charge reservation =====
  loadReservations() {

    this.calendarEvents = [];
    this.Reservations = [];

    this.reservationService.getReservationsByHeadquart(this.profile.headquarterId).subscribe((reservations: reservation[]) => {

      this.Reservations = reservations;
      this.Reservations.forEach((res: reservation) => {

        let ordersInDay = this.calendarEvents.filter(resin => resin.date === res.date);

        if (!ordersInDay.length) {
          this.calendarEvents.push({ publicId: res._id, title: 'Reservas', date: res['date'], target: res['date'] });
        }

      });
    })

    this.resetIds();
    // this.setColor();
  }


  // ============================
  // ==== resets id =============
  resetIds() {
    this.idButton = '';
    this.idPeople = '';
    this.idTable = '';
    this.datereservation = '';
    this.hourreservation = { id: "", valueToShow: '', value: '' };
    this.Tablereservation = { id: '', value: '' };
    this.Peoplereservation = { id: '', value: '' };

    this.selectDishes = [];
  }

  

  // ============================
  // ======= Calendar ===========
  eventClick(event) {

    // get id of event, this id is on order.typeOfServiceobj
    this.handleDateClick(event.event._def.extendedProps);

  }

  handleDateClick(event) {

    this.idEvent = '';
    
    
    if (this.clearnextbypromo ) {
      
      this.cleancolors();
      this.clearnextbypromo = false;
    }
    
    // event is a object { publicId:"", target:"" } or is a event of date with event{dateSrt:""}
    if (this.calendarEvents.length) {
      const lastevent = this.calendarEvents[this.calendarEvents.length - 1];
      
      if (lastevent.publicId == " ") {
        
        this.calendarEvents.splice(this.calendarEvents.length - 1, 1);
      }
    }
    
    // setting date of event
    this.datereservation = event.target ? event.target : event.dateStr;
    // variable to save all reservations on day
    this.hourswithreservations = this.Reservations.filter((res: reservation) => res.date === this.datereservation);

    // this event should not id, because is a generic event only for see
    let objdate = { publicId: " ", title: 'programar', date: this.datereservation, target: this.datereservation }

    this.calendarEvents.push(objdate);


    // this.setColor();

    if (this.hourswithreservations.length) {
      this.cleancolors();
      this.clearnextbypromo = true;
      this.idButton = ''; // this is not clear the last button selected

      this.hourswithreservations.forEach((res: reservation) => {
        this.setColor("#ffb6b9", res);
      });

    }

  }

  getHour(event, id) {

    // setting the id event's is necessary to use in setFree()  Reservation and it is fixed en gettables fucntion
    this.idEvent = '';
    this.tableswithreservations = []

    if (this.idButton) {

      document.getElementById(this.idButton).style.backgroundColor = "#fff";
      this.idButton = '';

    }

    this.hourswithreservations = this.Reservations.filter((res: reservation) => {
      if (res.hour['id'] === id && this.datereservation === res.date) {
        return res;
      }
    })

    this.hourreservation = this.Hours.find(hourse => hourse.id === id);
    // this.hourreservation.id = id+'b';


    // this.setColorHour();
    if (this.hourswithreservations.length) {
      this.clearTAblesPersons();

      this.hourswithreservations.forEach((rese: reservation) => {

        if (rese.date === this.datereservation && rese.hour['id'] === id) {

          this.tableswithreservations.push(rese)
          this.setColorHour("#ffb6b9", rese);
          // this.hourreservation.id = -1;}
          // set this variables to not change background-color
          this.idTable = '';
          this.idPeople = '';

          return;
        }
      })

    } else {

      this.clearTAblesPersons();
      document.getElementById(id).style.backgroundColor = "#54a735";
      this.idButton = id;
      this.reservationOndaySelected = {
        _id: '',
        date: '',
        hour: {},
        people: {},
        tables: {},
        idHeadquart: ''
      };
    }

  }

  getTables(event, id) {

    // variable to know if hours is the a promotions
    let hour = this.tableswithreservations.filter(reserva => reserva.tables['id'] === (id + 't'));

    if (this.idTable && !hour.length) {

      document.getElementById(this.idTable).style.backgroundColor = "#fff";

    }

    if (!hour.length) {
      document.getElementById(id + 't').style.backgroundColor = "green";
      this.idTable = id + 't';
    }

    // if( (id+'t') !== this.reservationOndaySelected.tables['id'] ){   //this validations is not change color when is selected a day with ressetvations

    // }

    this.Tablereservation.value = event.target.textContent;
    this.Tablereservation.id = this.idTable;

    this.clearPerson();

    if (hour.length) {
      this.reservationOndaySelected = hour[0];
      this.idEvent = this.reservationOndaySelected['_id'];
      this.clearPerson("#ffb6b9", hour[0]);

    } else {
      this.idEvent = '';
      this.reservationOndaySelected = { _id: '', date: '', hour: { id: '' }, people: {}, tables: {}, idHeadquart: '' }
      
    }

  }

  getPeople(event, id) {
    if (this.idPeople && this.idPeople !== this.reservationOndaySelected.people['id']) {

      document.getElementById(this.idPeople).style.backgroundColor = "#fff";

    }

    if ((id + 'p') !== this.reservationOndaySelected.people['id']) {

      document.getElementById(id + 'p').style.backgroundColor = "green";
    }

    this.idPeople = id + 'p';
    this.Peoplereservation.value = event.target.textContent;
    this.Peoplereservation.id = this.idPeople;

  }

  cleancolors() {
    this.Hours.forEach(hour => {
      document.getElementById(hour.id).style.backgroundColor = "#fff";
    })
    this.clearTAblesPersons();

  }

  clearTAblesPersons() {
    this.Tables.forEach((table, index) => {
      document.getElementById(index + 't').style.backgroundColor = "#fff";
      document.getElementById(index + 'p').style.backgroundColor = "#fff";
    })
  }

  clearPerson(color?: string, res?: reservation){

    if(color){
      document.getElementById(res['people']['id']).style.backgroundColor = color;
    }else{

      this.Tables.forEach((table, index) => {
        document.getElementById(index + 'p').style.backgroundColor = "#fff";
      })
    }
  }


  setColor(color?: string, res?: {}) {

    let background = "#fff";

    if (color) {

      background = color;
      // document.getElementById(res['hour']['id']).setAttribute( "disabled", "true" );
      document.getElementById(res['hour']['id']).style.backgroundColor = background;
      document.getElementById(res['tables']['id']).style.backgroundColor = background;
      document.getElementById(res['people']['id']).style.backgroundColor = background;

    }
    // else {

    // if (this.Reservations.length) {

    //   this.Reservations.forEach((res: reservation) => {
    //     document.getElementById(res.hour['id']).style.backgroundColor = background;
    //     document.getElementById(res.tables['id']).style.backgroundColor = background;
    //     document.getElementById(res.people['id']).style.backgroundColor = background;
    //   })
    // }

    // }
  }

  setColorHour(color?: string, res?: reservation) {

    if (color) {
      // document.getElementById(res.hour['id']).style.backgroundColor = color;
      document.getElementById(res.tables['id']).style.backgroundColor = color;
      document.getElementById(res.people['id']).style.backgroundColor = color;
    } else {

      this.clearTAblesPersons();
    }
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
                      // this.setColor("#fff", res);
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
                      // this.setColor();
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
                // this.setColor();
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

              title: 'No existen reservas para la mesa',
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
    reservation.idHeadquart = this.profile.headquarterId;
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

            // this.calendarEvents.push({ publicId: res._id, title: 'Reservado', date: res['date'], target: res['date'] });
            // this.Reservations.push(res);
            this.datereservation = "";
            this.idEvent = "";
            // this.createOrder(reservation);
            // this.loadReservations();
            this.resetIds();
            // this.setColor();
            this.cleancolors();
            Swal.fire(
              {
                title: 'Reservación Guardada',
                confirmButtonColor: '#542b81'
              }
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
    this.serviceOrders.getOrdersByAllyHead(this.profile.headquarterId).subscribe((orders: Orders[]) => {

      orders.forEach(order => {
        this.formatOrderUnit(order)
      })

      this.spinner.hide()
      this.orders2 = this.orders

    })

  }

  formatOrderUnit(order) {
    console.log('order', order)

    let ordertosave: any = {};

    ordertosave.headquarterId = order.order.headquarterId;
    ordertosave.code = order.order.code;
    ordertosave.id = order.order._id;
    ordertosave.name = order.order.userId.name + " " + order.order.userId.lastname;
    ordertosave.phone = order.order.userId.phone;
    ordertosave.allyName = order.order.headquarterId.allyId.name
    ordertosave.allyAddress = order.order.headquarterId.address
    ordertosave.address = order.order.address
    ordertosave.typeOfServiceobj = order.typeOfServiceobj; //new change is nesscesary to order :)
    ordertosave.typeOfService = 'Pidelo';
    ordertosave.purchaseAmount = order.orderValue;
    ordertosave.registerDate = this.convertDate(order.dateAndHourReservation) || '';
    ordertosave.dateAndHourDelivery = this.convertDate(order.dateAndHourDelivey) || '';
    ordertosave.DateDelivery = order.dateAndHourDelivey;
    ordertosave.orderStatus = this.getStatus(order.order.status);

    let objdishes = [];
    let timeTotal = 0;
    order.detail.forEach((detail: any) => {
      let objDish: any = {};
      this.dishService.getDisheById(detail.dishId).subscribe((dish: any) => {
        objDish.quantity = detail.amount;
        objDish.name = dish.name;
        objDish.description = dish.description;
        objDish.timedish = dish.preparationTime[0] + " " + dish.preparationTime[1];
        objDish.valueDish = detail.priceFinal

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
      objdishes.push(objDish)
    });
    ordertosave.nameDishe = objdishes
    this.orders.push(ordertosave)
  }

  getStatus (status) {
    let statusReturn
    switch (status) {
      case 'IN PREPARATION':
        statusReturn = 'EN PREPARACION'
        break;

      case 'ON ROAD':
        statusReturn = 'EN CAMINO'
        break;

      case 'DELIVERED':
        statusReturn = 'ENTREGADO'
        break;
    
      default:
        break;
    }

    return statusReturn
  }
}
