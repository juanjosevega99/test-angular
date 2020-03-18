import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DishesService } from 'src/app/services/dishes.service';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.scss']
})
export class CreateDishComponent implements OnInit {

  //Object to save the dates of the form
  preDish: Object = {
    idMealsCategories:null,
    state: null,
    creationDate: null,
    modificationDate: null,
    numberOfModifications: 0,
    nameMealsCategories: null,
    reference: null,
    name: null,
    price: null,
    imageDishe: null,
    description: null,
    preparationTime: [],
    idAccompaniments: [],
    idPromotion:null
  }

  //variables for tick
  date:string;
  times:string;
  today:Date;

  //variables for categories
  Categories: String[] = [];
  arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;

  State: any[] = [];

  time: String[] = [];

  constructor(private _router: Router, private dishes: DishesService) {
    this.Categories = ["Boxes", "Combos", "Postes"]
    this.State = [{name:'Activo',selected: true}, {name:'Inactivo',selected:false}, {name:'Eliminar',selected:false}]
    this.time = ['segundos','minutos','horas']
  }

  ngOnInit() {
    setInterval( ()=>this.tick(), 1000 );
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
/*    this.preDish['imageDishe'] */
  this.preDish['imageDishe'] = input.files[0].name
    
  }
}

//Methos for preparation time
inputTime(event1){
  /* const valueInput = event1.target.value */
  
  console.log(event1);
  
}

//Method for selecting the state
selectedState(event){
  const value = event.target.value;
  event.target.value = value;
  this.preDish['state'] = value
}

//Method for the admission date
tick(): void{
  this.today = new Date();
  this.times = this.today.toLocaleString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
  this.date = this.today.toLocaleString('es-ES',{weekday:'long',day:'2-digit',month:'numeric',year:'numeric'});
  /* this.preDish['creationDate'] = this.date.concat("-",this.times) */ 
}

//Method for the modifications number
modificationsNumber(): void{
  /* this.preDish['numberOfModifications'].push(0)
  console.log(this.preDish['numberOfModifications'].push(0)); */ 
}

//save new dish
saveDish(shape: NgForm) {
   this.swallSaveDish(this.preDish)
}

swallSaveDish(newHeadquarter: any){

  Swal.fire({
    title: 'Estás seguro?',
    text: "de que deseas guardar los cambios!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, guardar!'
  }).then((result) => {
    if (result.value) {
      console.log("Array FINAL: ", this.preDish);
      this.dishes.postDishe(this.preDish).subscribe()
      Swal.fire({
        title: 'Guardado',
        text: "Tu nuevo plato ha sido creado!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok!'
      }).then((result) => {
        if (result.value) {
          this._router.navigate(['/main','editmenu']);
        }
      })
    }
  })

}

  }


