import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import Swal from 'sweetalert2';
//Models of backend
import { Aliado } from 'src/app/models/aliado';
//services
import { AlliesCategoriesService } from '../../../../services/allies-categories.service';
import { MealsCategoriesService } from "../../../../services/meals-categories.service";
import { SwallServicesService } from "../../../../services/swall-services.service";
import { element } from 'protractor';

@Component({
  selector: 'app-create-ally',
  templateUrl: './create-ally.component.html',
  styleUrls: ['./create-ally.component.scss']
})
export class CreateAllyComponent implements OnInit {
  //news params
  forma: FormGroup;
  schedules: FormGroup;

  allies: object = {
    name: null,
    nit: null,
    legalRepresentative: null,
    documentNumber: null,
    logo: null,
    colour: null,
    idTypeOfEstablishment: null,
    NumberOfLocations: null,
    idMealsCategories: null,
    description: null,
    idAttentionSchedule: [
      {
        day: null,
        from: null,
        to: null
      }
    ],// array of obj 
    imagesAllies: [],

  }

  alliesCategories: any[] = [];
  mealsCategories: any[] = [];

  days: string[] = []
  hours: String[] = [];
  color: String = "#000000";
  attentionSchedule:any []= [];


  // old params
  aliado: Aliado; // instance necesary to working method onImagesSelected
  TypeEstablishment: String[] = [];
  Categoria: String[] = [];
  photo: any;
  //variables carousel
  imagesUploaded: any = [];
  imageObject: any;
  imageSize: any
  contImage: number = 0;
  //handle button other category
  otherMealSelect: boolean = true
  otherMealInput: boolean = false
  //handle button other type Establishment
  otherEstablishmentSelect: boolean = true
  otherEstablishmentInput: boolean = false
  newEstablishment: string
  constructor(private alliesCatServices: AlliesCategoriesService,
              private swalService: SwallServicesService,
              private mealsCatServices: MealsCategoriesService) {
    this.forma = new FormGroup({

      'name': new FormControl('', Validators.required),
      'nit': new FormControl('', Validators.required),
      'legalRepresentative': new FormControl('', Validators.required),
      'documentNumber': new FormControl('', Validators.required),
      'logo': new FormControl('', Validators.required),
      'color': new FormControl('', Validators.required),
      'idTypeOfEstablishment': new FormControl('', Validators.required),
      'nameTypeOfEstablishment': new FormControl('', ),
      'NumberOfLocations': new FormControl('', Validators.required),
      'idMealsCategories': new FormControl('', Validators.required),
      'nameMealsCategories': new FormControl('', ),
      'description': new FormControl('', [Validators.required, Validators.maxLength(15)], ),
      'idAttentionSchedule': new FormArray([
              new FormControl('',)
              
      ]),
    
    })

    this.schedules = new FormGroup({
      "day": new FormControl('',),
      "from": new FormControl('',),
      "to": new FormControl('',)
    })

    //this is observator for the colorPicker optional 
    this.forma.controls['color'].valueChanges
      .subscribe(data => {
        console.log(data);
      })

    this.imageSize = { width: 230, height: 120 };
    this.aliado = new Aliado();
    //this.aliado.colors = ["", "", ""];
    //this.aliado.days = [{}, {}, {}, {}, {}, {}, {}]
    this.aliado.images = [];
    // this.Categoria = ["Alta cocina", "Comida rápida", "Comida típica", "Ensaladas y vegatariana", "Ejecutiva",
    //   "Comida internacional", "Heladería", "Cafetería", "Desayuno", "Hamburguesas", "Pizzas", "Pastas"
    //   , "Perros calientes", "Pollo", "Árabe", "Mariscos", "Oriental", "Italiana", "Mexicana", "Postres", "Peruana"
    //   , "Sándwich", "Arepas y empanadas", "Alitas", "Crepes", "Restaurante bar"]
    // // this.TypeEstablishment = ["Alta cocina", "Restaurante tradicional", "Cafetería", "Restaurante de cadena",
    //   "Saludable", "Heladería"]
    this.days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    this.hours = ["10:00 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm", "05:00 pm",
      "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm", "10:00 pm", "11:00 pm", "12:00 am"]
    
    //inicialization service with collections allies-categories
    this.alliesCatServices.getAlliesCategories().subscribe(alliesCat => {
      this.alliesCategories = alliesCat;
      console.log(this.alliesCategories) //delete console log
    })
    //inicialization service with collections meals-categorie
    this.mealsCatServices.getMealsCategories().subscribe(mealCat => {
      this.mealsCategories = mealCat;
      console.log(this.mealsCategories);      
    })

  }

