import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Coupons } from "../models/Coupons";

@Injectable({
  providedIn: "root"
})
export class CouponsService {
  constructor(private httpclient: HttpClient) {}

  postCoupon(coupon): Observable<Coupons> {
    return this.httpclient.post<Coupons>(
      environment.UrlBase + "coupons",
      coupon
    );
  }

  putCoupon(coupon): Observable<Coupons> {
    return this.httpclient.put<Coupons>(
      environment.UrlBase + "coupons" + coupon.id,
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
            id: coupons.id,
            name: coupons.name,
            description: coupons.description,
            imageCoupon: coupons.imageCoupon,
            typeOfCoupon: coupons.typeOfCoupon,
            nameTypeOfCoupon: coupons.nameTypeOfCoupon,
            state: coupons.state,
            createDate: coupons.createDate,
            expirationDate: coupons.expirationDate,
            codeToRedeem: coupons.codeToRedeem,
            termsAndConditions: coupons.termsAndConditions,
            idAllies: coupons.idAllies,
            nameAllies: coupons.nameAllies,
            idHeadquarters: coupons.idHeadquarters,
            nameHeadquarters: coupons.nameHeadquarters,
            idDishes: coupons.idDishes,
            nameDishes: coupons.nameDishes,
            numberOfUnits: coupons.numberOfUnits,
            discountRate: coupons.discountRate,
            creationTime: coupons.creationTime,
            expirationTime: coupons.expirationTime,
            codeReferred: coupons.code
          };
          return obj;
        })
      )
    );
  }

  getCouponById(id): Observable<any[]> {
    return this.httpclient
      .get<Coupons[]>(environment.UrlBase + "coupons/" + id)
      .pipe(
        map((coupons: any[]) =>
          coupons.map(coupons => {
            let obj = {
              id: coupons.id,
              name: coupons.name,
              description: coupons.description,
              imageCoupon: coupons.imageCoupon,
              typeOfCoupon: coupons.typeOfCoupon,
              state: coupons.state,
              createDate: coupons.createDate,
              expirationDate: coupons.expirationDate,
              codeToRedeem: coupons.codeToRedeem,
              termsAndConditions: coupons.termsAndConditions,
              idAllies: coupons.idAllies,
              nameAllies: coupons.nameAllies,
              idHeadquarters: coupons.idHeadquarters,
              nameHeadquarters: coupons.nameHeadquarters,
              idDishes: coupons.idDishes,
              nameDishes: coupons.nameDishes,
              numberOfUnits: coupons.numberOfUnits,
              discountRate: coupons.discountRate,
              creationTime: coupons.creationTime,
              expirationTime: coupons.expirationTime,
              codeReferred: coupons.code
            };
            return obj;
          })
        )
      );
  }
}
