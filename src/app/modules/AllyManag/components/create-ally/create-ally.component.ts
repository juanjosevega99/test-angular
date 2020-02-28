import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Aliado } from 'src/app/models/aliado';

@Component({
  selector: 'app-create-ally',
  templateUrl: './create-ally.component.html',
  styleUrls: ['./create-ally.component.scss']
})
export class CreateAllyComponent implements OnInit {

  aliado: Aliado;
  horas: String[] = [];
  TypeEstablishment: String[] = [];
  Categoria: String[] = [];
  photo: any;
  imagesUploaded: any = [];
  imageObject: any;
  imageSize: any
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
    }

  }
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
    console.log(termino)
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

}
