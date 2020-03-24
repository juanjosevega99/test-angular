import { Component, OnInit } from '@angular/core';
//services
import { AlliesService } from "../../../../services/allies.service";
import { AttentionScheduleService } from "../../../../services/attention-schedule.service";
import { AttentionSchedule } from '../../../../models/AttentionSchedule';
import { log } from 'util';
@Component({
  selector: 'app-ally-manager',
  templateUrl: './ally-manager.component.html',
  styleUrls: ['./ally-manager.component.scss']
})
export class AllyManagerComponent implements OnInit {

  allies: any[] = []
  attentionSchedule: any[] = []

  constructor(private _alliesService: AlliesService,
              private _attentionScheduleService: AttentionScheduleService) {
    this._alliesService.getAllies().subscribe(allies => {
      this.allies = allies
      console.log(this.allies)
    })
    this._attentionScheduleService.getAttentionSchedules().subscribe( attentionschedule => {
      this.attentionSchedule = attentionschedule
      console.log(this.attentionSchedule);
      
    })
  }

  ngOnInit() {


  }
  getAttentionSchedule(idSchedule){
    console.log(idSchedule);
    
  }
}
