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
    console.log(termino,id);
    
    if (termino) {

      if (this.filteredArray.length) {

        termino = termino.toLowerCase();
        console.log(this.filteredArray);
        let aux=this.filteredArray;
        this.newdateArray = [];
        this.filteredArray = []
        aux.forEach(user => {

          user[id] = user[id].toString();

          if (user[id].toLowerCase().indexOf(termino) >= 0) {
            this.newdateArray.push(user);
            this.filteredArray.push(user)
          }

        });
      }
      else {
        console.log("no filtered array");


        this.newdateArray = [];

        this.dishesgetting.forEach(user => {

          user[id] = user[id].toString();

          if (user[id].toLowerCase().indexOf(termino) >= 0) {
            this.newdateArray.push(user);
            this.filteredArray.push(user);
          }

        });

      }


    } else {

      this.table.value[id] = null;

      let count = 0;
      for (var i in this.table.value) {
        console.log(this.table.value[i],"dentro for table");
        
        if (this.table.value[i] == null || this.table.value[i] == "") {
          count += 1;
          
        }
        console.log(count);
        
      }

      if (count > 1 && !this.generalsearch) {
        console.log(count);
        
        this.newdateArray = this.dishesgetting;
        this.filteredArray = []
        count = 0;

      } else {
        console.log(count);
        for (var i in this.table.value) {
          this.filteredArray = []
          count = 0;
          if (this.table.value[i] == null && this.table.value[i] == "") {
            this.search(this.table.value[i],this.table[i])
            console.log(this.table.value[i],this.table[i]);
             
          }

        }
        /* this.newdateArray = this.filteredArray; */
      
        
      }
    }
      
    /* 
    
     } else {

      if (termino) {

        if (this.filteredArray.length) {

          termino = termino.toLowerCase();

          this.newdateArray = [];

          this.filteredArray.forEach(user => {

            user[id] = user[id].toString();

            if (user[id].toLowerCase().indexOf(termino) >= 0) {
              this.newdateArray.push(user);

            }

          });
        }
        else {
          console.log("no filtered array");


          this.newdateArray = [];

          this.usergetting.forEach(user => {

            user[id] = user[id].toString();

            if (user[id].toLowerCase().indexOf(termino) >= 0) {
              this.newdateArray.push(user);
              this.filteredArray.push(user);

            }

          });

        }


      } else {

        this.table.value[id] = null;

        let count = 0;
        for (var i in this.table.value) {

          if (this.table.value[i] == null || this.table.value[i] == "") {
            count += 1;
          }
        }

        if (count > 9 && !this.generalsearch) {

          this.newdateArray = this.usergetting;
          this.filteredArray = []
          count = 0;

        } else {

          this.newdateArray = this.filteredArray;
          count = 0;
        }
      }*/
  }
  /* if (termino) {
    if (this.filteredArray.length) {
      termino = termino.toLowerCase();
      this.newdateArray = [];
      this.filteredArray.forEach(menu => {
        menu[id] = menu[id].toString();
        if (menu[id].toLowerCase().indexOf(termino) >= 0) {
          this.newdateArray.push(menu);
        }
      });
    } else {
      console.log("no results");

      this.newdateArray = [];
      this.dishesgetting.forEach(dish => {
        dish[id] = dish[id].toString();
        if (dish[id].toLowerCase().indexOf(termino) >= 0) {
          this.newdateArray.push(dish);
          this.filteredArray.push(dish);
        }
      });
    } */

  /* this.newdateArray = this.dishesgetting;
  this.filteredArray = []; */


  //method for general searching 
  searchbyterm(termino: string) {
    if (termino) {
      termino = termino.toLowerCase();
      var myRegex = new RegExp('.*' + termino + '.*', 'gi');

      if (this.filteredArray.length) {
        this.newdateArray = this.filteredArray.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.modificationDateDay) || myRegex.test(item.modificationDateTime) ||
            myRegex.test(item.numberOfModifications.toString()))
        });
      } else {
        this.newdateArray = this.dishesgetting.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.modificationDateDay) || myRegex.test(item.modificationDateTime) ||
            myRegex.test(item.numberOfModifications.toString()))
        });
        this.filteredArray = this.dishesgetting.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.reference) || myRegex.test(item.nameDishesCategories) || myRegex.test(item.name) || myRegex.test(item.price.toString()) || myRegex.test(item.modificationDateDay) || myRegex.test(item.modificationDateTime) ||
            myRegex.test(item.numberOfModifications.toString()))
        });
      }
    } else {

      let count = 0;
      for (var i in this.table.value) {
        if (this.table.value[i] == null || this.table.value[i] == "") {
          count += 1;
        }
      }

      if (count > 1 && !this.generalsearch) {

        this.newdateArray = this.dishesgetting;
        this.filteredArray = []
        count = 0;

      } else {

        this.newdateArray = this.filteredArray;
        count = 0;
      }
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

/*   seeState(value:string){
    this.dishesService.getDishes().subscribe(res => {
      res.forEach((dish: Dishes) => {
        let state: any=[]
        state = dish.state
        if(value ==state.value){
          let check: boolean = false
          check = state.check
        }
      })
    
    
    })
 
  } */

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
      text: "de que deseas actualizar el estado de este perfil!",
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










/* import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {

  selectedA : boolean = false;
  selectedD : boolean = false;

  menu = [
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
  ]

  newdateArray: {
    reference: string, category: string, dishName: string, dishPhoto: string, price: string,
    modificationDate: string, modificationTime: string, modificationNumber:string, state:string, selected: boolean
  }[] = this.menu;

  filteredArray: {
    reference: string, category: string, dishName: string, dishPhoto: string, price: string,
    modificationDate: string, modificationTime: string, modificationNumber:string, state:string, selected: boolean
  }[] = [];

  constructor() { }


  ngOnInit() {
  }

  searchbyterm(termino: string) {

    termino = termino.toLowerCase();

    const aux = this.newdateArray

    var myRegex = new RegExp('.*' + termino + '.*', 'gi');

    this.newdateArray = aux.filter(function (item) { */
      //We test each element of the object to see if one string matches the regexp.
/*       return (myRegex.test(item.reference) || myRegex.test(item.category) || myRegex.test(item.dishName) || myRegex.test(item.price) || myRegex.test(item.modificationDate) || myRegex.test(item.modificationTime) ||
        myRegex.test(item.modificationNumber))

    });
  }


  search(termino?: string, id?: string) {

    if (termino) {
      termino = termino.toLowerCase();

      this.newdateArray = [];
      this.filteredArray = [];

      this.menu.forEach(menus => {

        if (menus[id].toLowerCase().indexOf(termino) >= 0) {
          this.newdateArray.push(menus);
          this.filteredArray.push(menus);
        }

      });

    } else {
      this.newdateArray = this.menu;
      this.filteredArray = [];
    }
}

State(  value:string,id:string){ */
/*  if (id == 'active') {
   this.menu
   this.menu['{state}'].push('Activo')
 } else if (id == 'inactive'){
   this.menu['{state}'].push('Inactivo')
}
*/
/* if(value=='option1'){
  this.menu.forEach(menus => {
  menus[id].push('activo')});
}
else if (value=='option2'){
  this.menu[id].push('activo')
}
 */
/* console.log(value);

}
} */
