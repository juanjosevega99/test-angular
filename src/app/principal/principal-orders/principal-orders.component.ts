import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Orders } from 'src/app/models/Orders';
import { UsersService } from 'src/app/services/users.service';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { Users } from 'src/app/models/Users';
import { DishesService } from 'src/app/services/dishes.service';
import { Dishes } from 'src/app/models/Dishes';
import { async } from '@angular/core/testing';

// fullcalendar
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid';

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
  hourreservation = { valueToShow: '', value: '' };
  Tablereservation: string = '';
  Peoplereservation:string = '';
  idButton = '';
  idTable = '';
  idPeople = '';

  calendarEvents = [
    { title: 'event 1', date: '2020-04-04' },
    { title: 'event 1', date: '2020-04-06' },
    { title: 'event 2', date: '2020-04-05' },

  ];

  Hours = []
  Tables = []


  orders = []
  orders2 = []
  constructor(private serviceOrders: OrdersService, private userservice: UsersService, private dishService: DishesService) {
    // init hours
    this.createHours();

    // init Tables
    this.createTables();
    let or = []
    this.serviceOrders.getOrders().subscribe(async (orders: Orders[]) => {

      await orders.forEach(order => {

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

        })

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

            } else {
              ordertosave.timeTotal = timeTotal + " " + "minutos";
              ordertosave.timeTotalCronometer = timeTotal + " " + "minutos";
            }
          })
          objdishes.push(objDish);

        })

        ordertosave.nameDishe = objdishes;

        this.orders.push(ordertosave);
      })

    })

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
        objHour.value = hour + ':' + (min < 30 ? '0' + min : min);

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

    console.log(index);

  }

  // ============================
  // ======= Calendar ===========
  handleDateClick(arg) {

    if (this.datereservation) {

      this.calendarEvents.splice(this.calendarEvents.length-1, 1);
      
    }

    this.datereservation = arg.dateStr;
    let objdate = { title: 'programar', date: this.datereservation }
    this.calendarEvents.push(objdate);

  }

  getHour(event, id) {
    if ( this.idButton ){

    document.getElementById(this.idButton).style.backgroundColor= "#fff";

    }
    
    document.getElementById(id).style.backgroundColor= "green";
    this.hourreservation = this.Hours[id];
    this.idButton = id;
    console.log(this.hourreservation);
    
  }

  getTables(event, id) {
    if ( this.idTable ){

    document.getElementById(this.idTable).style.backgroundColor= "#fff";

    }
    
    document.getElementById(id + 't').style.backgroundColor= "green";
    this.Tablereservation = event.target.textContent;
    this.idTable = id + 't';

  }

  getPeople(event, id){
    if ( this.idPeople ){

      document.getElementById(this.idPeople).style.backgroundColor= "#fff";
  
      }
      
      document.getElementById(id+'p').style.backgroundColor= "green";
      this.Peoplereservation = event.target.textContent;
      this.idPeople = id + 'p';

  }

  // ==========================================
  // ========= setReservation && setfree ======

  setFree(){

  }

  setReservation(){
    // comprobation if date is corect
    let reservation = {
      date: '',
      hour: {},
      tables: '',
      people: ''
    }

    if(this.datereservation && this.hourreservation.value && this.Peoplereservation && this.Tablereservation){

    let dateres = new Date( this.datereservation + "T" + this.hourreservation.value );
    let today = new Date();
    
    if( dateres >= today ){
      reservation.date = this.datereservation;
      reservation.hour = this.hourreservation;
      reservation.tables = this.Tablereservation;
      reservation.people = this.Peoplereservation;
      console.log(reservation);
      
    }else{
      console.log("fecha incorrecta");
      
    }

    }else{
      console.log("falta campos por llenar");
      
    }

  }

}
