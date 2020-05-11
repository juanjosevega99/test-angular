import { Component } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { DishesService } from 'src/app/services/dishes.service';
import { Dishes } from 'src/app/models/Dishes';
import { DishList } from 'src/app/models/DishList';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent {

  //object that saves the values of the table
  table: FormGroup;

  //variables for general search
  generalsearch: string;
  terminoaux = '';

  //variables for the state
  selectedA: [] = []
  selectedD: [] = []

  //varibales to obtain data
  dishesgetting: DishList[] = [];
  newdateArray = this.dishesgetting;
  newArrarSearch: Dishes[] = [];
  filteredArray: DishList[] = []

  //variables for modification date
  time: string;
  date: string;
  modificationDate: Date;
  modification: Date;

  state: any[] = [];

  //variables of idAlly
  idAlly: number;
  loadingDishes = false;
  noDishes: boolean;
  noResults: boolean;

  constructor(private dishesService: DishesService,
    private _router: Router,
    private _activateRoute: ActivatedRoute, ) {

    //get Ally's parameter
    this._activateRoute.params.subscribe(params => {
      // console.log('Parametro', params['id']);
      this.idAlly = params['id']
    });

    //inicialization of the table
    this.table = new FormGroup({
      "reference": new FormControl(),
      "name": new FormControl(),
    })

    //inicialization of dishes
    this.loadDishes();
    this.noResults = false;
    this.noDishes = false;

    this.state = [{ name: 'active', selected: false }, { name: 'inactive', selected: false }]

  }


  goBackHeadquarterOptions() {
    this._router.navigate(['/main', 'headquarts', this.idAlly])
  }

  //methods to convert the modification date
  convertDateday(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  convertDatetime(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return n;
  }

  loadDishes() {
    this.loadingDishes = true;
    this.dishesgetting = [];
    this.newdateArray = this.dishesgetting;


    /* this.dishesService.getDishes().subscribe(res => { */
      this.dishesService.getDishesByIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(res => {

        if (Object.keys(res).length) {
          for (let x in res) {
            let dish: Dishes
            dish = res[x]

            const obj: DishList = {};
            obj.id = dish.id;
            obj.reference = dish.reference;
            obj.nameDishesCategories = dish.nameDishesCategories;
            obj.name = dish.name;
            obj.imageDishe = dish.imageDishe;
            obj.price = dish.price;
            obj.modificationDateDay = this.convertDateday(dish.modificationDate);
            obj.modificationDateTime = this.convertDatetime(dish.modificationDate)
            obj.numberOfModifications = dish.numberOfModifications;
            obj.state = dish.state;

            this.dishesgetting.push(obj);
            this.loadingDishes = false;
          }
        } else {
          this.loadingDishes = false;
          this.noDishes = true;
        }
      })

      /* if (res.length) {
        res.forEach((dish: Dishes, index) => {
          const obj: DishList = {};
          obj.id = dish.id;
          obj.reference = dish.reference;
          obj.nameDishesCategories = dish.nameDishesCategories;
          obj.name = dish.name;
          obj.imageDishe = dish.imageDishe;
          obj.price = dish.price;
          obj.modificationDateDay = this.convertDateday(dish.modificationDate);
          obj.modificationDateTime = this.convertDatetime(dish.modificationDate)
          obj.numberOfModifications = dish.numberOfModifications;
          obj.state = dish.state;

          this.dishesgetting.push(obj);

          if (index == (res.length - 1)) {
            this.loadingDishes = false;
          }
        })
      } else {
        this.loadingDishes = false;
      }
    }) */
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
    this.swallUpdateState(idDish, newstate);
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
    this.swallUpdateState(idDish, newstate);
  }

  //method for seaching specific values by name and code
  search() {

    // vars to filter table
    let objsearch = {
      reference: "",
      name: ""
    };

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {

        objsearch[i] = this.table.value[i];
      }  else {
        this.noResults = true;
      }
    }

    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');


    this.newdateArray = this.dishesgetting.
      filter(function (dish) {
        if (dish["reference"].toLowerCase().indexOf(this.reference) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["name"].toLowerCase().indexOf(this.name) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.modificationDateDay) || myRegex.test(item.modificationDateTime) ||
          myRegex.test(item.numberOfModifications.toString()))
      })

  }



  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }


  //method for the state
  State(value: string, event) {
    const check = event.target.checked;
    
    this.dishesService.getDishes().subscribe(res => {
      res.forEach((dish: Dishes) => {
        let state: any = []
        state = dish.state
      })
    })
  }

  //method to convert modification date
  tick(): void {
    const aux = this.newdateArray;
    aux.forEach(item => {
      this.modificationDate = item['modificationDate']
      this.modification = new Date(this.modificationDate)
      this.time = this.modification.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.date = this.modification.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    })
  }

  //sweets alerts
  swallUpdateState(idDish, newState) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas actualizar el estado de este plato!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this.loadingDishes = true;
        this.dishesService.putDishe(idDish, newState).subscribe(res => {
          this.dishesService.getDishesByIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(dish => {
            this.dishesgetting = dish
            this.loadingDishes = false;
            Swal.fire({
              title: 'Actualizado',
              text: "El estado del plato ha sido actualizado!",
              icon: 'success',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            })
          })
        })
      } else {
        this.loadDishes();
      }
    })
  }
}
