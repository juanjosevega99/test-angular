import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { DishesService } from 'src/app/services/dishes.service';
import { Dishes } from 'src/app/models/Dishes';
import { PromotionsService } from 'src/app/services/promotions.service';
import { Promotions } from 'src/app/models/Promotions';
import { DishPromotion } from "src/app/models/DishPromotion";
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-promo-manager',
  templateUrl: './promo-manager.component.html',
  styleUrls: ['./promo-manager.component.scss']
})
export class PromoManagerComponent implements OnInit {

  //object that saves the values of the table
  table: FormGroup;

  //variables for  search
  generalsearch: string;
  terminoaux = '';
  newArrarSearch: DishPromotion[] = [];
  filteredArray: DishPromotion[] = []

  dishgetting: DishPromotion[] = [];
  dishPromoArray = this.dishgetting;

  today: Date;
  loadingDishes = false;
  noDishes: boolean;
  noResults: boolean;
  flagState: boolean;

  constructor(private dishesService: DishesService, private promoService: PromotionsService, private _router: Router) {

    //inicialization of the table
    this.table = new FormGroup({
      "reference": new FormControl(),
      "name": new FormControl(),
    })

    this.noResults = false;
    this.noDishes = false;

    this.loadPromos();
    this.flagState = false;

  }

  ngOnInit() {

  }

  loadPromos() {
    //inicialization of dishes
    this.dishPromoArray = [];
    this.loadingDishes = true;

    this.dishesService.getDishesByIdAlly(localStorage.getItem('idAlly')).subscribe(res => {
      if (res.length) {
        res.forEach((dish: Dishes) => {
          if (dish.idPromotion != null) {
            for (let item = 0; item < dish.idPromotion.length; item++) {
              let iditem = dish.idPromotion[item];

              this.promoService.getAllPromotionsByAlly(localStorage.getItem('idAlly')).subscribe(res => {
                if (res.length) {
                  res.forEach((promo: Promotions) => {
                    if (iditem == promo.id) {

                      let yf = promo.endDatePromotion[0]['year'];
                      let mf = promo.endDatePromotion[0]['month'] - 1;
                      let df = promo.endDatePromotion[0]['day'];
                      let hf = promo.endDatePromotion[1]['hour'];
                      let minf = promo.endDatePromotion[1]['minute'];
                      let dateF = new Date(`${yf}-${mf}-${df}`).getTime();
                      let datee = new Date(yf, mf, df, hf, minf)

                      let ys = promo.promotionStartDate[0]['year'];
                      let ms = promo.promotionStartDate[0]['month'] - 1;
                      let ds = promo.promotionStartDate[0]['day'];
                      let hs = promo.promotionStartDate[1]['hour'];
                      let mins = promo.promotionStartDate[1]['minute'];
                      let dateS = new Date(`${ys}-${ms}-${ds}`).getTime();
                      let datei = new Date(ys, ms, ds, hs, mins)

                      let diff = dateF - dateS;

                      this.today = new Date();
                      let datetoday = this.convertDateDay(this.today);

                      let datestart = this.convertDateDay(datei);
                      let timei = this.convertDateTime(datei);

                      let datefinish = this.convertDateDay(datee);
                      let timee = this.convertDateTime(datee);

                      const obj: DishPromotion = {};

                      obj.id = promo.id;
                      obj.reference = `${dish.reference}-${item + 1}`;
                      obj.nameDishesCategories = dish.nameDishesCategories;
                      obj.name = dish.name;
                      obj.photo = promo.photo;
                      obj.price = dish.price;
                      obj.namepromo = promo.name;
                      obj.pricepromo = promo.price;
                      obj.daysPromo = diff / (1000 * 60 * 60 * 24);
                      obj.promotionStartDate = promo.promotionStartDate;
                      obj.timestart = timei;
                      obj.endDatePromotion = promo.endDatePromotion;
                      obj.timeend = timee;


                      if (this.today >= datei && this.today <= datee) {
                        if (promo.flag == true) {
                          obj.state = promo.state;
                        } else {
                          let stateDate: any = [{
                            state: "active",
                            check: true
                          }, {
                            state: "inactive",
                            check: false
                          }]
                          obj.state = stateDate
                        }

                      } else if (this.today > datee || this.today < datei) {
                        let stateDate: any = [{
                          state: "active",
                          check: false
                        }, {
                          state: "inactive",
                          check: true
                        }]
                        obj.state = stateDate
                      }

                      this.dishPromoArray.push(obj)
                      const promee: Promotions = { reference: `${dish.reference}-${item + 1}`, state: obj.state };
                      this.promoService.putPromotion(iditem, promee).subscribe(res => { })
                    }
                  })
                  this.loadingDishes = false;
                } else {
                  this.noDishes = true;
                  this.loadingDishes = false;
                }
              })
            }
          } else {
            this.loadingDishes = false;
          }

        })

      } else {
        this.noDishes = true;
        this.loadingDishes = false;
      }
    })
  }

  //method for updating the state to active
  changeStateA(idDish) {

    let newstate: object = {
      state: [{
        state: "active",
        check: true
      }, {
        state: "inactive",
        check: false
      }],

    }
    this.swallUpdateState(idDish, newstate)
  }

