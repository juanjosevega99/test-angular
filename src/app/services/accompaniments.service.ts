import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map, retry, catchError } from "rxjs/operators";
import { Accompaniments } from "../models/Accompaniments";
import { throwError } from 'rxjs'

@Injectable({
  providedIn: "root"
})
export class AccompanimentsService {
  constructor(private httpclient: HttpClient) { }


  createAccompaniments(dishId, accompaniments) {
    const url = `${environment.UrlBase}accompaniments`

    const body = {
      dishId,
      accompaniments
    }

		return this.httpclient.post(url, body).pipe(catchError(this.handleError))
  }

  getByDishId(dishId:String) {
    const url = `${environment.UrlBase}accompaniments/dishId/${dishId}`
    return this.httpclient.get(url).pipe(retry(3), catchError(this.handleError))
  }

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
            allyId : accompaniments.allyId,
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
              allyId : accompaniments.allyId,
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
              allyId : accompaniments.allyId,
              multiSelect: accompaniments.multiSelect,
            };
            return obj;
          })
        )
      ); */
  }

  getAllAccompanimentsByAlly(allyId):Observable<Accompaniments[]>{
    return this.httpclient.get<Accompaniments[]>(environment.UrlBase + "accompaniments/accompanimentsbyally/" + allyId).pipe(
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
            allyId : accompaniments.allyId,
            multiSelect: accompaniments.multiSelect,
          };
          return obj;
        })
      )
    );
  }



  private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message)
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`)
		}
		// return an observable with a user-facing error message
		return throwError('Something bad happened; please try again later.')
	}
}
 