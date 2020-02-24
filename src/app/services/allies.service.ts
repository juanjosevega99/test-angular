import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Allies } from '../models/Allies';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlliesService {

  constructor(private httpclient: HttpClient) { }

  postAllie(allie):Observable<Allies>{
    return this.httpclient.post<Allies>(environment.UrlBase+"allies", allie);
  }

  putAllie(allie):Observable<Allies>{
    return this.httpclient.put<Allies>(environment.UrlBase+"allies"+ allie.id, allie);
    //return this.httpclient.put<Allies>(environment.UrlBase+"allies/"+"5e4f0e284087434f002d7e1e", allie);
  }

  deleteAllie(id):Observable<{}>{
    return this.httpclient.delete(environment.UrlBase+"allies/"+id);
    //return this.httpclient.delete(environment.UrlBase+"allies/"+"5e4aff151c9d440000660037");
  }

  getAllies(): Observable<any[]>{
    return this.httpclient.get<Allies[]>(environment.UrlBase+"allies").pipe(map((allies:any[])=>allies.map((allies)=>{
      let obj = {
        name: allies.name,
        nit:allies.nit,
        documentNumber:allies.documentNumber,
        logo:allies.logo,
        color:allies.color,
        idTypeOfEstablishment:allies.idTypeOfEstablishment,
        NumberOfLocations:allies.NumberOfLocations,
        idMealsCategories:allies.idMealsCategories,
        description:allies.description,
        idAttentionSchedule:allies.idAttentionSchedule,
        imagesAllies:allies.imagesAllies,
      } 
      return obj;
    })));
  }

  getAlliesById(id): Observable<any[]>{
    return this.httpclient.get<Allies[]>(environment.UrlBase+"allies/"+id).pipe(map((allies:any[])=>allies.map((allies)=>{
      let obj = {
        name: allies.name,
        nit:allies.nit,
        documentNumber:allies.documentNumber,
        logo:allies.logo,
        color:allies.color,
        idTypeOfEstablishment:allies.idTypeOfEstablishment,
        NumberOfLocations:allies.NumberOfLocations,
        idMealsCategories:allies.idMealsCategories,
        description:allies.description,
        idAttentionSchedule:allies.idAttentionSchedule,
        imagesAllies:allies.imagesAllies,
      } 
      return obj;
    })));
  }
}