  ngOnInit() {

  }
  getColour(event) {
    this.color = event.target.value
    console.log(this.color) // delete console log
  }
  //CRD -- METHODS OF TypeEstablishment: CREATE ,READ AND DELETE 
  addEstablishment() {
    let newitem = this.forma.controls['nameTypeOfEstablishment'].value;
    let newEstablishment: object = {
      name: newitem
    }
    this.swallSaveOtherEstablishment(newEstablishment)
    console.log(this.alliesCategories) // delete console log
    this.forma.controls['nameTypeOfEstablishment'].reset() // reset input add new category establishment
    this.changeStateToSelect();
  }
  //method delete Type Establishment
  deleteCategory() {
    let idCategory: any = this.forma.controls['idTypeOfEstablishment'].value
    console.log(idCategory) // delete console log
    this.swallDeleteCatEstablishment(idCategory)
  }
  //Method for chang of oring buttons
  changeStateToSelect() {
    this.otherEstablishmentSelect = true;
    this.otherEstablishmentInput = false;
  }
   //CRD -- METHODS OF MealCategory: CREATE ,READ AND DELETE 
   addMeal(){
    let newitem = this.forma.controls['nameMealsCategories'].value;
    let newMeal: object = {
      name: newitem
    }
    this.swallSaveMealCategory(newMeal)
    this.forma.controls['nameMealsCategories'].reset();
    this.changeStateToSelectMeal();

   }
   deleteMealCategory(){
    let idMealCat: any = this.forma.controls['idMealsCategories'].value
    console.log(idMealCat) // delete console log
    this.swallDeleteMealCategory(idMealCat)
   }
   changeStateToSelectMeal() {
    this.otherMealSelect = true;
    this.otherMealInput = false;
  }
  //Method for logo
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
  //Method for carousel images
  onImagesSelected($event) {
    let input = $event.target;
    console.log($event)
    let image = "";
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = (e: any) => {
        image = e.target.result;
        this.imagesUploaded.push({ image: image, thumbImage: image })
      }

      this.aliado.images.push(input.files[0])
      reader.readAsDataURL(input.files[0]);
      this.contImage = this.aliado.images.length;
    }

  }
  // Method for adding text input and select
  handleBoxEstablishment(): boolean {
    if (this.otherEstablishmentSelect) {
      return this.otherEstablishmentSelect = false,
        this.otherEstablishmentInput = true

    } else {
      return this.otherEstablishmentSelect = true,
        this.otherEstablishmentInput = false
    }
  }
  handleBoxMeal(): boolean {
    if (this.otherMealSelect) {
      return this.otherMealSelect = false,
        this.otherMealInput = true

    } else {
      return this.otherMealSelect = true,
        this.otherMealInput = false
    }
  }
  // method save  and cancel all collection allies
  saveChanges() {
    console.log(this.forma.value);
    this.swalService.saveChanges()
  }
  cancelChanges() {
    this.swalService.cancel();
  }
  getAttentionScheduleLunes(day:String, fromLunes: String,toLunes:String){
   // console.log(dayLunes);
    console.log(fromLunes);
    console.log(toLunes);
    let schedule:object = {
      day: day,
      from: fromLunes,
      to : toLunes
    }
    // To do one function for tracking array with filter and look what is the same and renplace-- 
    this.attentionSchedule.push(schedule)
    let sinRepetidos = this.attentionSchedule.filter((valorActual, indiceActual, arreglo) => {
      // maybe working with lastIndexOf
      return arreglo.findIndex(
        valorDelArreglo =>valorDelArreglo.day === valorActual.day
        ) === indiceActual
    });

    console.log("Con repetidos",this.attentionSchedule);
    console.log("SIN repetidos",sinRepetidos);
  }

  // method by sweetalert2 
  //saveTypeEstablishment 
  swallSaveOtherEstablishment(newEstablishment: any) {
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
        this.alliesCatServices.postAllieCategorie(newEstablishment).subscribe(() => {
          this.alliesCatServices.getAlliesCategories().subscribe(alliesCat => {
            this.alliesCategories = alliesCat;
            console.log(this.alliesCategories)
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nuevo tipo de establecimiento ha sido creado',
          'success',
        )
      }
    })
  }
  swallDeleteCatEstablishment(id: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.alliesCatServices.deleteAllieCategorie(id).subscribe(() => {
          this.alliesCatServices.getAlliesCategories().subscribe(alliesCat => {
            this.alliesCategories = alliesCat;
            console.log(this.alliesCategories)
          })
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }
  //save and Delete Meals categories 
  swallSaveMealCategory(newMeal: any) {
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
        this.mealsCatServices.postMealCategorie(newMeal).subscribe(() => {
          this.mealsCatServices.getMealsCategories().subscribe(mealCat => {
            this.mealsCategories = mealCat;
            console.log(this.mealsCategories)
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nueva categoría de comida ha sido creado',
          'success',
        )
      }
    })
  }
  swallDeleteMealCategory(id: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.mealsCatServices.deleteMealCategorie(id).subscribe(() => {
          this.mealsCatServices.getMealsCategories().subscribe(mealCat => {
            this.mealsCategories = mealCat;
            console.log(this.mealsCategories)
          })
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }


}
