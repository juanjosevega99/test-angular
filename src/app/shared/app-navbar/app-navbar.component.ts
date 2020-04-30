import { Component, OnInit } from '@angular/core';
import { ShowContentService } from 'src/app/services/providers/show-content.service';
import { profileStorage } from 'src/app/models/ProfileStorage';
import { OrdersService } from 'src/app/services/orders.service';
import { Orders } from 'src/app/models/Orders';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {

  date:String;
  time:String;
  today:Date;
  profile : profileStorage = new profileStorage();

  ordersNotifications = 0;
  constructor( private showcontentservice: ShowContentService, private serviceOrders: OrdersService ) { 
    this.profile =  this.showcontentservice.showMenus();
    this.loadNotificationsOrders();
  }

  ngOnInit() {
    setInterval( ()=>this.tick(), 1000 );
  }

  tick(): void{

    this.today = new Date();
    this.time = this.today.toLocaleString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
    this.date = this.today.toLocaleString('es-ES',{weekday:'short',day:'2-digit',month:'long',year:'numeric'});
  }

  loadNotificationsOrders(){
    this.serviceOrders.getOrdersByAllyHead(this.profile.idHeadquarter).subscribe((orders: Orders[]) => {

      let numorders = orders.filter( order => order.orderStatus == 'pending' );
      this.ordersNotifications = numorders.length;

    })
  }

}

