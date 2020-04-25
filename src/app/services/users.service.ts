import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Users } from '../models/Users';

@Injectable({
  providedIn: "root"
  
})
export class UsersService {
  constructor(private httpclient: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.httpclient.get<Users[]>(environment.UrlBase + "users").pipe(
      map((users: any[]) =>
        users.map(users => {
          let obj = {
            id: users._id,
            name: users.name,
            lastname: users.lastname,
            email: users.email,
            gender: users.gender,
            birthday: users.birthday,
            phone: users.phone,
            password: users.password,
            idsPromos: users.idsPromos
          };
          return obj;
        })
      )
    );
  }

  getUserById( id:string ){
    return this.httpclient.get( environment.UrlBase + "users/" + id );
  }

}
