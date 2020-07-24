import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { OrderByUser } from '../models/OrderByUser';

@Injectable({
  providedIn: "root"
})
export class OrderRecordsByUserService {
  constructor(private httpclient: HttpClient) {}

  postOrderRecordByUser(orderrecordbyuser):Observable<OrderByUser>{
    return this.httpclient.post<OrderByUser>(environment.UrlBase+"orderrecordbyuser", orderrecordbyuser);
  }

  putOrderRecordByUser(orderrecordbyuser):Observable<OrderByUser>{
    return this.httpclient.put<OrderByUser>(environment.UrlBase+"orderrecordbyuser"+ orderrecordbyuser.id, orderrecordbyuser);
  }

  deleteOrderRecordByUser(id):Observable<{}>{
    return this.httpclient.delete(environment.UrlBase+"orderrecordbyuser/"+id);
  }

  getOrderRecordsByUser(): Observable<any[]> {
    return this.httpclient
      .get<OrderByUser[]>(environment.UrlBase + "orderrecordsbyuser")
      .pipe(
        map((orderrecordsbyuser: any[]) =>
          orderrecordsbyuser.map(orderrecordsbyuser => {
            let obj = {
              id: orderrecordsbyuser.id,
              idUser: orderrecordsbyuser.idUser,
              registerDate: orderrecordsbyuser.registerDate,
              name: orderrecordsbyuser.name,
              lastname: orderrecordsbyuser.lastname,
              email: orderrecordsbyuser.email,
              phone: orderrecordsbyuser.phone,
              birthday: orderrecordsbyuser.birthday,
              gender: orderrecordsbyuser.gender,
              password: orderrecordsbyuser.password,
              idAllie: orderrecordsbyuser.idAllie,
              nameAllie: orderrecordsbyuser.nameAllie,
              headquarterId: orderrecordsbyuser.headquarterId,
              nameHeadquarter: orderrecordsbyuser.nameHeadquarter,
              usability: orderrecordsbyuser.usability,
              purchaseAmount: orderrecordsbyuser.purchaseAmount
            };
            return obj;
          })
        )
      );
  }

  getOrderRecordByUserById(id): Observable<any[]>{
    return this.httpclient.get<OrderByUser[]>(environment.UrlBase+"orderrecordsbyuser/"+id).pipe(map((orderrecordsbyuser:any[])=>orderrecordsbyuser.map((orderrecordsbyuser)=>{
      let obj = {
        id: orderrecordsbyuser.id,
        idUser: orderrecordsbyuser.idUser,
        registerDate: orderrecordsbyuser.registerDate,
        name: orderrecordsbyuser.name,
        lastname: orderrecordsbyuser.lastname,
        email: orderrecordsbyuser.email,
        phone: orderrecordsbyuser.phone,
        birthday: orderrecordsbyuser.birthday,
        gender: orderrecordsbyuser.gender,
        password: orderrecordsbyuser.password,
        idAllie: orderrecordsbyuser.idAllie,
        nameAllie: orderrecordsbyuser.nameAllie,
        headquarterId: orderrecordsbyuser.headquarterId,
        nameHeadquarter: orderrecordsbyuser.nameHeadquarter,
        usability: orderrecordsbyuser.usability,
        purchaseAmount: orderrecordsbyuser.purchaseAmount
      } 
      return obj;
    })));
  }

}
