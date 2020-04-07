import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { DishesCategories } from '../models/DishesCategories';

@Injectable({
  providedIn: 'root'
})
export class DishesCategoriesService {

  constructor(private httpclient: HttpClient) { }

  postDishCategory(dishcategory): Observable<DishesCategories> {
    return this.httpclient.post<DishesCategories>(
      environment.UrlBase + "dishes-categories",
      dishcategory
    );
  }

  putDishCategory(dishcategory): Observable<DishesCategories> {
    return this.httpclient.put<DishesCategories>(
      environment.UrlBase + "dishes-categories" + dishcategory.id,
      dishcategory
    );
  }

  deleteDishCategory(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "dishes-categories/" + id);
  }

  getDishCategory(): Observable<any[]> {
    return this.httpclient.get<DishesCategories[]>(environment.UrlBase + "dishes-categories").pipe(
      map((dishcategory: any[]) =>
        dishcategory.map(dishescategories => {
          let obj = {
            id: dishescategories._id,
            name: dishescategories.name
          };
          return obj;
        })
      )
    );
  }

  getDishCategoryById(id): Observable<any[]> {
    return this.httpclient
      .get<DishesCategories[]>(environment.UrlBase + "dishes-categories/" + id)
      .pipe(
        map((dishescategories: any[]) =>
          dishescategories.map(dishescategories => {
            let obj = {
              id: dishescategories.id,
              name: dishescategories.name
            };
            return obj;
          })
        )
      );
  }
}
