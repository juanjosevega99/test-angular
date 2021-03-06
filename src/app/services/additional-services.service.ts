import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AdditionalServices } from '../models/AdditionalServices';

@Injectable({
  providedIn: 'root'
})
export class AdditionalServicesService {

  constructor(private httpclient: HttpClient) { }

  postAdditionalService(additionalservice):Observable<AdditionalServices>{
    return this.httpclient.post<AdditionalServices>(environment.UrlBase+"additional-services", additionalservice);
  }

  putAdditionalService(additionalservice):Observable<AdditionalServices>{
    return this.httpclient.put<AdditionalServices>(environment.UrlBase+"additional-services"+ additionalservice.id, additionalservice);
  }

  deleteAdditionalService(id):Observable<{}>{
    return this.httpclient.delete(environment.UrlBase+"additional-services/"+id);
  }

  getAdditionalServices(): Observable<any[]>{
    return this.httpclient.get<AdditionalServices[]>(environment.UrlBase+"additional-services").pipe(map( (additionalservices:any[]) => additionalservices.map(
      (additionalservices)=>{
      let obj = {
        id:additionalservices._id,
        additionalServices: additionalservices.additionalServices,
      } 
      return obj;
    })));
  }

  getAdditionalServicesById(id): Observable<any[]>{
    return this.httpclient.get<AdditionalServices[]>(environment.UrlBase+"additional-services/"+id).pipe(map((additionalservices:any[])=>additionalservices.map((additionalservices)=>{
      let obj = {
        id:additionalservices._id,
        additionalServices: additionalservices.additionalServices,
      } 
      return obj;
    })));
  }
}
