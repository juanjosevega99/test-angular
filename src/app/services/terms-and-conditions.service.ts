import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { TermsAndConditions } from '../models/TermsAndConditions';

@Injectable({
  providedIn: 'root'
})
export class TermsAndConditionsService {

  constructor(private httpclient: HttpClient) { }

  postTermAndCondition(termandcondition): Observable<TermsAndConditions> {
    return this.httpclient.post<TermsAndConditions>(
      environment.UrlBase + "termsandconditions",
      termandcondition
    );
  }

  putTermAndCondition(termandcondition): Observable<TermsAndConditions> {
    return this.httpclient.put<TermsAndConditions>(
      environment.UrlBase + "termsandconditions" + termandcondition.id,
      termandcondition
    );
  }

  deleteTermAndCondition(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "termsandconditions/" + id);
  }

  getTermsAndConditions(): Observable<any[]> {
    return this.httpclient.get<TermsAndConditions[]>(environment.UrlBase + "termsandconditions").pipe(
      map((termsandconditions: any[]) =>
        termsandconditions.map(termsandconditions => {
          let obj = {
            id: termsandconditions.id,
            description: termsandconditions.description
          };
          return obj;
        })
      )
    );
  }

  getTermAndConditionById(id): Observable<any[]> {
    return this.httpclient
      .get<TermsAndConditions[]>(environment.UrlBase + "termsandconditions/" + id)
      .pipe(
        map((termsandconditions: any[]) =>
          termsandconditions.map(termsandconditions => {
            let obj = {
              id: termsandconditions.id,
              description: termsandconditions.description
            };
            return obj;
          })
        )
      );
  }
}
