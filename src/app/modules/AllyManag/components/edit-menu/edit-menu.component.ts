import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { DishesService } from 'src/app/services/dishes.service';
import { Dishes } from 'src/app/models/Dishes';
import { DishList } from 'src/app/models/DishList';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {

  //object that saves the values of the table
  table: FormGroup;

  //variables for general search
  generalsearch: string;
  terminoaux = '';
  //variables for the state
  selectedA: [] =[]
  selectedD: []=[]

  /*  menu = [
     {
       reference: '10011235', category: 'Boxes', dishName: 'Big Box Twister', dishPhoto: '../../../../../assets/img/kfc-logo.png', price: '$19.000',
       modificationDate: '15/04/2019', modificationTime: '11:00 am', modificationNumber: '2', state: '', selected: false
     },
 
     {
       reference: '1001541', category: 'Combos', dishName: 'Combo personal', dishPhoto: '../../../../../assets/img/kfc-logo.png', price: '$15.000',
       modificationDate: '25/03/2019', modificationTime: '11:00 am', modificationNumber: '1', state: '', selected: false
     },
 
     {
       reference: '1001542', category: 'Postres', dishName: 'Fresas con crema', dishPhoto: '../../../../../assets/img/kfc-logo.png', price: '$9.000',
       modificationDate: '15/03/2019', modificationTime: '11:00 am', modificationNumber: '0', state: '', selected: false
     },
   ] */

  /*  newdateArray: {
     reference: string, category: string, dishName: string, dishPhoto: string, price: string,
     modificationDate: string, modificationTime: string, modificationNumber: string, state: string, selected: boolean
   }[] = this.menu; */

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

  /* filteredArray: {
    reference: string, category: string, dishName: string, dishPhoto: string, price: string,
    modificationDate: string, modificationTime: string, modificationNumber: string, state: string, selected: boolean
  }[] = []; */
  state: any[] = [];


  constructor(private dishesService: DishesService) {
    //inicialization of the table
    this.table = new FormGroup({
      "reference": new FormControl(),
      "name": new FormControl(),
    })

    //inicialization of dishes
    this.dishesService.getDishes().subscribe(res => {
      res.forEach((dish: Dishes) => {
        if (res.length > 0) {
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
        }
      })
    })

    this.state = [{ name: 'active', selected: false}, { name: 'inactive', selected: false}]

  }


  ngOnInit() {
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

  //method for updating the state to active
  changeStateA(idDish) {
    let newstate: object ={
      state : [{
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
    let newstate: object ={
      state : [{
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

    let count = 0;
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

    console.log("campos llenos: ", count);
  console.log('valueGenerate',this.generalsearch);
  
    if (count > 0 && count < 2 && !this.generalsearch) {

      //  un campo lleno
      this.newdateArray = this.dishesgetting.filter(function (dish: Dishes) {
        //We test each element of the object to see if one string matches the regexp.
        if (dish[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
          return dish;
        }
      });

      this.filteredArray = this.newdateArray;

    } else if (count == 2 && this.generalsearch) {

      let aux = this.newdateArray;

      this.newdateArray = aux.filter(function (dish: Dishes) {
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
        this.newdateArray = this.dishesgetting;

        if (this.generalsearch) {
          console.log("buscando general searhc");
          this.searchbyterm(this.generalsearch);

        }
      } else {

        // campos llenos
        // existe general search?

        this.newdateArray = this.filteredArray.filter(function (dish: Dishes) {
          //We test each element of the object to see if one string matches the regexp.
          if (dish[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
            return dish;
          }
        });

        if (this.generalsearch) {

          console.log("buscando general searhc");
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
    console.log("campos vacios: ", count);
    if (count > 1) {
      // campos vacios

      this.newdateArray = this.dishesgetting.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.modificationDateDay) || myRegex.test(item.modificationDateTime) ||
          myRegex.test(item.numberOfModifications.toString()))
      });
      this.filteredArray = this.newdateArray;

    } else {
      // un campo lleno

      this.newdateArray = this.filteredArray.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.modificationDateDay) || myRegex.test(item.modificationDateTime) ||
          myRegex.test(item.numberOfModifications.toString()))
      });
    }    
  }


  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }


  //method for the state
  State(value: string, event) {
    const check = event.target.checked;
    console.log(value, check);
    this.dishesService.getDishes().subscribe(res => {
      res.forEach((dish: Dishes) => {
        let state: any=[]
        state = dish.state
        console.log(state);
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
      title: 'Estás seguro?',
      text: "de que deseas actualizar el estado de este plato!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this.dishesService.putDishe(idDish,newState).subscribe(res=>{
          this.dishesService.getDishes().subscribe(dish=>{
            this.dishesgetting= dish
          })
        })
        Swal.fire(
          'Actualizado!',
          'success',
        )
      }
    })
  }
}
