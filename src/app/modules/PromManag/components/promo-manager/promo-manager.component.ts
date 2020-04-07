import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';

@Component({
  selector: 'app-promo-manager',
  templateUrl: './promo-manager.component.html',
  styleUrls: ['./promo-manager.component.scss']
})
export class PromoManagerComponent implements OnInit {

  //object that saves the values of the table
  table: FormGroup;

  //variables for general search
  generalsearch: string;
  terminoaux = '';

  //variables for the state
  selectedA: [] = []
  selectedD: [] = []
  constructor() { 

     //inicialization of the table
     this.table = new FormGroup({
      "reference": new FormControl(),
      "name": new FormControl(),
    })

  }

  ngOnInit() {
  }
  //method for seaching specific values by name and code
  search(termino?: string, id?: string) {

  }

  //method for general searching 
  searchbyterm(termino: string) {
    
  }
}
