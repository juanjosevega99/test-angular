import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { CouponsAvailable } from "src/app/models/CouponsAvailable";
@Injectable({
  providedIn: 'root'
})
export class CouponsAvailableService {

  constructor(private httpclient: HttpClient) { }
  
  postCouponAvailable(couponAvailable): Observable<CouponsAvailable> {
    return this.httpclient.post<CouponsAvailable>(
      environment.UrlBase + "coupons-available",
      couponAvailable
    );
  }

  putCouponAvailable(couponAvailable): Observable<CouponsAvailable> {
    return this.httpclient.put<CouponsAvailable>(
      environment.UrlBase + "coupons-available/" + couponAvailable.id,
      couponAvailable
    );
  }

  deleteCouponAvailable(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "coupons-available/" + id);
  }

  getCouponsAvailable(): Observable<any[]> {
    return this.httpclient.get<CouponsAvailable[]>(environment.UrlBase + "coupons-available").pipe(
      map((couponsAvailable: any[]) =>
        couponsAvailable.map(couponsAvailable => {
          let obj = {
            id: couponsAvailable._id,
            idUsers : couponsAvailable.idUser,
            idCoupon: couponsAvailable.idCoupon,
          };
          return obj;
        })
      )
    );
  }

  getCouponAvailableById(id): Observable<CouponsAvailable> {
    return this.httpclient
      .get<CouponsAvailable>(environment.UrlBase + "coupons-available/" + id)
      .pipe(
        map((couponsAvailable: CouponsAvailable) =>{
            let obj = {
              id: id,
              idUser: couponsAvailable.idUsers,
              idCoupon: couponsAvailable.idCoupon
            };
            return obj;
          }
        )
      );
  }

}
