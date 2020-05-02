import { Injectable } from '@angular/core';
import { sendmail } from 'src/app/models/senmailinterface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  constructor(private httpclient:HttpClient) { }

  sendmail(info: sendmail):Observable<any> {
    return this.httpclient.post<any>( environment.UrlBase + "sendmail/", info );
  }
}
