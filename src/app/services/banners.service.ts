import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Banners } from "../models/Banners";

@Injectable({
  providedIn: "root"
})
export class BannersService {
  constructor(private httpclient: HttpClient) { }

  postBanner(banner): Observable<Banners> {
    return this.httpclient.post<Banners>(
      environment.UrlBase + "banners",
      banner
    );
  }

  putBanner(banner): Observable<Banners> {
    return this.httpclient.put<Banners>(
      environment.UrlBase + "banners/" + banner.id,
      banner
    );
  }

  deleteBanner(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "banners/" + id);
  }

  getBanners(): Observable<any[]> {
    return this.httpclient.get<Banners[]>(environment.UrlBase + "banners").pipe(
      map((banners: any[]) =>
        banners.map(banners => {
          let obj = {
            id: banners._id,
            logo: banners.logo,
            state: banners.state,
            creationDate: banners.creationDate,
            expirationDate: banners.expirationDate,
            allyId: banners.allyId,
            nameAllies: banners.nameAllies,
            idHeadquarters: banners.idHeadquarters,
            nameHeadquarters: banners.nameHeadquarters,
            description: banners.description,
            name: banners.name,
            imageBanner: banners.imageBanner,
            code: banners.code,
            informative: banners.informative,          };
          return obj;
        })
      )
    );
  }

  getBannerById(id): Observable<Banners> {
    return this.httpclient.get<Banners>(environment.UrlBase + "banners/" + id).pipe(
      map((banners: any) => {
        let obj = {
          id: banners._id,
          logo: banners.logo,
          state: banners.state,
          creationDate: banners.creationDate,
          expirationDate: banners.expirationDate,
          allyId: banners.allyId,
          nameAllies: banners.nameAllies,
          idHeadquarters: banners.idHeadquarters,
          nameHeadquarters: banners.nameHeadquarters,
          description: banners.description,
          name: banners.name,
          imageBanner: banners.imageBanner,
          code: banners.code,
          informative: banners.informative,
        };
        return obj;
      })

    );
  }
}
