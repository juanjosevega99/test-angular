import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reserva } from '../models/Reserva';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private httpclient: HttpClient) {}

  postReserva(reserva):Observable<String>{
    return this.httpclient.post<String>(environment.UrlBase+"reservas", reserva);
  }

  getReservas(): Observable<any[]>{
    return this.httpclient.get<Reserva[]>(environment.UrlBase+"reservas").pipe(map((reservas:any[]) => reservas.map((reserva) => { 
      
      let obj = {dateReserva: new Date(reserva.dateReserva), people:reserva.people, isShow:reserva.isShow, table:reserva.table}
      return obj; }))
    );
  }
}
