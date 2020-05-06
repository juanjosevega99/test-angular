import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { PromotionsCategories } from "../models/PromotionsCategories";

@Injectable({
  providedIn: 'root'
})
export class PromotionsCategoriesService {

  constructor(private httpclient: HttpClient) { }

  postPromotionCategory(promotioncategory): Observable<PromotionsCategories> {
    return this.httpclient.post<PromotionsCategories>(
      environment.UrlBase + "promotions-categories",
      promotioncategory
    );
  }

  putPromotionCategory(promotioncategory): Observable<PromotionsCategories> {
    return this.httpclient.put<PromotionsCategories>(
      environment.UrlBase + "promotions-categories" + promotioncategory.id,
      promotioncategory
    );
  }

  deletePromotionCategory(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "promotions-categories/" + id);
  }

  getPromotionCategory(): Observable<any[]> {
    return this.httpclient.get<PromotionsCategories[]>(environment.UrlBase + "promotions-categories").pipe(
      map((promotioncategory: any[]) =>
        promotioncategory.map(promotionscategories => {
          let obj = {
            id: promotionscategories._id,
            name: promotionscategories.name,
            imageTypePromotion: promotionscategories.imageTypePromotion
          };
          return obj;
        })
      )
    );
  }

  getPromotionCategoryById(id): Observable<any[]> {
    return this.httpclient
      .get<PromotionsCategories[]>(environment.UrlBase + "promotions-categories/" + id)
      .pipe(
        map((promotionscategories: any[]) =>
          promotionscategories.map(promotionscategories => {
            let obj = {
              id: promotionscategories.id,
              name: promotionscategories.name,
              imageTypePromotion: promotionscategories.imageTypePromotion
            };
            return obj;
          })
        )
      );
  }
}