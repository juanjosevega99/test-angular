import { Component, OnInit } from '@angular/core';
//services
import { AlliesService } from "../../../../services/allies.service";
import { AttentionScheduleService } from "../../../../services/attention-schedule.service";
import { HeadquartersService } from '../../../../services/headquarters.service';
import { Allies } from '../../../../models/Allies';
@Component({
  selector: 'app-ally-manager',
  templateUrl: './ally-manager.component.html',
  styleUrls: ['./ally-manager.component.scss']
})
export class AllyManagerComponent implements OnInit {

  attentionSchedule: string;
  arrayAllyManager: any[] = []

  constructor(private _alliesService: AlliesService,
    private _attentionScheduleService: AttentionScheduleService,
    private _headquartService: HeadquartersService) {

    this._alliesService.getAllies().subscribe(allies => {
      
      allies.forEach((ally: Allies) => {

        this._attentionScheduleService.getAttentionSchedulesById(ally.idAttentionSchedule)
          .subscribe((schedule) => {
            this.attentionSchedule = schedule['attentionSchedule'][1].from + " - " + schedule['attentionSchedule'][1].to;
          })

        this._headquartService.getHeadquarterByIdAlly(ally.id).subscribe((services: any[]) => {

          let obj: any = {}

          obj = {
            code: ally.nit,
            logo: ally.logo,
            nameEstablishment: ally.name,
            numberHeadquarters: ally.NumberOfLocations,
            allyType: ally.typeAlly,
            mealType: ally.nameMealsCategories,
            schedules: this.attentionSchedule

          }
          if (services) {
            obj.services = services
            obj.url1 = services[0] ? "assets/icons/" + services[0].value + ".png" : ""
            obj.url2 = services[1] ? "assets/icons/" + services[1].value + ".png" : ""
            obj.url3 = services[2] ? "assets/icons/" + services[2].value + ".png" : ""
          } else {
            obj['services'] = null;
          }
          this.arrayAllyManager.push(obj);
        })
      })

    })
  }

  ngOnInit() {


  }

}
