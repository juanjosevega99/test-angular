import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Charges } from "../models/Charges";

@Injectable({
  providedIn: "root"
})
export class ChargesService {
  constructor(private httpclient: HttpClient) {}

  postCharge(charge): Observable<Charges> {
    return this.httpclient.post<Charges>(
      environment.UrlBase + "charges",
      charge
    );
  }

  putCharge(charge): Observable<Charges> {
    return this.httpclient.put<Charges>(
      environment.UrlBase + "charges" + charge.id,
      charge
    );
  }

  deleteCharge(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "charges/" + id);
  }

  getCharges(): Observable<any[]> {
    return this.httpclient.get<Charges[]>(environment.UrlBase + "charges").pipe(
      map((charges: any[]) =>
        charges.map(charges => {
          let obj = {
            id: charges.id,
            name: charges.name
          };
          return obj;
        })
      )
    );
  }

  getChargeById(id): Observable<any[]> {
    return this.httpclient
      .get<Charges[]>(environment.UrlBase + "charges/" + id)
      .pipe(
        map((charges: any[]) =>
          charges.map(charges => {
            let obj = {
              id: charges.id,
              name: charges.name
            };
            return obj;
          })
        )
      );
  }
}