  //method for updating the state to inactive
  changeStateI(idDish) {
    let newstate: object = {
      state: [{
        state: "active",
        check: false
      }, {
        state: "inactive",
        check: true
      }],

      flag: true
    }

    this.swallUpdateState(idDish, newstate)
  }

  //method for very the dates
  verifyDate(idDish, i) {
    this.promoService.getAllPromotionsByAlly(localStorage.getItem('idAlly')).subscribe(promos => {

      let promo = promos[i]

      //console.log(promo);

      let yf = promo.endDatePromotion[0]['year'];
      let mf = promo.endDatePromotion[0]['month'] - 1;
      let df = promo.endDatePromotion[0]['day'];
      let hf = promo.endDatePromotion[1]['hour'];
      let minf = promo.endDatePromotion[1]['minute'];

      // console.log(yf, mf, df, hf, minf);

      let datee = new Date(yf, mf, df, hf, minf)

      let ys = promo.promotionStartDate[0]['year'];
      let ms = promo.promotionStartDate[0]['month'] - 1;
      let ds = promo.promotionStartDate[0]['day'];
      let hs = promo.promotionStartDate[1]['hour'];
      let mins = promo.promotionStartDate[1]['minute'];

      let datei = new Date(ys, ms, ds, hs, mins)

      this.today = new Date()

      if (this.today > datee) {

        Swal.fire({
          title: 'Actualizar',
          html: "Las fechas de la promoción están <b>vencidas</b>, Ingresa nuevas fechas para activar!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Si, actualizar!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/main', 'createDish', promo.reference])
          } else {
            this.loadPromos();
          }
        })

      } else if (this.today < datei) {

        Swal.fire({
          title: 'Actualizar',
          html: "<b>Faltan días</b>, para activar la promoción ingresa nuevas fechas!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Si, actualizar!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/main', 'createDish', promo.reference])
          } else {
            this.loadPromos();
          }
        })
      }
      else {
        this.changeStateA(idDish)
      }
    })
  }

  //methods to convert date
  convertDateDay(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  convertDateTime(time: Date): string {
    const d = new Date(time);
    const n = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return n;
  }

  //method for seaching a specific values by name and code
  search(termino?: string, id?: string) {
    let count = 0;
    let termsearch = '';
    let idsearch = '';

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        count += 1;
        termsearch = this.table.value[i];
        idsearch = i;
      } else {
        this.noResults = true;
      }
    }


    if (count > 0 && count < 2 && !this.generalsearch) {

      //  un campo lleno
      this.dishPromoArray = this.dishgetting.filter(function (dish: Dishes) {
        //We test each element of the object to see if one string matches the regexp.
        if (dish[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
          return dish;
        }
      });

      this.filteredArray = this.dishPromoArray;

    } else if (count == 2 && this.generalsearch) {

      let aux = this.dishPromoArray;

      this.dishPromoArray = aux.filter(function (dish: Dishes) {
        //We test each element of the object to see if one string matches the regexp.
        if (dish[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
          return dish;
        }
      });

    }
    else {

      if (this.generalsearch) {

      }

      if (count == 0) {
        // campos vacios
        // existe general search?
        this.dishPromoArray = this.dishgetting;

        if (this.generalsearch) {
          /* console.log("buscando general searhc"); */
          this.searchbyterm(this.generalsearch);

        }
      } else {
        // campos llenos
        // existe general search?
        this.dishPromoArray = this.filteredArray.filter(function (dish: Dishes) {
          //We test each element of the object to see if one string matches the regexp.
          if (dish[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
            return dish;
          }
        });

        if (this.generalsearch) {
          /* console.log("buscando general searhc"); */
          this.searchbyterm(this.generalsearch);
        }
      }
    }
  }

  //method for general searching 
  searchbyterm(termino: string) {
    termino = termino.toLowerCase();
    var myRegex = new RegExp('.*' + termino + '.*', 'gi');

    // campos de la tabla
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
    /* console.log("campos vacios: ", count); */
    if (count > 1) {
      // campos vacios
      this.dishPromoArray = this.dishgetting.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.pricepromo.toString()) || myRegex.test(item.namepromo) ||
          myRegex.test(item.endDatePromotion[0].toString())) || myRegex.test(item.promotionStartDate[0].toString()) || myRegex.test(item.name)
      });
      this.filteredArray = this.dishPromoArray;

    } else {
      // un campo lleno

      this.dishPromoArray = this.filteredArray.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.pricepromo.toString()) || myRegex.test(item.namepromo) ||
          myRegex.test(item.endDatePromotion.toString())) || myRegex.test(item.promotionStartDate.toString()) || myRegex.test(item.name)
      });
    }
  }

  //sweet alerts
  swallUpdateState(idDish, newstate) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas actualizar el estado de esta promoción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this.loadingDishes = true;
        this.promoService.putPromotion(idDish, newstate).subscribe(res => {

          this.promoService.getAllPromotionsByAlly(localStorage.getItem("idAlly")).subscribe(dish => {
            this.loadingDishes = false;
            Swal.fire({
              text: "Estado actualizado!!",
              icon: 'success',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            })
          })
        })
      }
    })
  }


}
