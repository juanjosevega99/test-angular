import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Accompaniments } from "../models/Accompaniments";

@Injectable({
  providedIn: "root"
})
export class AccompanimentsService {
  constructor(private httpclient: HttpClient) {}

  postAccompaniment(accompaniment): Observable<Accompaniments> {
    return this.httpclient.post<Accompaniments>(
      environment.UrlBase + "accompaniments",
      accompaniment
    );
  }

  putAccompaniment(accompaniment): Observable<Accompaniments> {
    return this.httpclient.put<Accompaniments>(
      environment.UrlBase + "accompaniments" + accompaniment.id,
      accompaniment
    );
  }

  deleteAccompaniment(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "accompaniments/" + id);
  }

  getAccompaniments(): Observable<any[]> {
    return this.httpclient
      .get<Accompaniments[]>(environment.UrlBase + "accompaniments")
      .pipe(
        map((accompaniments: any[]) =>
          accompaniments.map(accompaniments => {
            let obj = {
              id: accompaniments.id,
              quantity: accompaniments.quantity,
              unitMeasurement: accompaniments.unitMeasurement,
              name: accompaniments.name,
              preparationTime: accompaniments.preparationTime,
              creationDate: accompaniments.creationDate,
              modificationDate: accompaniments.modificationDate,
              numberOfModifications: accompaniments.numberOfModifications,
              state: accompaniments.state,
              typeOfAccompaniment: accompaniments.typeOfAccompaniment,
              accompanimentValue: accompaniments.accompanimentValue,
              idTypeSection: accompaniments.idTypeSection,
              nameTypeSection: accompaniments.nameTypeSection
            };
            return obj;
          })
        )
      );
  }

  getAccompanimentsById(id): Observable<any[]> {
    return this.httpclient
      .get<Accompaniments[]>(environment.UrlBase + "accompaniments/" + id)
      .pipe(
        map((accompaniments: any[]) =>
          accompaniments.map(accompaniments => {
            let obj = {
              id: accompaniments.id,
              quantity: accompaniments.quantity,
              unitMeasurement: accompaniments.unitMeasurement,
              name: accompaniments.name,
              preparationTime: accompaniments.preparationTime,
              creationDate: accompaniments.creationDate,
              modificationDate: accompaniments.modificationDate,
              numberOfModifications: accompaniments.numberOfModifications,
              state: accompaniments.state,
              typeOfAccompaniment: accompaniments.typeOfAccompaniment,
              accompanimentValue: accompaniments.accompanimentValue,
              idTypeSection: accompaniments.idTypeSection,
              nameTypeSection: accompaniments.nameTypeSection
            };
            return obj;
          })
        )
      );
  }
}
