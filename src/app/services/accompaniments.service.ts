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
  constructor(private httpclient: HttpClient) { }

  postAccompaniment(accompaniment): Observable<Accompaniments> {
    return this.httpclient.post<Accompaniments>(
      environment.UrlBase + "accompaniments",
      accompaniment
    ).pipe(
      map((accompaniments: any) => {
          let obj = {
            id: accompaniments._id,
            quantity: accompaniments.quantity,
            unitMeasurement: accompaniments.unitMeasurement,
            name: accompaniments.name,
            creationDate: accompaniments.creationDate,
            modificationDate: accompaniments.modificationDate,
            numberOfModifications: accompaniments.numberOfModifications,
            state: accompaniments.state,
            typeOfAccompaniment: accompaniments.typeOfAccompaniment,
            accompanimentValue: accompaniments.accompanimentValue,
            idTypeSection: accompaniments.idTypeSection,
            nameTypeSection: accompaniments.nameTypeSection,
            preparationTimeNumber: accompaniments.preparationTimeNumber,
            preparationTimeUnity: accompaniments.preparationTimeUnity,
            idAllies : accompaniments.idAllies,
            multiSelect: accompaniments.multiSelect,
          };
          return obj;
        }
      )
    );
  }

  putAccompaniment(id,accompaniment){
    return this.httpclient.put(environment.UrlBase + "accompaniments/" + id,
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
              id: accompaniments._id,
              quantity: accompaniments.quantity,
              unitMeasurement: accompaniments.unitMeasurement,
              name: accompaniments.name,
              creationDate: accompaniments.creationDate,
              modificationDate: accompaniments.modificationDate,
              numberOfModifications: accompaniments.numberOfModifications,
              state: accompaniments.state,
              typeOfAccompaniment: accompaniments.typeOfAccompaniment,
              accompanimentValue: accompaniments.accompanimentValue,
              idTypeSection: accompaniments.idTypeSection,
              nameTypeSection: accompaniments.nameTypeSection,
              preparationTimeNumber: accompaniments.preparationTimeNumber,
              preparationTimeUnity: accompaniments.preparationTimeUnity,
              idAllies : accompaniments.idAllies,
              multiSelect: accompaniments.multiSelect,
            };
            return obj;
          })
        )
      );
  }
/*  getProfileById(id): Observable<any> {
    return this.httpclient.get<any>(environment.UrlBase + "profiles/" + id); */
  getAccompanimentsById(id): Observable<any> {
    return this.httpclient.get<any>(environment.UrlBase + "accompaniments/" + id);
      /* .pipe(
        map((accompaniments: any[]) =>
          accompaniments.map(accompaniments => {
            let obj = {
              id: accompaniments.id,
              quantity: accompaniments.quantity,
              unitMeasurement: accompaniments.unitMeasurement,
              name: accompaniments.name,
              creationDate: accompaniments.creationDate,
              modificationDate: accompaniments.modificationDate,
              numberOfModifications: accompaniments.numberOfModifications,
              state: accompaniments.state,
              typeOfAccompaniment: accompaniments.typeOfAccompaniment,
              accompanimentValue: accompaniments.accompanimentValue,
              idTypeSection: accompaniments.idTypeSection,
              nameTypeSection: accompaniments.nameTypeSection,
              preparationTimeNumber: accompaniments.preparationTimeNumber,
              preparationTimeUnity: accompaniments.preparationTimeUnity,
              idAllies : accompaniments.idAllies,
              multiSelect: accompaniments.multiSelect,
            };
            return obj;
          })
        )
      ); */
  }

  getAllAccompanimentsByAlly(idAllies):Observable<Accompaniments[]>{
    return this.httpclient.get<Accompaniments[]>(environment.UrlBase + "accompaniments/accompanimentsbyally/" + idAllies).pipe(
      map((accompaniments: any[]) =>
        accompaniments.map(accompaniments => {
          let obj = {
            id: accompaniments._id,
            quantity: accompaniments.quantity,
            unitMeasurement: accompaniments.unitMeasurement,
            name: accompaniments.name,
            creationDate: accompaniments.creationDate,
            modificationDate: accompaniments.modificationDate,
            numberOfModifications: accompaniments.numberOfModifications,
            state: accompaniments.state,
            typeOfAccompaniment: accompaniments.typeOfAccompaniment,
            accompanimentValue: accompaniments.accompanimentValue,
            idTypeSection: accompaniments.idTypeSection,
            nameTypeSection: accompaniments.nameTypeSection,
            preparationTimeNumber: accompaniments.preparationTimeNumber,
            preparationTimeUnity: accompaniments.preparationTimeUnity,
            idAllies : accompaniments.idAllies,
            multiSelect: accompaniments.multiSelect,
          };
          return obj;
        })
      )
    );
  }
}
 