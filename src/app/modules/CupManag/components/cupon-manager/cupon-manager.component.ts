import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cupon-manager',
  templateUrl: './cupon-manager.component.html',
  styleUrls: ['./cupon-manager.component.scss']
})
export class CuponManagerComponent implements OnInit {
 
 //object that saves the values of the table
 table: FormGroup;
 
  //variables for general search
 generalsearch: string = "";

  constructor() {
    this.table = new FormGroup({
      "code": new FormControl(),
      "nameEstablishment": new FormControl(),
      "cupon": new FormControl()
    })
   }

  ngOnInit() {
  }

   //method for a specific search
   search(termino?: string, id?: string) {

    // let objsearch = {
    //   identification: "",
    //   name: ""
    // };


    // for (var i in this.table.value) {
    //   // search full fields
    //   if (this.table.value[i] !== null && this.table.value[i] !== "") {
    //     objsearch[i] = this.table.value[i];
    //   }
    // }

    // // let for general searhch
    // var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    // this.newArray = this.profilesgetting.
    //   filter(function (dish) {
    //     if (dish["name"].toLowerCase().indexOf(this.name) >= 0) {
    //       return dish;
    //     }
    //   }, objsearch).
    //   filter(function (dish) {
    //     if (dish["identification"].toLowerCase().indexOf(this.identification) >= 0) {
    //       return dish;
    //     }
    //   }, objsearch).
    //   filter(function (item) {
    //     //We test each element of the object to see if one string matches the regexp.
    //     return (myRegex.test(item.nameCharge) || myRegex.test(item.identification) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.entryDate) || myRegex.test(item.modificationDate) ||
    //       myRegex.test(item.numberOfModifications.toString()))
    //   })

  }
  

}
