import { Component, OnInit } from '@angular/core';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { Headquarters } from 'src/app/models/Headquarters';
import { Router, ActivatedRoute } from '@angular/router';
import { AlliesService } from 'src/app/services/allies.service';
import { Allies } from 'src/app/models/Allies';


@Component({
  selector: 'app-headquarters-options',
  templateUrl: './headquarters-options.component.html',
  styleUrls: ['./headquarters-options.component.scss']
})
export class HeadquartersOptionsComponent implements OnInit {

  //variables of idAlly
  idAlly: number;
  headquarterByAlly: Headquarters[] = [];

  constructor(private headquarterService: HeadquartersService, private alliesService: AlliesService,
    private _router: Router,
    private _activateRoute: ActivatedRoute, ) {

    this._activateRoute.params.subscribe(params => {
      console.log('Parametro', params['id']);
      this.idAlly = params['id']
      if (this.idAlly >= 0) {
        this.getHeadquarters(this.idAlly)
      }
    });
  }

  ngOnInit() {
  }

  getHeadquarters(identificator) {
    this.alliesService.getAllies().subscribe(allies => {
      let allie: Allies = {}
      allie = allies[identificator]
      let realId = allie.id
      this.headquarterService.getHeadquarters().subscribe(headquarters => {
        headquarters.forEach((headquarters: Headquarters) => {
          if (headquarters.idAllies == realId) {
            const dates: Headquarters = {};
            dates.id = headquarters.id;
            dates.name = headquarters.name
            this.headquarterByAlly.push(dates)
          }
        })
      })

    })
  }
  createHeadquart() {
    this._router.navigate(['/main', 'createHeadquarter', this.idAlly])
  }
  editAlly() {
    this._router.navigate(['/main', 'editAlly', this.idAlly])
  }
  editMenu() {
    this._router.navigate(['/main', 'editmenu', this.idAlly])

  }
  profiles() {
    this._router.navigate(['/main', 'profiles', this.idAlly])
  }

}
