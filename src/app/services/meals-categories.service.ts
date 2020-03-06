import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { MealsCategories } from '../models/MealsCategories';

@Injectable({
  providedIn: 'root'
})
export class MealsCategoriesService {

  constructor(private httpclient: HttpClient) { }

  postMealCategorie(mealcategorie): Observable<MealsCategories> {
    return this.httpclient.post<MealsCategories>(
      environment.UrlBase + "meals-categories",
      mealcategorie
    );
  }

  putMealCategorie(mealcategorie): Observable<MealsCategories> {
    return this.httpclient.put<MealsCategories>(
      environment.UrlBase + "meals-categories" + mealcategorie.id,
      mealcategorie
    );
  }

  deleteMealCategorie(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "meals-categories/" + id);
  }

  getMealsCategories(): Observable<any[]> {
    return this.httpclient.get<MealsCategories[]>(environment.UrlBase + "meals-categories").pipe(
      map((mealscategories: any[]) =>
        mealscategories.map(mealscategories => {
          let obj = {
            id: mealscategories._id,
            name: mealscategories.name
          };
          return obj;
        })
      )
    );
  }

  getMealCategorieById(id): Observable<any[]> {
    return this.httpclient
      .get<MealsCategories[]>(environment.UrlBase + "meals-categories/" + id)
      .pipe(
        map((mealscategories: any[]) =>
          mealscategories.map(mealscategories => {
            let obj = {
              id: mealscategories.id,
              name: mealscategories.name
            };
            return obj;
          })
        )
      );
  }
}
