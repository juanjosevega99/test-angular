import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwallServicesService } from 'src/app/services/swall-services.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  preProfile: Object = {
    state:[],
    entryDate:null,
    modificationDate:null,
    numberOfModifications:0,
    nameAllie:null,
    nameHeadquarter:null,
    nameCharge:null,
    userCode:null,
    permis:null,
    identification:null,
    name:null,
    email:null,
    photo:null
  }

  //variables for categories
  arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;
  Categories: String[] = [];

  //variable for the state
  State: any[] = [];

  //variables for tick
  date:String;
  times:String;
  today:Date;


  constructor(private swal: SwallServicesService) { 
    this.Categories=["cajero","","","",""]
    this.State = [{name:'Activo',selected: true}, {name:'Inactivo',selected:false}, {name:'Eliminar',selected:false}]
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

  //Metod for selecting the state
selectedState(event){
  const checked = event.target.checked;
  const value = event.target.value;

  event.target.value = value;
  this.preProfile['state'] = { value, checked }
}

  //Method for add new profile
  addCategory(name: String) {
    this.newCategory = name.toLowerCase();
    this.Categories.push(name.toLocaleLowerCase())
  }


//Metod for the admission date
tick(): void{
  this.today = new Date();
  this.times = this.today.toLocaleString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
  this.date = this.today.toLocaleString('es-ES',{weekday:'long',day:'2-digit',month:'numeric',year:'numeric'});
  /* this.preDish['creationDate'] = this.today */
}

//save new profile
saveProfile(shape: NgForm) {
  console.log("enviando algo");
  console.log(shape);
  console.log(shape.value);
  /*  console.log(this.preHeadquarters); */
  /*    swal("Hello world!"); */
  this.swal.saveChanges()
  
}


}
