import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {

  constructor(private http: HttpClient) {
    /* console.log("Ubicaciones de cundinamarca listo"); */
   }

   getLocations(){
    return this.http.get("https://angeles-navarro.opendatasoft.com/api/records/1.0/search/?dataset=colombia-departamentos-geo&facet=empty0&facet=empty1&refine.empty0=CUNDINAMARCA")
   }
}
