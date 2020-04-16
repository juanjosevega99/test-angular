import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { TypeCoupon } from "../models/typeCoupons";

@Injectable({
    providedIn: 'root'
  })
  export class TypeCouponService {
  
    constructor(private httpclient: HttpClient) { }
  
    postTypeCoupon(typeCoupon): Observable<TypeCoupon> {
      return this.httpclient.post<TypeCoupon>(
        environment.UrlBase + "type-coupones",
        typeCoupon
      );
    }
  
    putTypeCoupon(typeCoupon): Observable<TypeCoupon> {
      return this.httpclient.put<TypeCoupon>(
        environment.UrlBase + "type-coupones" + typeCoupon.id,
        typeCoupon
      );
    }
  
    deleteTypeCoupon(id): Observable<{}> {
      return this.httpclient.delete(environment.UrlBase + "type-coupones/" + id);
    }
  
    getTypeCoupon(): Observable<any[]> {
      return this.httpclient.get<TypeCoupon[]>(environment.UrlBase + "type-coupones").pipe(
        map((typeCoupon: any[]) =>
          typeCoupon.map(typeCoupones => {
            let obj = {
              id: typeCoupones._id,
              name: typeCoupones.name
            };
            return obj;
          })
        )
      );
    }
    
    getTypeCouponById(id): Observable<any[]> {
      return this.httpclient
        .get<TypeCoupon[]>(environment.UrlBase + "type-coupones/" + id)
        .pipe(
          map((typeCoupones: any[]) =>
            typeCoupones.map(typeCoupones => {
              let obj = {
                id: typeCoupones.id,
                name: typeCoupones.name
              };
              return obj;
            })
          )
        );
    }

  }