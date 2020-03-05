import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.scss']
})
export class CreateDishComponent implements OnInit {

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
    stablishmentDescription: null,
    preparationTime: null
  }

  Categories: String[] = [];
  arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;

  State: boolean[] = [];

  constructor() {
    this.Categories = ["Boxes", "Combos", "Postes"]
    this.State = [true, false, false]
  }

  ngOnInit() {
  }

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

  addCategory(name: String) {
    this.newCategory = name.toLowerCase();
    this.Categories.push(name.toLocaleLowerCase())
  }

  onPhotoSelected($event) {
    let input = $event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        $('photo')
          .attr('src', e.target.result)
      };
      reader.readAsDataURL(input.files[0]);
    }

  }

}
