import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { TypeTermsAndConditions } from "../models/typeTermsAndConditions";

@Injectable({
  providedIn: 'root'
})

export class TypeTermsAndConditionsService {

  constructor(private httpclient: HttpClient) { }
  
  postTypeTermsAndConditions(typeTermsAndConditions): Observable<TypeTermsAndConditions> {
    return this.httpclient.post<TypeTermsAndConditions>(
      environment.UrlBase + "type-terms-and-conditions",
      typeTermsAndConditions
    );
  }

  putTypeTermsAndConditions(typeTermsAndConditions): Observable<TypeTermsAndConditions> {
    return this.httpclient.put<TypeTermsAndConditions>(
      environment.UrlBase + "type-terms-and-conditions" + typeTermsAndConditions.id,
      typeTermsAndConditions
    );
  }

  deleteTypeTermsAndConditions(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "type-terms-and-conditions/" + id);
  }

  getTypeTermsAndConditions(): Observable<any[]> {
    return this.httpclient.get<TypeTermsAndConditions[]>(environment.UrlBase + "type-terms-and-conditions").pipe(
      map((typeTermsAndConditions: any[]) =>
        typeTermsAndConditions.map(tyC => {
          let obj = {
            id: tyC._id,
            name: tyC.name
          };
          return obj;
        })
      )
    );
  }
  
  getTypeTermsAndConditionsById(id): Observable<TypeTermsAndConditions> {
    return this.httpclient
      .get<TypeTermsAndConditions>(environment.UrlBase + "type-terms-and-conditions/" + id)
      .pipe(
        map((typeTermsAndConditions: TypeTermsAndConditions) =>{
            let obj = {
              id: typeTermsAndConditions.id,
              name: typeTermsAndConditions.name
            };
            return obj;
          })
      );
  }

}
