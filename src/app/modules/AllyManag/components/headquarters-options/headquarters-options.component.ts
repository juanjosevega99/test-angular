import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// services
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { AlliesService } from 'src/app/services/allies.service';
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service";
//modules
import { Headquarters } from 'src/app/models/Headquarters';
import { Allies } from 'src/app/models/Allies';


@Component({
  selector: 'app-headquarters-options',
  templateUrl: './headquarters-options.component.html',
  styleUrls: ['./headquarters-options.component.scss']
})
export class HeadquartersOptionsComponent implements OnInit {

  //variables of idAlly
  idAlly: number;
  identificador:number;
  // array for search headquuarters
  arrayHeadquarter: any;
  headquartersByIdAlly: any[] = [];
  idHeadquarter: string;
  // flags
  alertDontRegisters = false;
  //enbles options headquarters
  enableInfHeadquarter= true;
  enableEditMenu = true;
  enableProfiles = true;
  constructor(
    private headquarterService: HeadquartersService,
    private alliesService: AlliesService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _saveLocalStorageService: SaveLocalStorageService) {

    //inicialization local storage IdAlly
    this._saveLocalStorageService.saveLocalStorageIdAlly;

    //inicialization for charging the data of an Ally to headquarter
    this._activateRoute.params.subscribe(params => {

      let idAlly = this._saveLocalStorageService.getLocalStorageIdAlly();
     this.identificador = params['id']

      this.headquarterService.getHeadquarterByAllIdAlly(idAlly).subscribe(headquarter => {
        if (headquarter != "") {
          this.arrayHeadquarter = headquarter
          this.arrayHeadquarter.forEach(element => {

            let obj = {
              id: element._id,
              name: element.name
            }
            this.headquartersByIdAlly.push(obj)

          });
        } else {
          this.alertDontRegisters = true;
        }

      })
    });
  }

  ngOnInit() {
  }
  seeNameHeadquarter(selected: any) {

    this.headquartersByIdAlly.forEach(element => {
      if (this.idHeadquarter == element.id) {
        this._saveLocalStorageService.saveLocalStorageIdHeadquarter(element.id)
        this.enableInfHeadquarter= false;
        this.enableEditMenu = false;
        this.enableProfiles = false;
      }
    });
  }

  // getHeadquarters(identificator) {
  //   this.alliesService.getAllies().subscribe(allies => {
  //     let allie: Allies = {}
  //     allie = allies[identificator]
  //     let realId = allie.id
  //     this.headquarterService.getHeadquarters().subscribe(headquarters => {
  //       headquarters.forEach((headquarters: Headquarters) => {
  //         if (headquarters.idAllies == realId) {
  //           const dates: Headquarters = {};
  //           dates.id = headquarters.id;
  //           dates.name = headquarters.name
  //           this.headquarterByAlly.push(dates)
  //         }
  //       })
  //     })

  //   })
  // }
  createHeadquart() {
    if(localStorage.getItem('idHeadquarter')){
      localStorage.removeItem('idHeadquarter');
    }
    this._router.navigate(['/main', 'createHeadquarter', this.identificador])
  }
  editAlly() {
    this._router.navigate(['/main', 'editAlly', this.identificador])
  }
  editHeadquarter() {
    this._router.navigate(['/main', 'editHeadquarter',this.identificador])
  }
  editMenu() {
    this._router.navigate(['/main', 'editmenu', this.identificador])

  }
  profiles() {
    this._router.navigate(['/main', 'profiles', this.identificador])
  }

}
