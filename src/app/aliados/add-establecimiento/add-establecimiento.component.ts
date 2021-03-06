import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Aliado } from 'src/app/models/aliado';

@Component({
  selector: 'app-add-establecimiento',
  templateUrl: './add-establecimiento.component.html',
  styleUrls: ['./add-establecimiento.component.scss']
})
export class AddEstablecimientoComponent implements OnInit {
  color:string;

  aliado: Aliado;
  horas: String[] = [];
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

    this.horas = ["10:00 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm", "05:00 pm",
      "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm", "10:00 pm", "11:00 pm", "12:00 am"]
  }

  ngOnInit() {
  }
   
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
  putColor(termino:any){
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

  vercolor(color){
    console.log(color);
    
  }

}
