import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { reservation } from '../models/reservation'

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor( private httpclient: HttpClient ) { }

  getReservations():Observable<reservation []>{

    return this.httpclient.get<reservation[]>( environment.UrlBase + "reservation" );

  }

  getReservationsByHeadquart( id ):Observable<reservation []>{

    return this.httpclient.get<reservation[]>( environment.UrlBase + "reservation/head/" + id );

  }


  postReservation(reservation):Observable<String>{
    return this.httpclient.post<String>(environment.UrlBase + "reservation", reservation);
  }

  putReservation(reservation): Observable<reservation>{
    return this.httpclient.put <reservation> ( environment.UrlBase + "reservation/" + reservation.id, reservation );
  }

  deleteReservation(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "reservation/" + id);
  }

}
