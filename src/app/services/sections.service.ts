import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Sections } from '../models/Sections';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  constructor(private httpclient: HttpClient) { }

  postSection(section): Observable<Sections> {
    return this.httpclient.post<Sections>(
      environment.UrlBase + "sections",
      section
    );
  }

  putSection(id, section) {
    return this.httpclient.put(environment.UrlBase + "sections/" + id,
      section
    );
  }

  deleteSection(id): Observable<{}> {
    return this.httpclient.delete(environment.UrlBase + "sections/" + id);
  }

  getSections(): Observable<any[]> {
    return this.httpclient.get<Sections[]>(environment.UrlBase + "sections").pipe(
      map((sections: any[]) =>
        sections.map(sections => {
          let obj = {
            id: sections._id,
            name: sections.name,
            multiSelect: sections.multiSelect,
          };
          return obj;
        })
      )
    );
  }

  getSectionById(id): Observable<any[]> {
    return this.httpclient
      .get<Sections[]>(environment.UrlBase + "sections/" + id)
      .pipe(
        map((sections: any[]) =>
          sections.map(sections => {
            let obj = {
              id: sections.id,
              name: sections.name,
              multiSelect: sections.multiSelect,
            };
            return obj;
          })
        )
      );
  }
  getSectionByName(name): Observable<any[]> {
    return this.httpclient
      .get<Sections[]>(environment.UrlBase + "sections/nameSection/" + name)
      .pipe(
        map((sections: any[]) =>
          sections.map(sections => {
            let obj = {
              id: sections._id,
              name: sections.name,
              multiSelect: sections.multiSelect,
            };
            return obj;
          })
        )
      );
  }
}
