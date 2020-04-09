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



  constructor(private dishesService: DishesService, private promoService: PromotionsService) {

    //inicialization of the table
    this.table = new FormGroup({
      "reference": new FormControl(),
      "name": new FormControl(),
    })

    //inicialization of dishes
    this.dishesService.getDishes().subscribe(res => {
      res.forEach((dish: Dishes) => {
        if (res.length > 0) {
          if (dish.idPromotion != null) {
            this.promoService.getPromotions().subscribe(res => {
              res.forEach((promo: Promotions) => {
                if (dish.idPromotion == promo.id) {
                  const obj: DishPromotion = {};
                  obj.id = promo.id;
                  obj.reference = dish.reference;
                  obj.nameDishesCategories = dish.nameDishesCategories;
                  obj.name = dish.name;
                  obj.photo = promo.photo;
                  obj.price = dish.price;
                  obj.namepromo = promo.name;
                  obj.pricepromo = promo.price
                  obj.promotionStartDate = promo.promotionStartDate
                  obj.endDatePromotion = promo.endDatePromotion
                  obj.state = promo.state
                  this.dishPromoArray.push(obj)
                }
              })
            })

          }
        }
      })
    })

  }

  ngOnInit() {
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
      }]
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
      }]
    }

    this.swallUpdateState(idDish, newstate)
  }

  //method for seaching specific values by name and code
  search(termino?: string, id?: string) {

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
    console.log("campos vacios: ", count);
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
      title: 'Estás seguro?',
      text: "de que deseas actualizar el estado de esta promoción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this.promoService.putPromotion(idDish, newstate).subscribe(res => {
          this.promoService.getPromotions().subscribe(dish => {
            Swal.fire(
              'Actualizado!',
              'success',
            )
          })
        })
      }
    })
  }
}
