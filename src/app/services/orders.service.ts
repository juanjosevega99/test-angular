import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Orders } from '../models/Orders';

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private httpclient: HttpClient) { }

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
            id: orders._id,
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


  getChargeById(id): Observable<Orders> {
    return this.httpclient.get<Orders>(environment.UrlBase + "orders/" + id).pipe(map(
      (order: Orders) => {
        let obj = {
          id: order._id,
          code: order.code,
          idUser: order.idUser,
          idAllies: order.idAllies,
          nameAllies: order.nameAllies,
          idHeadquartes: order.idHeadquartes,
          nameHeadquartes: order.nameHeadquartes,
          idDishe: order.idDishe,
          nameDishe: order.nameDishe,
          typeOfService: order.typeOfService,
          orderValue: order.orderValue,
          dateAndHourReservation: order.dateAndHourReservation,
          dateAndHourDelivey: order.dateAndHourDelivey,
          chronometer: order.chronometer,
          orderStatus: order.orderStatus,
          deliveryStatus: order.deliveryStatus,
          costReservation: order.costReservation,
          costReservationIva: order.costReservationIva
        };

        return obj
      }
    )
    )
  }
  getChargeByUserId(id:string): Observable<Orders[]> {
    return this.httpclient.get<Orders[]>(environment.UrlBase + "orders/user/" + id).pipe(
        map((orders: any[]) =>
          orders.map(orders => {
            let obj = {
              id: orders._id,
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
              deliveryStatus: orders.deliveryStatus,
              costReservation: orders.costReservation,
              costReservationIva: orders.costReservation + (orders.costReservation* environment.IVA )
            };
            return obj;
          })
        )
      );
  }
}
