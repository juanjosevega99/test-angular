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
            allyId: pqrs.allyId,
            nameAllie: pqrs.nameAllie,
            headquarterId: pqrs.headquarterId,
            nameHeadquarter: pqrs.nameHeadquarter,
            state: pqrs.state,
            description: pqrs.description,
            reply: pqrs.reply,
            date: pqrs.date,
            typeOfService: pqrs.typeOfService
          };
          return obj;
        })
      )
    );
  }

  getPqrsByHead(idHead): Observable<any[]> {
    return this.httpclient.get<Pqrs[]>(environment.UrlBase + "pqrs/head/" + idHead).pipe(
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
            allyId: pqrs.allyId,
            nameAllie: pqrs.nameAllie,
            headquarterId: pqrs.headquarterId,
            nameHeadquarter: pqrs.nameHeadquarter,
            state: pqrs.state,
            description: pqrs.description,
            reply: pqrs.reply,
            date: pqrs.date,
            typeOfService: pqrs.typeOfService,
            problemType: pqrs.problemType,
            typeEvent: pqrs.typeEvent,
            nameTypeEvent: pqrs.nameTypeEvent,
            idnameTypeEvent: pqrs.nameTypeEvent,
          };
          return obj;
        })
      )
    );
  }

  getCPqrsById(id): Observable<any> {
    return this.httpclient.get<Pqrs>(environment.UrlBase + "pqrs/" + id).pipe(
      map((pqrs: any) => {
          
          return pqrs;
        })
      )
  }

  updatePqr(idPqr:string, body: any){
    return this.httpclient.put( environment.UrlBase + "pqrs/" + idPqr, body  );
  }
  getPqrsWithOutHeadQ(): Observable<any[]> {
    return this.httpclient.get<Pqrs[]>(environment.UrlBase + "pqrs/pqrswh/" ).pipe(
      map((pqrs: any[]) =>
        pqrs.map(pqrs => {
          let obj = {
            reply: pqrs.reply,
            emailReply: pqrs.emailReply,
            id: pqrs._id,
            idUser: pqrs.idUser,
            email: pqrs.email,
            description: pqrs.description,
            state: pqrs.state,
            date: pqrs.date,
          };
          return obj;
        })
      )
    );
  }
  
}
