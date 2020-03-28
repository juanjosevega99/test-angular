import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Headquarters } from "../models/Headquarters";

@Injectable({
  providedIn: "root"
})
export class HeadquartersService {
  constructor(private httpclient: HttpClient) {}

  postHeadquarter(headquarter): Observable<Headquarters> {
    return this.httpclient.post<Headquarters>(
      environment.UrlBase + "headquarters",
      headquarter
    );
  }

  putHeadquarter(headquarter): Observable<Headquarters> {
    return this.httpclient.put<Headquarters>(
      environment.UrlBase + "headquarters" + headquarter.id,
      headquarter
    );
  }

  deleteHeadquarter(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "headquarters/" + id);
  }

  getHeadquarters(): Observable<any[]> {
    return this.httpclient
      .get<Headquarters[]>(environment.UrlBase + "headquarters")
      .pipe(
        map((headquarters: any[]) =>
          headquarters.map(headquarters => {
            let obj = {
              id: headquarters._id,
              idAllies: headquarters.idAllies,
              nameAllies: headquarters.nameAllies,
              name: headquarters.name,
              ubication: headquarters.ubication,
              address: headquarters.address,
              numberFloor: headquarters.numberFloor,
              local: headquarters.local,
              generalContact: headquarters.generalContact,
              chargeGC: headquarters.chargeGC,
              mobileGC: headquarters.mobileGC,
              telephoneGC: headquarters.telephoneGC,
              principarlServices: headquarters.principarlServices,
              costPerService: headquarters.costPerService,
              aditionalServices: headquarters.aditionalServices,
              averageDeliveryTime: headquarters.averageDeliveryTime,
              headquartersContact: headquarters.headquartersContact,
              chargeHC: headquarters.chargeHC,
              mobileHC: headquarters.mobileHC,
              telephoneHC: headquarters.telephoneHC,
              emailHC: headquarters.emailHC
            };
            return obj;
          })
        )
      );
  }

  getHeadquarterById(id): Observable<any> {
    return this.httpclient.get<Headquarters>(environment.UrlBase + "headquarters/" + id)
      // .pipe(
      //   map((headquarters: any)=> {
      //       let obj = {
      //         id: headquarters._id,
      //         idAllies: headquarters.idAllies,
      //         nameAllies: headquarters.nameAllies,
      //         name: headquarters.name,
      //         ubication: headquarters.ubication,
      //         address: headquarters.address,
      //         numberFloor: headquarters.numberFloor,
      //         local: headquarters.local,
      //         generalContact: headquarters.generalContact,
      //         chargeGC: headquarters.chargeGC,
      //         mobileGC: headquarters.mobileGC,
      //         telephoneGC: headquarters.telephoneGC,
      //         principarlServices: headquarters.principarlServices,
      //         costPerService: headquarters.costPerService,
      //         aditionalServices: headquarters.aditionalServices,
      //         averageDeliveryTime: headquarters.averageDeliveryTime,
      //         headquartersContact: headquarters.headquartersContact,
      //         chargeHC: headquarters.chargeHC,
      //         mobileHC: headquarters.mobileHC,
      //         telephoneHC: headquarters.telephoneHC,
      //         emailHC: headquarters.emailHC
      //       };
      //       return obj;
      //     }
      //   )
      // );
  }

  getHeadquarterByIdAlly(idAlly){
    return this.httpclient.get(environment.UrlBase + "headquarters/ally/" + idAlly)
  }

}
