import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';

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


  constructor() { 
    //inicialization of the table
    this.table = new FormGroup({
      "reference": new FormControl(),
      "nameDishesCategories": new FormControl(),
      "name": new FormControl(),
      "imageDishe": new FormControl(),
      "price": new FormControl(),
      "modificationDate": new FormControl(),
      "numberOfModifications": new FormControl(),
      "state": new FormControl(),
      "edit": new FormControl(),
    })
  }


  ngOnInit() {
  }

  //method for seaching specific values by name and code
  search(termino?: string, id?: string) {
  }

  //method for general searching 
  searchbyterm(termino: string) {}
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
