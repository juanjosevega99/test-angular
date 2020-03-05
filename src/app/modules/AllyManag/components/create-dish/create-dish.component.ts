import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.scss']
})
export class CreateDishComponent implements OnInit {

  //Object to save the dates of the form
  preDish: Object = {
    state: [],
    admissionDate: null,
    modificationDate: null,
    modificationsNumber: null,
    categories: null,
    reference: null,
    dishName: null,
    price: null,
    dishPhoto: null,
    dishDescription: null,
    preparationTime: null
  }

  //variables for categories
  Categories: String[] = [];
  arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;

  State: boolean[] = [];

  time: string[] = [];

  constructor() {
    this.Categories = ["Boxes", "Combos", "Postes"]
    this.State = [true, false, false]
    this.time = ['minutos','horas','días']
  }

  ngOnInit() {
  }

  //Method for showing new view in the categories field
  handleBoxCategories(): boolean {
    if (this.addcategoryButton) {
      return this.addcategoryButton = false,
        this.otherCategoryInput = true,
        this.selectAgainarray = true,
        this.arrayCategorySelect = false
    } else {
      return this.addcategoryButton = true,
        this.otherCategoryInput = false,
        this.selectAgainarray = false,
        this.arrayCategorySelect = true
    }
  }

  //Method for add new category
  addCategory(name: String) {
    this.newCategory = name.toLowerCase();
    this.Categories.push(name.toLocaleLowerCase())
  }

 //Method for photo of the dish
 onPhotoSelected($event) {
  let input = $event.target;
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e: any) {
      $('#photo')
        .attr('src', e.target.result)
    };

    reader.readAsDataURL(input.files[0]);
  }
}

  }


