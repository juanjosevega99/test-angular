import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwallServicesService } from 'src/app/services/swall-services.service'; 
/* import swal, { SweetAlert } from "./core"; */




@Component({
  selector: 'app-create-headquarter',
  templateUrl: './create-headquarter.component.html',
  styleUrls: ['./create-headquarter.component.scss'],
  /* styles:[`
    .ng-invalid.ng-touched:not(form) :{ border: 1px solid red}

  `] */
})
export class CreateHeadquarterComponent implements OnInit {

  preHeadquarters: Object = {
    nameHq: null,
    location: null,
    address: null,
    floor: null,
    stall: null,
    general: null,
    charge: null,
    cell: null,
    tel: null,
    emailGeneral: null,
    code: null
  }

  /* preHeadquarters:Object={
    nameHq:'Galerías',
    location:'',
    address:'',
    floor:'',
    stall:'',
    general:'', o null para limpiar todo
    charge:'',
    cell:'',
    tel:'',
    emailGeneral:'',
    code:'122212-3'
  }
  [(ngModel)]="preHeadquarters.nameHq"  con[] cambiar el valor inicial de preHeadquarters por el valor que se ingrese nuevo de los inputs
  [ngModel]="preHeadquarters.nameHq" html  sin [] permanece preHeadquarters en el valor fijado inicialmente así se modifiquen los inputs */

  services: any[] = [{ name: 'Parqueadero', img: 'assets/icons/parking.png' }, { name: 'Barra de tragos', img: 'assets/icons/cocktail.png' }, { name: 'Wifi', img: 'assets/icons/wi-fi-zone.png' },
  { name: 'Mesa exterior', img: 'assets/icons/people-table.png' }, { name: 'Acceso a discapacitados', img: 'assets/icons/discapacity.png' }, { name: 'Show en vivo', img: 'assets/icons/dance.png' },
  { name: 'Zona de fumadores', img: 'assets/icons/no-smoking.png' }, { name: 'Carta braile', img: 'assets/icons/braille.png' }]

  Location: String[] = [];
  newLocation: String;

  otherLocationSelect: boolean = true
  otherLocationInput: boolean = false
  otherbuttonadd: boolean = true
  buttonadd: boolean = false


  constructor(  private swal: SwallServicesService ) {
    this.Location = ["Almeidas", "Alto Magdalena", "Bajo Magdalena", "Gualivá", "Guavio", "Magdalena Centro", "Medina", "Oriente", "Rionegro", "Sabana Centro"]
  }

  ngOnInit() {

  }

  saveHq(shape: NgForm) {
    console.log("enviando algo");
    console.log(shape);
    console.log(shape.value);
    /*  console.log(this.preHeadquarters); */
    /*    swal("Hello world!"); */
    this.swal.saveChanges()
    
  }

  handleBoxLocation(): boolean {
    if (this.otherLocationSelect) {
      return this.otherLocationSelect = false,
        this.otherbuttonadd = false,
        this.otherLocationInput = true,
        this.buttonadd = true
    } else {
      return this.otherLocationSelect = true,
        this.otherbuttonadd = true,
        this.otherLocationInput = false,
        this.buttonadd = false
    }
  }


  addLocation(termino: String) {
    this.newLocation = termino.toLowerCase();
    this.Location.push(termino.toLocaleLowerCase())
    console.log(termino);
  }

}
