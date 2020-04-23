import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Promotions } from "../models/Promotions";

@Injectable({
  providedIn: "root"
})
export class PromotionsService {
  constructor(private httpclient: HttpClient) {}

  postPromotion(promotion): Observable<Promotions> {
    return this.httpclient.post<Promotions>(
      environment.UrlBase + "promotions",
      promotion
    );
  }
  
  putPromotion(id , promotion) {
    return this.httpclient.put(
      environment.UrlBase + "promotions/" + id,
      promotion
    );
  }

  deletePromotion(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "promotions/" + id);
  }

  getPromotions(): Observable<any[]> {
    return this.httpclient
      .get<Promotions[]>(environment.UrlBase + "promotions")
      .pipe(
        map((promotions: any[]) =>
          promotions.map(promotions => {
            let obj = {
              id: promotions._id,
              state: promotions.state,
              promotionStartDate: promotions.promotionStartDate,
              endDatePromotion: promotions.endDatePromotion,
              name: promotions.name,
              idname: promotions.idname,
              price: promotions.price,
              photo: promotions.photo,
              description: promotions.description,
              preparationTime: promotions.preparationTime,
              reference: promotions.reference,
              numberOfModifications : promotions.numberOfModifications,
              idAccompaniments: promotions.idAccompaniments
            };
            return obj;
          })
        )
      );
  }

  getPromotionById(id): Observable<any[]> {
    return this.httpclient
      .get<Promotions[]>(environment.UrlBase + "promotions/" + id)
      .pipe(
        map((promotions: any[]) =>
          promotions.map(promotions => {
            let obj = {
              id: promotions._id,
              state: promotions.state,
              promotionStartDate: promotions.promotionStartDate,
              endDatePromotion: promotions.endDatePromotion,
              name: promotions.name,
              idname: promotions.idname,
              price: promotions.price,
              photo: promotions.photo,
              description: promotions.description,
              preparationTime: promotions.preparationTime,
              reference: promotions.reference,
              numberOfModifications : promotions.numberOfModifications,
              idAccompaniments: promotions.idAccompaniments
            };
            return obj;
          })
        )
      );
  }
}
