import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Orders } from 'src/app/models/Orders';
import { UsersService } from 'src/app/services/users.service';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { Users } from 'src/app/models/Users';
import { DishesService } from 'src/app/services/dishes.service';
import { Dishes } from 'src/app/models/Dishes';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-principal-orders',
  templateUrl: './principal-orders.component.html',
  styleUrls: ['./principal-orders.component.scss']
})
export class PrincipalOrdersComponent implements OnInit {

  Hours = []
  Tables = []

  testlist = [
    {
      id: 3,
      DateDelivery: "2020-03-31T23:45:04.671Z"
    },
    {
      id: 4,
      DateDelivery: "2020-03-27T14:20:04.671Z"
    },
    {
      id: 5,
      DateDelivery: "2020-03-27T14:20:04.671Z"
    },
    {
      id: 1,
      DateDelivery: "2020-03-27T14:20:04.671Z"
    }
    
  ];

  testlist2 = [];

  orders = []
  orders2 = []
  constructor(private serviceOrders: OrdersService, private userservice: UsersService, private dishService: DishesService) {
    // init hours
    this.createHours();

    // init Tables
    this.createTables();
    let or = []
    this.serviceOrders.getOrders().subscribe( async (orders: Orders[]) => {

      await orders.forEach(order => {

        let ordertosave: OrderByUser = {}

        this.userservice.getUserById(order.idUser).subscribe((user: Users) => {

          ordertosave.id = order.code;
          ordertosave.name = user.name + " " + user.lastname;
          ordertosave.typeOfService = order.typeOfService;
          ordertosave.purchaseAmount = order.orderValue;
          ordertosave.registerDate = this.convertDate(order.dateAndHourReservation);
          ordertosave.dateAndHourDelivery = this.convertDate(order.dateAndHourDelivey);
          ordertosave.DateDelivery = order.dateAndHourDelivey;

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

  getHour(event) {
    // get the text in button
    console.log(event.target.textContent);

  }

  createHours() {
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 31; min += 30) {
        let toHour = ''
        if (hour < 12) {
          toHour = hour < 10 ? "0" + hour + ":" + (min < 30 ? '0' + min : min) + " am" : hour + ":" + (min < 30 ? '0' + min : min) + " am";
        } else {
          toHour = (hour - 12 && hour - 12 < 10) ? '0' + (hour - 12) + ":" + (min < 30 ? '0' + min : min) + " pm" : (hour - 12 > 0 ? (hour - 12) : hour)
            + ":" + (min < 30 ? '0' + min : min) + " pm";
        }
        this.Hours.push(toHour);
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

  orderList() {

    this.testlist2 = this.testlist.sort( function (a,b){
      return new Date(a.DateDelivery).getTime() - new Date(b.DateDelivery).getTime();
    }
    );
    console.log("on funtion", this.orders2);
    console.log("on funtion", this.testlist2);

    this.orders2 = this.orders.sort( function (a,b){
      return new Date(a.DateDelivery).getTime() - new Date(b.DateDelivery).getTime();
    }
    );
    
  }



}
