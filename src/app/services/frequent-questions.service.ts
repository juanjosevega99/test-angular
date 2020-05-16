import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { FrequentQuestions } from "../models/FrequentQuestions";
@Injectable({
  providedIn: 'root'
})
export class FrequentQuestionsService {

  constructor(private httpclient: HttpClient) { }
  postFrequentQuestion(frequentQuestion): Observable<FrequentQuestions> {
    return this.httpclient.post<FrequentQuestions>(
      environment.UrlBase + "frequent-questions",
      frequentQuestion
    );
  }

  putFrequentQuestion(frequentQuestion): Observable<FrequentQuestions> {
    return this.httpclient.put<FrequentQuestions>(
      environment.UrlBase + "frequent-questions/" + frequentQuestion.id,
      frequentQuestion
    );
  }

  deleteFrequentQuestion(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "frequent-questions/" + id);
  }

  getFrequentQuestions(): Observable<any[]> {
    return this.httpclient.get<FrequentQuestions[]>(environment.UrlBase + "frequent-questions").pipe(
      map((frequentQuestions: any[]) =>
        frequentQuestions.map(frequentQuestions => {
          let obj = {
            id: frequentQuestions._id,
            typeFrequentQuestion: frequentQuestions.typeFrequentQuestion,
            description: frequentQuestions.description,
            howPromworks: frequentQuestions.howPromworks,
            howUseProm: frequentQuestions.howUseProm,
            howFindPromo: frequentQuestions.howFindPromo,
            howCouponWorks: frequentQuestions.howCouponWorks,
            howUseCoupon: frequentQuestions.howUseCoupon,
            howGetCoupon: frequentQuestions.howGetCoupon,          
          };
          return obj;
        })
      )
    );
  }

  getFrequentQuestionsById(id): Observable<FrequentQuestions> {
    return this.httpclient
      .get<FrequentQuestions>(environment.UrlBase + "frequent-questions/" + id)
      .pipe(
        map((frequentQuestions: FrequentQuestions) => {
          let obj = {
            id: id,
            typeFrequentQuestion: frequentQuestions.typeFrequentQuestion,
            description: frequentQuestions.description,
            howPromworks: frequentQuestions.howPromworks,
            howUseProm: frequentQuestions.howUseProm,
            howFindPromo: frequentQuestions.howFindPromo,
            howCouponWorks: frequentQuestions.howCouponWorks,
            howUseCoupon: frequentQuestions.howUseCoupon,
            howGetCoupon: frequentQuestions.howGetCoupon,
          };
          return obj;
        })
      );
  }

}
