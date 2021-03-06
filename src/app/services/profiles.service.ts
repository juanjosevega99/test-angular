import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map, retry } from "rxjs/operators";
import { Profiles } from '../models/Profiles';
import { Headquarters } from '../models/Headquarters';

@Injectable({
  providedIn: "root"
})
export class ProfilesService {
  constructor(private httpclient: HttpClient) {}

  postProfile(profile): Observable<Profiles> {
    return this.httpclient.post(
      environment.UrlBase + "users/createUser",
      profile
    );
  }

  getUsersByHeadQuarterId(headquarterId) {
    const url = `${environment.UrlBase}headquartersHasUsers/headquarterId/${headquarterId}`
    return this.httpclient.get(url).pipe(retry(3))
  }

  putProfile(id,profile) {
    return this.httpclient.put(environment.UrlBase + "profiles/" + id,
      profile
    );
  }

  deleteProfile(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "profiles/" + id);
  }

  getProfiles(): Observable<any[]> {
    return this.httpclient
      .get<Profiles[]>(environment.UrlBase + "profiles")
      .pipe(
        map((profiles: any[]) =>
          profiles.map(profiles => {
            let obj = {
              id: profiles._id,
              state: profiles.state,
              entryDate: profiles.entryDate,
              modificationDate: profiles.modificationDate,
              numberOfModifications: profiles.numberOfModifications,
              allyId: profiles.allyId,
              nameAllie: profiles.nameAllie,
              headquarterId: profiles.headquarterId,
              nameHeadquarter: profiles.nameHeadquarter,
              idCharge: profiles.idCharge,
              nameCharge: profiles.nameCharge,
              permis:profiles.permis,
              userCode: profiles.userCode,
              identification: profiles.identification,
              name: profiles.name,
              email: profiles.email,
              photo: profiles.photo
            };
            return obj;
          })
        )
      );
  }

  getProfileById(id): Observable<any> {
    return this.httpclient.get<any>(environment.UrlBase + "profiles/" + id);
      // .pipe(
      //   map((profiles: any[]) =>
      //     profiles.map(profiles => {
      //       let obj = {
      //         id: profiles.id,
      //         state: profiles.state,
      //         entryDate: profiles.entryDate,
      //         modificationDate: profiles.modificationDate,
      //         numberOfModifications: profiles.numberOfModifications,
      //         allyId: profiles.allyId,
      //         nameAllie: profiles.nameAllie,
      //         headquarterId: profiles.headquarterId,
      //         nameHeadquarter: profiles.nameHeadquarter,
      //         idCharge: profiles.idCharge,
      //         nameCharge: profiles.nameCharge,
      //         permis:profiles.permis,
      //         userCode: profiles.userCode,
      //         identification: profiles.identification,
      //         name: profiles.name,
      //         email: profiles.email,
      //         photo: profiles.photo
      //       };
      //       return obj;
      //     })
      //   )
      // );
  }

  getDomiciliaryProfileByHead(id): Observable<any[]> {
    return this.httpclient
      .get<Profiles[]>(environment.UrlBase + "profiles/domy/" + id)
      .pipe(
        map((profiles: any[]) =>
          profiles.map(profiles => {
            let obj = {
              id: profiles._id,
              state: profiles.state,
              entryDate: profiles.entryDate,
              modificationDate: profiles.modificationDate,
              numberOfModifications: profiles.numberOfModifications,
              allyId: profiles.allyId,
              nameAllie: profiles.nameAllie,
              headquarterId: profiles.headquarterId,
              nameHeadquarter: profiles.nameHeadquarter,
              idCharge: profiles.idCharge,
              nameCharge: profiles.nameCharge,
              permis:profiles.permis,
              userCode: profiles.userCode,
              identification: profiles.identification,
              name: profiles.name,
              email: profiles.email,
              photo: profiles.photo,
              ratings: profiles.ratings
            };
            return obj;
          })
        )
      );
  }

  getAllUsersbyIdHeadquarter(headquarterId){
    return this.httpclient.get(environment.UrlBase + "profiles/profilesbyhq/" + headquarterId)
  }

}
