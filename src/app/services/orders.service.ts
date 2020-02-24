import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Orders } from "../models/Orders";

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private httpclient: HttpClient) {}

  postCharge(order): Observable<Orders> {
    return this.httpclient.post<Orders>(environment.UrlBase + "orders", order);
  }

  putCharge(order): Observable<Orders> {
    return this.httpclient.put<Orders>(
      environment.UrlBase + "orders" + order.id,
      order
    );
  }

  deleteCharge(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "orders/" + id);
  }

  getOrders(): Observable<any[]> {
    return this.httpclient.get<Orders[]>(environment.UrlBase + "orders").pipe(
      map((orders: any[]) =>
        orders.map(orders => {
          let obj = {
            id: orders.id,
            code: orders.code,
            idUser: orders.idUser,
            idAllies: orders.idAllies,
            nameAllies: orders.nameAllies,
            idHeadquartes: orders.idHeadquartes,
            nameHeadquartes: orders.nameHeadquartes,
            idDishe: orders.idDishe,
            nameDishe: orders.nameDishe,
            typeOfService: orders.typeOfService,
            orderValue: orders.orderValue,
            dateAndHourReservation: orders.dateAndHourReservation,
            dateAndHourDelivey: orders.dateAndHourDelivey,
            chronometer: orders.chronometer,
            orderStatus: orders.orderStatus,
            deliveryStatus: orders.deliveryStatus
          };
          return obj;
        })
      )
    );
  }

  getChargeById(id): Observable<any[]> {
    return this.httpclient
      .get<Orders[]>(environment.UrlBase + "orders/" + id)
      .pipe(
        map((orders: any[]) =>
          orders.map(orders => {
            let obj = {
              id: orders.id,
              code: orders.code,
              idUser: orders.idUser,
              idAllies: orders.idAllies,
              nameAllies: orders.nameAllies,
              idHeadquartes: orders.idHeadquartes,
              nameHeadquartes: orders.nameHeadquartes,
              idDishe: orders.idDishe,
              nameDishe: orders.nameDishe,
              typeOfService: orders.typeOfService,
              orderValue: orders.orderValue,
              dateAndHourReservation: orders.dateAndHourReservation,
              dateAndHourDelivey: orders.dateAndHourDelivey,
              chronometer: orders.chronometer,
              orderStatus: orders.orderStatus,
              deliveryStatus: orders.deliveryStatus
            };
            return obj;
          })
        )
      );
  }
}
