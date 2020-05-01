import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { profileStorage } from 'src/app/models/ProfileStorage';
import { Orders } from 'src/app/models/Orders';
import { ShowContentService } from 'src/app/services/providers/show-content.service';
import { WebsocketsService } from 'src/app/services/websockets.service';

@Component({
  selector: 'app-notifications-orders',
  templateUrl: './notifications-orders.component.html',
  styleUrls: ['./notifications-orders.component.scss']
})
export class NotificationsOrdersComponent implements OnInit {

  ordersNotifications = 0;
  profile : profileStorage = new profileStorage();

  constructor(private serviceOrders: OrdersService, private showcontentservice: ShowContentService, private wesocket: WebsocketsService ) { 
    this.profile =  this.showcontentservice.showMenus();
    this.loadNotificationsOrders();
  }

  ngOnInit() {
    this.wesocket.listen('newOrder').subscribe((res: Orders) => {

      // console.log("desde server", res);
      if (res.idHeadquartes == this.profile.idHeadquarter) {
        this.loadNotificationsOrders;
      }
    });
  }

  loadNotificationsOrders(){
    this.serviceOrders.getOrdersByAllyHead(this.profile.idHeadquarter).subscribe((orders: Orders[]) => {

      let numorders = orders.filter( order => order.orderStatus == 'pending' ); 
      this.ordersNotifications = numorders.length;

    })
  }

}
