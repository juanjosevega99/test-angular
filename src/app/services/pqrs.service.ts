import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Pqrs } from "../models/Pqrs";

@Injectable({
  providedIn: "root"
})
export class PqrsService {
  constructor(private httpclient: HttpClient) {}

  postPqrs(pqrs): Observable<Pqrs> {
    return this.httpclient.post<Pqrs>(environment.UrlBase + "pqrs", pqrs);
  }

  putPqrs(pqrs): Observable<Pqrs> {
    return this.httpclient.put<Pqrs>(
      environment.UrlBase + "pqrs" + pqrs.id,
      pqrs
    );
  }

  deletePqrs(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "Pqrs/" + id);
  }

  getPqrs(): Observable<any[]> {
    return this.httpclient.get<Pqrs[]>(environment.UrlBase + "pqrs").pipe(
      map((pqrs: any[]) =>
        pqrs.map(pqrs => {
          let obj = {
            id: pqrs._id,
            idUser: pqrs.idUser,
            nameUser: pqrs.nameUser,
            lastNameUser: pqrs.lastNameUser,
            email: pqrs.email,
            gender: pqrs.gender,
            birthday: pqrs.birthday,
            phone: pqrs.phone,
            idAllies: pqrs.idAllies,
            nameAllie: pqrs.nameAllie,
            idHeadquarter: pqrs.idHeadquarter,
            nameHeadquarter: pqrs.nameHeadquarter,
            state: pqrs.state,
            description: pqrs.description,
            reply: pqrs.reply,
            date: pqrs.date
          };
          return obj;
        })
      )
    );
  }

  getCPqrsById(id): Observable<any[]> {
    return this.httpclient.get<Pqrs[]>(environment.UrlBase + "pqrs/" + id).pipe(
      map((pqrs: any[]) =>
        pqrs.map(pqrs => {
          let obj = {
            id: pqrs.id,
            idUser: pqrs.idUser,
            nameUser: pqrs.nameUser,
            lastNameUser: pqrs.lastNameUser,
            email: pqrs.email,
            gender: pqrs.gender,
            birthday: pqrs.birthday,
            phone: pqrs.phone,
            idAllies: pqrs.idAllies,
            nameAllie: pqrs.nameAllie,
            idHeadquarter: pqrs.idHeadquarter,
            nameHeadquarter: pqrs.nameHeadquarter,
            state: pqrs.state,
            description: pqrs.description,
            reply: pqrs.reply
          };
          return obj;
        })
      )
    );
  }
}
