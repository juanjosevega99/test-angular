import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { AttentionSchedule } from "../models/AttentionSchedule";

@Injectable({
  providedIn: "root"
})
export class AttentionScheduleService {
  constructor(private httpclient: HttpClient) {}

  postAttentionSchedule(attentionschedule): Observable<AttentionSchedule> {
    return this.httpclient.post<AttentionSchedule>(
      environment.UrlBase + "attention-schedule",
      attentionschedule
    );
  }

  putAttentionSchedule(attentionschedule): Observable<AttentionSchedule> {
    return this.httpclient.put<AttentionSchedule>(
      environment.UrlBase + "attention-schedules" + attentionschedule.id,
      attentionschedule
    );
  }

  deleteAttentionSchedule(id): Observable<{}> {
    return this.httpclient.delete(
      environment.UrlBase + "attention-schedules/" + id
    );
  }

  getAttentionSchedules(): Observable<any[]> {
    return this.httpclient
      .get<AttentionSchedule[]>(environment.UrlBase + "attention-schedule")
      .pipe(
        map((attentionschedules: any[]) =>
          attentionschedules.map(attentionschedules => {
            let obj = {
              id: attentionschedules._id,
              attentionSchedule: attentionschedules.attentionSchedule
            };
            return obj;
          })
        )
      );
  }

  getAttentionSchedulesById(id): Observable<any[]> {
    return this.httpclient
      .get<AttentionSchedule[]>(
        environment.UrlBase + "attentionschedules/" + id
      )
      .pipe(
        map((attentionschedules: any[]) =>
          attentionschedules.map(attentionschedules => {
            let obj = {
              id: attentionschedules.id,
              attentionSchedule: attentionschedules.attentionSchedule
            };
            return obj;
          })
        )
      );
  }
}
