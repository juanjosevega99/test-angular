import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { AlliesCategories } from "../models/AlliesCategories";

@Injectable({
  providedIn: "root"
})
export class AlliesCategoriesService {
  constructor(private httpclient: HttpClient) {}

  postAllieCategorie(alliecategorie): Observable<AlliesCategories> {
    return this.httpclient.post<AlliesCategories>(
      environment.UrlBase + "allies-categories",
      alliecategorie
    );
  }

  putAllieCategorie(alliecategorie): Observable<AlliesCategories> {
    return this.httpclient.put<AlliesCategories>(
      environment.UrlBase + "allies-categories" + alliecategorie.id,
      alliecategorie
    );
  }

  deleteAllieCategorie(id): Observable<{}> {
    return this.httpclient.delete(
      environment.UrlBase + "allies-categories/" + id
    );
  }

  getAlliesCategories(): Observable<any[]> {
    return this.httpclient
      .get<AlliesCategories[]>(environment.UrlBase + "allies-categories")
      .pipe(
        map((alliescategories: any[]) =>
          alliescategories.map(alliescategories => {
            let obj = {
              id: alliescategories._id,
              name: alliescategories.name
            };
            return obj;
          })
        )
      );
  }

  getAllieCategorieById(id): Observable<any[]> {
    return this.httpclient
      .get<AlliesCategories[]>(environment.UrlBase + "allies-categories/" + id)
      .pipe(
        map((alliescategories: any[]) =>
          alliescategories.map(alliescategories => {
            let obj = {
              id: alliescategories.id,
              name: alliescategories.name
            };
            return obj;
          })
        )
      );
  }
}
