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
  manageHq: boolean;
  manageProm: boolean;

  //varibales to obtain data
  // attentionSchedule: string;
  arrayAllyManager: any[] = []
  newdateArray = this.arrayAllyManager;
  filteredArray = [];
  // variables for date
  today: Date;
  date: String;
  dateDay: any[] = [];
  //variable of don't results
  noResults = false
  //variable for the loading
  // loading: boolean;

  constructor(
    private _alliesService: AlliesService,
    private _attentionScheduleService: AttentionScheduleService,
    private _headquartService: HeadquartersService,
    private _router: Router,
    private _saveLocalStorageService: SaveLocalStorageService,
    private activatedRoute: ActivatedRoute) {

    this.manageHq = false;
    this.manageProm = false;

    //inicialization for charging the data of a profile to edit
    this.activatedRoute.params.subscribe(params => {
      let identificator = params['id']
      if (identificator == -1) {
        this.manageHq = true;
        this.manageProm = false;
        /* this.manageHq(); */
      } else if (identificator == -2) {
        /* this.manageProm(); */
        this.manageProm = true;
        this.manageHq = false;
      }
    })

    //inicialization local storage IdAlly
    this._saveLocalStorageService.saveLocalStorageIdAlly;
    // inicialization date
    this.today = new Date()
    this.date = this.today.toLocaleString('es-ES',{weekday:'long'});
    // convert the first letter to capital  
    let day = this.date.charAt(0).toUpperCase().concat(this.date.substring(1, this.date.length));

    //inicialization of the table
    this.table = new FormGroup({
      "code": new FormControl(),
      "mealType": new FormControl(),
      "generalsearch": new FormControl(),
    })

    this._alliesService.getAllies().subscribe(allies => {

      allies.forEach((ally: Allies) => {
        let attentionSchedule: any = "";
        this._attentionScheduleService.getAttentionSchedulesById(ally.idAttentionSchedule)
          .subscribe((schedule) => {
            
            console.log('fecha',day);
            let dayDb = schedule.attentionSchedule.find(e => e.day == day)
            let msgSchedule = `${dayDb.from} - ${dayDb.to} `
            attentionSchedule = msgSchedule

          })

        this._headquartService.getHeadquarterByIdAlly(ally.id).subscribe((services: any[]) => {

          let obj: any = {}
          
            


          obj = {
            idAlly: ally.id,
            code: ally.nit,
            logo: ally.logo,
            nameEstablishment: ally.name,
            numberHeadquarters: ally.NumberOfLocations,
            allyType: ally.typeAlly,
            mealType: ally.nameMealsCategories,
            schedules : attentionSchedule

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

  //method for seaching specific values by name and code
  search(termino?: string, id?: string) {

    let count = 0; // save thow values 0 o 1
    let termsearch = '';
    let idsearch = '';

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        count += 1;
        termsearch = this.table.value[i];
        idsearch = i;
      }
    }
    console.log('espacios', count);

    if (count > 0 && count < 2 && !this.table.controls['generalsearch'].value) {

      //  un campo lleno
      this.newdateArray = this.arrayAllyManager.filter(function (ally: Allies) {
        //We test each element of the object to see if one string matches the regexp.
        if (ally[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
          return ally;
        }
      });

      this.filteredArray = this.newdateArray;

      // condition by when don't exit results in the table
      if (this.newdateArray.length == 0) {
        this.noResults = true;

      } else {
        this.noResults = false;
      }

    } else if (count == 2 && this.table.controls['generalsearch'].value) {

      let aux = this.newdateArray;
      this.newdateArray = aux.filter(function (ally: Allies) {
        //We test each element of the object to see if one string matches the regexp.
        if (ally[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
          return ally;
        }
      });

      // condition by when don't exit results in the table
      if (this.newdateArray.length == 0) {
        this.noResults = true;

      } else {
        this.noResults = false;
      }

    }

    else {

      if (this.table.controls['generalsearch'].value) {
      }

      if (count == 0) {
        // campos vacios
        // existe general search?
        this.newdateArray = this.arrayAllyManager;
        if (this.table.controls['generalsearch'].value) {

          this.searchbyterm(this.table.controls['generalsearch'].value);
        }
        // condition by when don't exit results in the table
        if (this.newdateArray.length == 0) {
          this.noResults = true;

        } else {
          this.noResults = false;
        }
      } else {

        // campos llenos
        // existe general search?
        this.newdateArray = this.filteredArray.filter(function (ally: Allies) {
          //We test each element of the object to see if one string matches the regexp.
          if (ally[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
            return ally;
          }
        });
        // condition by when don't exit results in the table
        if (this.newdateArray.length == 0) {
          this.noResults = true;

        } else {
          this.noResults = false;
        }


        if (this.table.controls['generalsearch'].value) {

          this.searchbyterm(this.table.controls['generalsearch'].value);

        }
      }
    }
  }
  //method for general searching 
  searchbyterm(termino: string) {

    termino = termino.toLowerCase();
    var myRegex = new RegExp('.*' + termino + '.*', 'gi');

    // // campos de la tabla
    let count = 0;
    let termsearch = '';
    let idsearch = '';

    for (var i in this.table.value) {
      // search empty fields
      if (this.table.value[i] == null || this.table.value[i] == "") {
        // campo vacio
        count += 1;
      } else {
        termsearch = this.table.value[i];
        idsearch = i;
      }
    }

    if (count > 1) {
      // campos vacios
      this.newdateArray = this.arrayAllyManager.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.code) || myRegex.test(item.nameEstablishment) ||
          myRegex.test(item.numberHeadquarters) || myRegex.test(item.allyType) ||
          myRegex.test(item.mealType) || myRegex.test(item.schedules))
      });
      this.filteredArray = this.newdateArray;
      // condition by when don't exit results in the table
      if (this.newdateArray.length == 0) {
        this.noResults = true;

      } else {
        this.noResults = false;
      }
    } else {
      // un campo lleno
      this.newdateArray = this.filteredArray.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.code) || myRegex.test(item.nameEstablishment) ||
          myRegex.test(item.numberHeadquarters) || myRegex.test(item.allyType) ||
          myRegex.test(item.mealType) || myRegex.test(item.schedules))
      });
      // condition by when don't exit results in the table
      if (this.newdateArray.length == 0) {
        this.noResults = true;

      } else {
        this.noResults = false;
      }
    }
  }
  //method Get in Option Ally
  getInHeadquarts(idAlly:string, i){
    this._saveLocalStorageService.saveLocalStorageIdAlly(idAlly)
    this._router.navigate( ['/main','headquarts',i] )
  }

  //method edit ally
  editAlly(idAlly: string, i) {
    this._saveLocalStorageService.saveLocalStorageIdAlly(idAlly)
    this._router.navigate(['/main', 'editAlly', i])

  }

}
