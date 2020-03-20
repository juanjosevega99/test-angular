import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Dishes } from "../models/Dishes";

@Injectable({
  providedIn: "root"
})
export class DishesService {
  constructor(private httpclient: HttpClient) {}

  postDishe(dishe): Observable<Dishes> {
    return this.httpclient.post<Dishes>(environment.UrlBase + "dishes/", dishe);
  }

  putDishe(dishe): Observable<Dishes> {
    return this.httpclient.put<Dishes>(
      environment.UrlBase + "dishes" + dishe.id,
      dishe
    );
  }

  deleteDishe(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "dishes/" + id);
  }

  getDishes(): Observable<any[]> {
    return this.httpclient.get<Dishes[]>(environment.UrlBase + "dishes").pipe(
      map((dishes: any[]) =>
        dishes.map(dishes => {
          let obj = {
            id: dishes._id,
            idMealsCategories: dishes.idMealsCategories,
            nameMealsCategories: dishes.nameMealsCategories,
            reference: dishes.reference,
            name: dishes.name,
            creationDate: dishes.creationDate,
            modificationDate: dishes.modificationDate,
            numberOfModifications: dishes.numberOfModifications,
            state: dishes.state,
            price: dishes.price,
            imageDishe: dishes.imageDishe,
            description: dishes.description,
            preparationTime: dishes.preparationTime,
            idAccompaniments: dishes.idAccompaniments,
            idPromotion: dishes.idPromotion
          };
          return obj;
        })
      )
    );
  }

  getDisheById(id): Observable<any[]> {
    return this.httpclient
      .get<Dishes[]>(environment.UrlBase + "dishes/" + id)
      .pipe(
        map((dishes: any[]) =>
          dishes.map(dishes => {
            let obj = {
              id: dishes.id,
              idMealsCategories: dishes.idMealsCategories,
              nameMealsCategories: dishes.nameMealsCategories,
              reference: dishes.reference,
              name: dishes.name,
              creationDate: dishes.creationDate,
              modificationDate: dishes.modificationDate,
              numberOfModifications: dishes.numberOfModifications,
              state: dishes.state,
              price: dishes.price,
              imageDishe: dishes.imageDishe,
              description: dishes.description,
              preparationTime: dishes.preparationTime,
              idAccompaniments: dishes.idAccompaniments,
              idPromotion: dishes.idPromotion
            };
            return obj;
          })
        )
      );
  }
}
