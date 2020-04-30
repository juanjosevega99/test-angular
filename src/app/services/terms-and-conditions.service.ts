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
      environment.UrlBase + "terms-and-conditions",
      termandcondition
    );
  }

  putTermAndCondition(termandcondition): Observable<TermsAndConditions> {
    return this.httpclient.put<TermsAndConditions>(
      environment.UrlBase + "terms-and-conditions/" + termandcondition.id,
      termandcondition
    );
  }

  deleteTermAndCondition(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "terms-and-conditions/" + id);
  }

  getTermsAndConditions(): Observable<any[]> {
    return this.httpclient.get<TermsAndConditions[]>(environment.UrlBase + "terms-and-conditions").pipe(
      map((termsandconditions: any[]) =>
        termsandconditions.map(termsandconditions => {
          let obj = {
            id: termsandconditions._id,
            name: termsandconditions.name,
            idTypeTyc: termsandconditions.idTypeTyc,
            nameTypeTyc: termsandconditions.nameTypeTyc,
            description: termsandconditions.description
          };
          return obj;
        })
      )
    );
  }

  getTermAndConditionById(id): Observable<TermsAndConditions> {
    return this.httpclient
      .get<TermsAndConditions>(environment.UrlBase + "terms-and-conditions/" + id)
      .pipe(
        map((termsandconditions: TermsAndConditions) => {
          let obj = {
            id: termsandconditions.id,
            name: termsandconditions.name,
            idTypeTyc: termsandconditions.idTypeTyc,
            nameTypeTyc: termsandconditions.nameTypeTyc,
            description: termsandconditions.description
          };
          return obj;
        })
      );
  }
}
