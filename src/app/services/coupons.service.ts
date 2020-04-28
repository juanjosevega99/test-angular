import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Coupons } from 'src/app/models/Coupons';

@Injectable({
  providedIn: "root"
})
export class CouponsService {
  constructor(private httpclient: HttpClient) { }

  postCoupon(coupon): Observable<Coupons> {
    return this.httpclient.post<Coupons>(
      environment.UrlBase + "coupons",
      coupon
    );
  }

  putCoupon(coupon): Observable<Coupons> {
    return this.httpclient.put<Coupons>(
      environment.UrlBase + "coupons/" + coupon.id,
      coupon
    );
  }

  deleteCoupon(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "coupons/" + id);
  }

  getCoupons(): Observable<any[]> {
    return this.httpclient.get<Coupons[]>(environment.UrlBase + "coupons").pipe(
      map((coupons: any[]) =>
        coupons.map(coupons => {
          let obj = {
            id: coupons._id,
            state: coupons.state,
            createDate: coupons.createDate,
            creationTime: coupons.creationTime,
            idAllies: coupons.idAllies,
            nameAllies: coupons.nameAllies,
            idHeadquarters: coupons.idHeadquarters,
            nameHeadquarters: coupons.nameHeadquarters,
            idDishes: coupons.idDishes,
            nameDishes: coupons.nameDishes,
            idtypeOfCoupon: coupons.idtypeOfCoupon,
            nameTypeOfCoupon: coupons.nameTypeOfCoupon,
            discountRate: coupons.discountRate,
            expirationDate: coupons.expirationDate,
            expirationTime: coupons.expirationTime,
            name: coupons.name,
            numberOfUnits: coupons.numberOfUnits,
            numberOfCouponsAvailable: coupons.numberOfCouponsAvailable,
            description: coupons.description,
            imageCoupon: coupons.imageCoupon,
            termsAndConditions: coupons.termsAndConditions,
            codeReferred: coupons.codeReferred
          };
          return obj;
        })
      )
    );
  }

  getCouponById(id): Observable<Coupons> {
    return this.httpclient
      .get<Coupons>(environment.UrlBase + "coupons/" + id)
      .pipe(
        map((coupons: Coupons) => {
          let obj = {
            id: id,
            state: coupons.state,
            createDate: coupons.createDate,
            creationTime: coupons.creationTime,
            idAllies: coupons.idAllies,
            nameAllies: coupons.nameAllies,
            idHeadquarters: coupons.idHeadquarters,
            nameHeadquarters: coupons.nameHeadquarters,
            idDishes: coupons.idDishes,
            nameDishes: coupons.nameDishes,
            idtypeOfCoupon: coupons.idtypeOfCoupon,
            nameTypeOfCoupon: coupons.nameTypeOfCoupon,
            discountRate: coupons.discountRate,
            expirationDate: coupons.expirationDate,
            expirationTime: coupons.expirationTime,
            name: coupons.name,
            numberOfUnits: coupons.numberOfUnits,
            numberOfCouponsAvailable: coupons.numberOfCouponsAvailable,
            description: coupons.description,
            imageCoupon: coupons.imageCoupon,
            termsAndConditions: coupons.termsAndConditions,
            codeReferred: coupons.codeReferred
          };
          return obj;
        })
      );
  }
}
