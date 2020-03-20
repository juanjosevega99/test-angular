import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlliesService } from 'src/app/services/allies.service';
import { AdditionalServicesService } from 'src/app/services/additional-services.service'
import { LocationServiceService } from 'src/app/services/location-service.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-headquarter',
  templateUrl: './create-headquarter.component.html',
  styleUrls: ['./create-headquarter.component.scss'],
})

export class CreateHeadquarterComponent implements OnInit {

  //variables for new images in the additional services
  other: String;
  otherImg: String;
  readerImg = new FileReader();

  //Object that saves all data of the form
  preHeadquarters: Object = {
    idAllies: null,
    nameAllies: null,
    name: null,
    ubication: null,
    address: null,
    numberFloor: null,
    local: null,
    generalContact: null,
    chargeGC: null,
    mobileGC: null,
    telephoneGC: null,
    emailGeneral: null,
    code: null,
    principarlServices: [],
    costPerService: [],
    aditionalServices: [],
    averageDeliveryTime: null,
    headquartersContact: null,
    chargeHC: null,
    mobileHC: null,
    telephoneHC: null,
    emailHC: null,
  }

  //other variables
  Location: String[] = [];
  newLocation: String;
  otherLocationSelect: boolean = true;
  otherLocationInput: boolean = false;
  otherbuttonadd: boolean = true;
  buttonadd: boolean = false;
  services: any[] = [];
  cost: any[] = [];
  aditionalServices: any[] = [];
  checkboxOther: boolean = true;
  othersServiceInput: boolean = false;

  ArrayseviceChecked: any[] = [];
  collectionAddService: any[] = [];

  nameAlli: any[] = [];

  constructor(
    private allies: AlliesService,
    private _router: Router,
    private headquarters: HeadquartersService,
    private additionalServices: AdditionalServicesService,
    private locationService: LocationServiceService) {
    this.locationService.getLocations()
      .subscribe((data: any) => {
        this.Location = data.facet_groups[0].facets
        data.records.forEach((element: any) => {
          let loc: any = {
            name: element.fields.empty1
          }
          this.Location.push(loc)
        });
      })

    this.services = [{ name: 'Pídelo', img: 'assets/icons/shop.png', select: false }, { name: 'Resérvalo', img: 'assets/icons/calendar.png', select: false }, { name: 'Llévalo', img: 'assets/icons/delivery-bike.png', select: false }]

    this.aditionalServices = [{ name: 'Parqueadero', img: 'assets/icons/parking.png', select: false }, { name: 'Barra de tragos', img: 'assets/icons/cocktail.png', select: false }, { name: 'Wifi', img: 'assets/icons/wi-fi-zone.png', select: false },
    { name: 'Mesa exterior', img: 'assets/icons/people-table.png', select: false }, { name: 'Acceso a discapacitados', img: 'assets/icons/discapacity.png', select: false }, { name: 'Show en vivo', img: 'assets/icons/dance.png', select: false },
    { name: 'Zona de fumadores', img: 'assets/icons/no-smoking.png', select: false }, { name: 'Carta braile', img: 'assets/icons/braille.png', select: false }]

    this.cost = [{ name: 'Pídelo', img: 'assets/icons/shop.png' }, { name: 'Resérvalo', img: 'assets/icons/calendar.png' }, { name: 'Llévalo', img: 'assets/icons/delivery-bike.png' }]
  }

  ngOnInit() {
    
  }

  getNameAlly(){
    this.allies.getAllies().subscribe( ally =>{
      this.nameAlli = ally
      console.log("imprimiendo aliados",this.nameAlli); 
    })
  }

  //method for adding selected additional services in a new array
  getAdditionalService(nameService: String, imageService: String, position: number, event) {
    let seviceChecked: Object = {
      name: nameService,
      image: imageService
    }
    const checked = event.target.checked;

    if (checked === true) {
      if (this.ArrayseviceChecked[position]) {
        this.ArrayseviceChecked[position] = seviceChecked;
      } else {
        this.ArrayseviceChecked.push(seviceChecked)
      }
    } else if (checked === false) {
      this.ArrayseviceChecked.splice(position, 1)
    }
  }

  //method for see the selected service
  selectedService(event, pos: number) {
    const checked = event.target.checked;
    const value = event.target.value;
    event.target.value = value;
    this.preHeadquarters['principarlServices'][pos] = { value, checked }
  }

  //method for seeing the service and the cost
  writeCost(event, i: number) {
    const id = event.target.id;
    event.target.id = id;
    const value = event.target.value;
    event.target.value = value;
    this.preHeadquarters['costPerService'][i] = { id, value }
  }

  //method for seeing the additional service selected
  selectedAditionalService(event, pos: number) {
    const checked = event.target.checked;
    event.target.checked = checked;
    const value = event.target.value;
    event.target.value = value;
    this.preHeadquarters['aditionalServices'][pos] = { value, checked }
  }

  //method for saving the new headquarter
  saveHq(shape: NgForm) {
    let agregateAdditionalServices: object = {
      additionalServices: this.ArrayseviceChecked
    }
    this.additionalServices.postAdditionalService(agregateAdditionalServices).subscribe(message => {
      this.additionalServices.getAdditionalServices().subscribe(service => {
        this.collectionAddService = service;
        console.log(this.collectionAddService);
      })
    })
    this.swallSaveHeadquarter(this.preHeadquarters)
  }

  //method for showing the sweet alert
  swallSaveHeadquarter(newHeadquarter: any) {
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
        console.log("Array FINAL: ", this.preHeadquarters);
        this.headquarters.postHeadquarter(this.preHeadquarters).subscribe(message => {
        })
        Swal.fire({
          title: 'Guardado',
          text: "Tu nueva sede ha sido creada!",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/headquarts']);
          }
        })
      }
    })
  }

  //method for canceling the creation of a headquarter
  cancel() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas cancelar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
      if (result.value) {
        this._router.navigate(['/headquarts']);
      }
    })
  }

  //method for showing and hiding the input of a new additional service
  handleBoxOtherservice() {
    this.othersServiceInput = !this.othersServiceInput;
  }

  //method to select an icon for a new additional service
  selectImg(event: any) {
    const file = event.target.files[0];
    this.readerImg.readAsDataURL(file);
    this.readerImg.onload = (e: any) => {
      this.otherImg = e.target.result;
    };
  }

  //method for add to the view the new additional service
  addNewServiceadd(other: String) {
    const otherService = {
      name: other,
      img: this.otherImg ? this.otherImg : 'assets/icons/plus.png',
      select: false
    }
    this.aditionalServices.push(otherService);
  }
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
