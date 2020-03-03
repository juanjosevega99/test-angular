import { Component} from '@angular/core';
import * as $ from 'jquery';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms'
import { Observable } from 'rxjs';

//Models of backend
import { Aliado } from 'src/app/models/aliado';

@Component({
  selector: 'app-create-ally',
  templateUrl: './create-ally.component.html',
  styleUrls: ['./create-ally.component.scss']
})
export class CreateAllyComponent  {
  //news params
  forma:FormGroup;

  allies:any = {
    // id: "ojsf3323",
    name: 'Kfc',
    nit: 1111,
    legalRepresentative: "MIchael",
    documentNumber:10616543,
    logo: "url of image",
    color: "#fffff",
    idTypeOfEstablishment: "ID_objCATEGORIA_DE_COMIDAS",
    NumberOfLocations:2,
    idMealsCategories: "ID_objCATEGORIA_DE_COMIDAS",
    description:"Description",
    idAttentionSchedule: [
      {
        day: "Lunes",
        from: "8:00 am",
        to: "10:00 pm"
      }
    ],// array of obj 
    imagesAllies : [],

  }
  alliesCaregories:any= {
    // id:"ID_objCATEGORIA_DE_COMIDAS",
    name:"CategoriaPrueba"
  }
  mealsCategories:any= {
    // id: "ID_objCATEGORIA_DE_COMIDAS",
    name: "cafe con pan"
  }


  days: string[]= []
  hours: String[] = [];

  // old params
  color:string;
  aliado: Aliado;
  TypeEstablishment: String[] = [];
  Categoria: String[] = [];
  photo: any;
  //variables carousel
  imagesUploaded: any = [];
  imageObject: any;
  imageSize: any
  contImage:number = 0;
  //handle button other category
  otherCatSelect: boolean = true
  otherCatInput: boolean = false
  //handle button other type Establishment
  otherEstablishmentSelect: boolean = true
  otherEstablishmentInput: boolean = false
  newEstablishment:string
  constructor() {
    this.forma = new FormGroup({
      
      'name' : new FormControl('',Validators.required),
      'nit' : new FormControl('',Validators.required),
      'legalRepresentative' : new FormControl('',Validators.required),
      'documentNumber' : new FormControl('',Validators.required),
      'logo' : new FormControl('',Validators.required),
      'color' : new FormControl('',Validators.required),
      'idTypeOfEstablishment' : new FormControl('',Validators.required),
      'NumberOfLocations' : new FormControl('',Validators.required),
      'idMealsCategories' : new FormControl('',Validators.required),
      'description' : new FormControl('',Validators.required),
    })


    this.imageSize = { width: 230, height: 120 };
    this.aliado = new Aliado();
    this.aliado.colors = ["", "", ""];
    this.aliado.days = [{}, {}, {}, {}, {}, {}, {}]
    this.aliado.images = [];
    this.Categoria = ["Alta cocina", "Comida rápida", "Comida típica", "Ensaladas y vegatariana", "Ejecutiva",
      "Comida internacional", "Heladería", "Cafetería", "Desayuno", "Hamburguesas","Pizzas","Pastas"
      ,"Perros calientes","Pollo","Árabe","Mariscos","Oriental","Italiana","Mexicana","Postres","Peruana"
      ,"Sándwich","Arepas y empanadas","Alitas","Crepes","Restaurante bar"]
    this.TypeEstablishment = ["Alta cocina", "Restaurante tradicional", "Cafetería", "Restaurante de cadena",
      "Saludable", "Heladería"]
    this.days = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado', 'Domingo']
    this.hours = ["10:00 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm", "05:00 pm",
      "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm", "10:00 pm", "11:00 pm", "12:00 am"]
  }

   //function for logo
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

  //function for carousel images

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
  // functions for adding text input and select

  handleBoxEstablishment():boolean{
    if (this.otherEstablishmentSelect) {
        return this.otherEstablishmentSelect = false,
        this.otherEstablishmentInput= true  
            
    }else{
      return this.otherEstablishmentSelect = true,
      this.otherEstablishmentInput= false       
    }
  }
  addEstablishment(termino:String){
    this.newEstablishment = termino.toLowerCase();
    this.TypeEstablishment.push(this.newEstablishment)
  }
  handleBoxCategory():boolean{
    if (this.otherCatSelect) {
        return this.otherCatSelect = false,
        this.otherCatInput= true  
            
    }else{
      return this.otherCatSelect = true,
      this.otherCatInput= false       
    }

  }
  saveChanges(){
    console.log( this.forma.value );
  }

}
