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

  other:String;
  otherImg :String;

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
    code: null,
    services:[],
    cost:[],
    aditionalServices:[],
    otherServiceadd : [],
    deliveryTime: null,
    headquarterContact: null,
    chargeHq: null,
    cellHq: null,
    telHq: null,
    emailHq: null,
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

  
  
  

  
  Location: String[] = [];
  newLocation: String;
  otherLocationSelect: boolean = true;
  otherLocationInput: boolean = false;
  otherbuttonadd: boolean = true;
  buttonadd: boolean = false;
  services: any[] =[];
 /*  boxcheck : boolean = true;
  inputcost : boolean = false; */
  cost: any[] = [];
  aditionalServices: any[] = [];
  checkboxOther : boolean = true;
  othersServiceInput:boolean = false;


  constructor( private swal: SwallServicesService ) {
    this.Location = ["Almeidas", "Alto Magdalena", "Bajo Magdalena", "Gualivá", "Guavio", "Magdalena Centro", "Medina", "Oriente", "Rionegro", "Sabana Centro"],

    this.services = [{name: 'Pídelo', img: 'assets/icons/shop.png', select:false},{name : 'Resérvalo', img:'assets/icons/calendar.png',select:false},{name:'Llévalo',img:'assets/icons/delivery-bike.png', select:false}]
   
    this.aditionalServices = [{ name: 'Parqueadero', img: 'assets/icons/parking.png',select:false }, { name: 'Barra de tragos', img: 'assets/icons/cocktail.png',select:false }, { name: 'Wifi', img: 'assets/icons/wi-fi-zone.png',select:false },
    { name: 'Mesa exterior', img: 'assets/icons/people-table.png',select:false }, { name: 'Acceso a discapacitados', img: 'assets/icons/discapacity.png',select:false }, { name: 'Show en vivo', img: 'assets/icons/dance.png',select:false },
    { name: 'Zona de fumadores', img: 'assets/icons/no-smoking.png',select:false }, { name: 'Carta braile', img: 'assets/icons/braille.png',select:false }]

    

    this.cost = [{name: 'Pídelo',img:'assets/icons/shop.png',cost:null},{name : 'Resérvalo',img:'assets/icons/calendar.png',cost:null},{name:'Llévalo',img:'assets/icons/delivery-bike.png',cost:null}]
  }

  ngOnInit() {

  }


  selectedService(event, pos: number){
    console.log(event);
    const checked = event.target.checked;
    event.target.checked = checked;
    const value = event.target.value;
    event.target.value = value;
    this.preHeadquarters['services'][pos]={value, checked}
  }


  /* handleBoxService(): boolean {
    if (this.services['select']) {
      return this.inputcost = true;
    } else {
      return this.inputcost = false;
    }
  } */

  writeCost(event, i:number ){
    const id = event.target.id;
    event.target.id = id;
    const value = event.target.value;
    event.target.value = value;
    this.preHeadquarters['cost'][i]={id, value}
  }

  selectedAditionalService(event, pos: number){
    /* console.log(event); */
    const checked = event.target.checked;
    event.target.checked = checked;
    const value = event.target.value;
    event.target.value = value;
    this.preHeadquarters['aditionalServices'][pos]={value, checked}
  }

  saveHq(shape: NgForm) {
    console.log("enviando algo");
    console.log(shape);
    console.log(shape.value);
    /*  console.log(this.preHeadquarters); */
    /*    swal("Hello world!"); */
    this.swal.saveChanges()
    }

  cancel(){
    this.swal.cancel()
  }

  handleBoxOtherservice() {
   this.othersServiceInput = !this.othersServiceInput;
  }

  selectImg(event){
   /*  let input = event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        $('#photo')
          .attr('src', e.target.result)
      };

      reader.readAsDataURL(input.files[0]);

    } */

    console.log(event);
    this.otherImg = event;
  }

  addNewServiceadd(other:String){
    const otherService = {
      name : other,
      /*  this.otherImg ? this.otherImg : */
      img : 'assets/icons/plus.png',
      select : true
    }
    this.aditionalServices.push(otherService);
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
