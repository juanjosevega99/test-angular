import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
//services
import { AlliesService } from "../../../../services/allies.service";
import { AttentionScheduleService } from "../../../../services/attention-schedule.service";
import { HeadquartersService } from '../../../../services/headquarters.service';
import { Allies } from '../../../../models/Allies';
import { Router, ActivatedRoute } from '@angular/router';
import { SaveLocalStorageService } from "../../../../services/save-local-storage.service";
@Component({
  selector: 'app-ally-manager',
  templateUrl: './ally-manager.component.html',
  styleUrls: ['./ally-manager.component.scss']
})
export class AllyManagerComponent implements OnInit {

  //object that saves the values of the table
  table: FormGroup;

  //flags to redirect: headquarters and promotions
  manageHq = false;
  manageProm = true;

  //variable to get headquaerters

  //varibales to get data
  arrayAllyManager: any[] = []
  newArray = this.arrayAllyManager;
  filteredArray = [];
  // variables for date
  today: Date;
  date: String;
  dateDay: any[] = [];
  //variable of don't results
  noResults = false
  loadingAllies = false;

  // array for search headquuarters
  arrayHeadquarter: any;
  //variables for general search
  generalsearch: string = "";

  constructor(
    private _alliesService: AlliesService,
    private _attentionScheduleService: AttentionScheduleService,
    private _headquartService: HeadquartersService,
    private _router: Router,
    private _saveLocalStorageService: SaveLocalStorageService,
    private activatedRoute: ActivatedRoute) {

    //clean local storage  for ally and headquarter
    this._saveLocalStorageService.saveLocalStorageIdAlly("");
    this._saveLocalStorageService.saveLocalStorageIdHeadquarter("");


    //inicialization for charging the data of a profile to edit
    this.activatedRoute.params.subscribe(params => {
      let identificator = params['id']
      if (identificator == -1) {
        this.manageHq = true;
        this.manageProm = false;
      } else if (identificator == -2) {
        this.manageProm = true;
        this.manageHq = false;
      }
    })

    // inicialization date
    this.today = new Date()
    this.date = this.today.toLocaleString('es-ES', { weekday: 'long' });
    // convert the first letter to capital  
    let day = this.date.charAt(0).toUpperCase().concat(this.date.substring(1, this.date.length));

    //inicialization of the table
    this.table = new FormGroup({
      "code": new FormControl(),
      "mealType": new FormControl(),
    })

    this.loadingAllies = true;
    this._alliesService.getAllies().subscribe(allies => {

      if (allies.length) {

        allies.forEach((ally: Allies, index) => {
          let attentionSchedule: any = "";
          let headquartersByIdAlly = [];
  
          this._attentionScheduleService.getAttentionSchedulesById(ally.idAttentionSchedule)
            .subscribe((schedule) => {
              let dayDb = schedule.attentionSchedule.find(e => e.day == day)
              let msgSchedule = `${dayDb.from} - ${dayDb.to} `
              attentionSchedule = msgSchedule
            })
  
          this._headquartService.getHeadquarterByAllIdAlly(ally.id).subscribe(headquarter => {
            this.arrayHeadquarter = headquarter
            this.arrayHeadquarter.forEach(element => {
              let obj = {
                id: element._id,
                name: element.name
              }
              headquartersByIdAlly.push(obj)
            });
          })
  
          this._headquartService.getHeadquarterByIdAlly(ally.id).subscribe((services: any[]) => {
  
            let obj: any = {}
  
            obj = {
              allyId: ally.id,
              code: ally.nit,
              logo: ally.logo,
              nameEstablishment: ally.name,
              numberHeadquarters: ally.NumberOfLocations,
              allyType: ally.typeAlly,
              mealType: ally.nameMealsCategories,
              schedules: attentionSchedule,
              nameHq: headquartersByIdAlly
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
  
          if (index === (allies.length - 1)) {
            this.loadingAllies = false;
          }
  
        })
      } else {
        this.loadingAllies = false;
      }

    })
  }
  ngOnInit() {

  }
  //method for a specific search
  search() {

    let objsearch = {
      code: "",
      mealType: ""
    };

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        objsearch[i] = this.table.value[i];
      }
    }

    // let for general searh
    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    this.newArray = this.arrayAllyManager.
      filter(function (ally) {
        if (ally["mealType"].toLowerCase().indexOf(this.mealType) >= 0) {
          return ally;
        }
      }, objsearch).
      filter(function (ally) {
        if (ally["code"].toLowerCase().indexOf(this.code) >= 0) {
          return ally;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.code) || myRegex.test(item.nameEstablishment) ||
          myRegex.test(item.nameTypeOfCoupon) || myRegex.test(item.allyType) ||
          myRegex.test(item.mealType) || myRegex.test(item.schedules) || myRegex.test(item.numberHeadquarters))

      })
    // condition by when don't exit results in the table
    if (this.newArray.length == 0) {
      this.noResults = true;

    } else {
      this.noResults = false;
    }

  }

  //method Get in Option Ally
  getInHeadquarts(allyId: string, i) {
    this._saveLocalStorageService.saveLocalStorageIdAlly(allyId)
    this._router.navigate(['/main', 'headquarts', i])
  }

  //method for charging promotions by Ally
  promosByAlly(allyId: string, i) {
    this._saveLocalStorageService.saveLocalStorageIdAlly(allyId)
    this._router.navigate(['/main', 'promoManager'])
  }

  //method edit ally
  editAlly(allyId: string, i) {
    this._saveLocalStorageService.saveLocalStorageIdAlly(allyId)
    this._router.navigate(['/main', 'editAlly', i])

  }

}
