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
  constructor(private httpclient: HttpClient) { }

  postHeadquarter(headquarter): Observable<Headquarters> {
    return this.httpclient.post<Headquarters>(
      environment.UrlBase + "headquarters",
      headquarter
    );
  }

  putHeadquarter(id, headquarter) {
    return this.httpclient.put(environment.UrlBase + "headquarters/" + id,
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
              allyId: headquarters.allyId,
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
              emailGeneral: headquarters.emailGeneral,
              code: headquarters.code,
              principarlServices: headquarters.principarlServices,
              costPerService: headquarters.costPerService,
              aditionalServices: headquarters.aditionalServices,
              typeOfPlans: headquarters.typeOfPlans,
              averageDeliveryTime: headquarters.averageDeliveryTime,
              headquartersContact: headquarters.headquartersContact,
              chargeHC: headquarters.chargeHC,
              mobileHC: headquarters.mobileHC,
              telephoneHC: headquarters.telephoneHC,
              emailHC: headquarters.emailHC,
              markerLocation: headquarters.markerLocation,
              zone:headquarters.zone,
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
    //         allyId: headquarters.allyId,
    //         nameAllies: headquarters.nameAllies,
    //         name: headquarters.name,
    //         ubication: headquarters.ubication,
    //         zone:headquarters.zone,
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
    //         typeOfPlans: headquarters.typeOfPlans,
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

  getHeadquarterByIdAlly(allyId) {
    return this.httpclient.get(environment.UrlBase + "headquarters/ally/" + allyId)
  }
  getHeadquarterByAllIdAlly(allyId) {
    return this.httpclient.get(environment.UrlBase + "headquarters/allAlly/" + allyId)
  }

}
