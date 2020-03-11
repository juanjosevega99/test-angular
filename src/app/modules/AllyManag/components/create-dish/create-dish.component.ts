import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwallServicesService } from 'src/app/services/swall-services.service';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.scss']
})
export class CreateDishComponent implements OnInit {

  //Object to save the dates of the form
  preDish: Object = {
    state: [],
   /*  creationDate: null, */
   /*  modificationDate: null, */
    numberOfModifications: null,
    nameMealsCategories: null,
    reference: null,
    name: null,
    price: null,
    imageDishe: null,
    description: null,
    preparationTime: null
  }

  //variables for tick
  date:String;
  times:String;
  today:Date;

  //variables for categories
  Categories: String[] = [];
  arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;

  State: any[] = [];

  time: string[] = [];

  constructor(private swal: SwallServicesService) {
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
/*    this.preDish['imageDishe'] 
    console.log(input.files[0].name); */
    
  }
}

//Metod for selecting the state
selectedState(event){
  const checked = event.target.checked;
  const value = event.target.value;

  event.target.value = value;
  this.preDish['state'] = { value, checked }
}

//Metod for the admission date
tick(): void{
  this.today = new Date();
  this.times = this.today.toLocaleString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
  this.date = this.today.toLocaleString('es-ES',{weekday:'long',day:'2-digit',month:'numeric',year:'numeric'});
  /* this.preDish['creationDate'] = this.today */
}

//save new dish
saveDish(shape: NgForm) {
  console.log("enviando algo");
  console.log(shape);
  console.log(shape.value);
  /*  console.log(this.preHeadquarters); */
  /*    swal("Hello world!"); */
  this.swal.saveChanges()
  
}

  }


