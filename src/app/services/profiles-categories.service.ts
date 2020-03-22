import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { ProfilesCategories } from '../models/ProfilesCategories';

@Injectable({
  providedIn: 'root'
})
export class ProfilesCategoriesService  {

  constructor(private httpclient: HttpClient) { }

  postProfileCategory(profilecategory): Observable<ProfilesCategories> {
    return this.httpclient.post<ProfilesCategories>(
      environment.UrlBase + "profiles-categories",
      profilecategory
    );
  }

  putProfileCategory(profilecategory): Observable<ProfilesCategories> {
    return this.httpclient.put<ProfilesCategories>(
      environment.UrlBase + "profiles-categories" + profilecategory.id,
      profilecategory
    );
  }

  deleteProfileCategory(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "profiles-categories/" + id);
  }

  getProfileCategory(): Observable<any[]> {
    return this.httpclient.get<ProfilesCategories[]>(environment.UrlBase + "profiles-categories").pipe(
      map((profilecategory: any[]) =>
        profilecategory.map(profilescategories => {
          let obj = {
            id: profilescategories._id,
            name: profilescategories.name
          };
          return obj;
        })
      )
    );
  }

  getProfileCategoryById(id): Observable<any[]> {
    return this.httpclient
      .get<ProfilesCategories[]>(environment.UrlBase + "profiles-categories/" + id)
      .pipe(
        map((profilescategories: any[]) =>
          profilescategories.map(profilescategories => {
            let obj = {
              id: profilescategories.id,
              name: profilescategories.name
            };
            return obj;
          })
        )
      );
  }



}