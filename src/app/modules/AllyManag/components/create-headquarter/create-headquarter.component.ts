import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlliesService } from 'src/app/services/allies.service';
import { AdditionalServicesService } from 'src/app/services/additional-services.service'
import { LocationServiceService } from 'src/app/services/location-service.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import Swal from 'sweetalert2';
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from 'rxjs/internal/Observable';
import { NgxSpinnerService } from 'ngx-spinner';
//services
import { SaveLocalStorageService } from "../../../../services/save-local-storage.service";
import { UploadImagesService } from "src/app/services/providers/uploadImages.service";
import { Marker } from '../../../../../classes/marker.class';


@Component({
  selector: 'app-create-headquarter',
  templateUrl: './create-headquarter.component.html',
  styleUrls: ['./create-headquarter.component.scss'],
})

export class CreateHeadquarterComponent implements OnInit {

  //variables for new images in the additional services
  other: String;
  /*  otherImg: String; */
  readerImg = new FileReader();

  //variable for upload images
  otherImg: any;
  urlHq: Observable<string>;

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
    costPerService: [{ id: "Pídelo", value: "" }, { id: "Resérvalo", value: "" }, { id: "Llévalo", value: "" }],
    aditionalServices: [],
    averageDeliveryTime: null,
    headquartersContact: null,
    chargeHC: null,
    mobileHC: null,
    telephoneHC: null,
    emailHC: null,
    markerLocation: [],

  }

  //other variables
  Location: any[] = [];
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
  //variables of idAlly
  idAlly: number;
  idAllyLocalStorage: string;
  //variable for aditional services
  otherServiceSave: any;
  arrayOtherServiceSave: any = [];
  otherChecked = false;
  //flag for edit headquarter
  edit: boolean
  // Variables of alerts
  alertBadExtensionImageCoupon = false
  // flag for loading
  loadingServicesAditionals = false;
  //varibles by latitude and length for ubication headquarter
  markers: Marker[] = [];
  lat: number;
  lng: number;


  constructor(
    private storage: AngularFireStorage,
    private allies: AlliesService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private headquarters: HeadquartersService,
    private additionalServices: AdditionalServicesService,
    private allyService: AlliesService,
    private locationService: LocationServiceService,
    private _saveLocalStorageService: SaveLocalStorageService,
    private _uploadImages: UploadImagesService,
    private spinner: NgxSpinnerService) {

    

    //get Ally's id of LocalStorage
    this.idAllyLocalStorage = this._saveLocalStorageService.getLocalStorageIdAlly();

    //method for load the headquarter for edit
    this.loadIdHeadquarter()

    //get Ally's parameter
    this._activateRoute.params.subscribe(params => {
      this.idAlly = params['id']
    });
  
    // get geolocation 
      navigator.geolocation.getCurrentPosition(pos => {
        this.lat = pos.coords.latitude
        this.lng = pos.coords.longitude
   
        const newMarker = new Marker(this.lat, this.lng);
        this.markers.push(newMarker);
  
        // this.preHeadquarters['markerLocation'] = this.markers[0]
  
      }, error => console.log(error)
      )   
    
    //flag to change button save and update
    this.edit = false

    this.locationService.getLocations()
      .subscribe((data: any) => {
        let loc: any = {}
        this.Location = data.facet_groups[0].facets
        data.records.forEach((element: any) => {
          loc = {
            name: element.fields.empty1
          }
          this.Location.push(loc)
        });
        loc['name'] = "BOGOTÁ"
        this.Location.push(loc)
        if (this.preHeadquarters['ubication']) {
          let location: any = this.Location.find((e: any) => e.name === this.preHeadquarters['ubication'])
          this.preHeadquarters['ubication'] = location.name;
        }

      })

    this.services = [{ name: 'Pídelo', img: 'assets/icons/Pídelo.png', select: false }, { name: 'Resérvalo', img: 'assets/icons/Resérvalo.png', select: false }, { name: 'Llévalo', img: 'assets/icons/Llévalo.png', select: false }]

    this.aditionalServices = [{ name: 'Parqueadero', img: 'assets/icons/parking.png', select: false }, { name: 'Barra de tragos', img: 'assets/icons/cocktail.png', select: false }, { name: 'Wifi', img: 'assets/icons/wi-fi-zone.png', select: false },
    { name: 'Mesa exterior', img: 'assets/icons/people-table.png', select: false }, { name: 'Acceso a discapacitados', img: 'assets/icons/discapacity.png', select: false }, { name: 'Show en vivo', img: 'assets/icons/dance.png', select: false },
    { name: 'Zona de fumadores', img: 'assets/icons/no-smoking.png', select: false }, { name: 'Carta braile', img: 'assets/icons/braille.png', select: false }]

    this.cost = [{ name: 'Pídelo', img: 'assets/icons/Pídelo.png' }, { name: 'Resérvalo', img: 'assets/icons/Resérvalo.png' }, { name: 'Llévalo', img: 'assets/icons/Llévalo.png' }]
  }

  ngOnInit() {

  }
  addMarker(event) {

    const coords = event.coords
    const newMarker = new Marker(coords.lat, coords.lng);
    this.markers[0] = newMarker;
    
  }
  
  goBackHeadquarterOptions() {
    if (localStorage.getItem('idHeadquarter')) {
      localStorage.removeItem('idHeadquarter');
    }
    this._router.navigate(['/main', 'headquarts', this.idAlly])
  }

  getNameAlly() {
    this.allies.getAllies().subscribe(ally => {
      this.nameAlli = ally
    })
  }

  //method for load the headquarter id
  loadIdHeadquarter() {
    if (localStorage.getItem('idHeadquarter')) {
      this.headquarters.getHeadquarterById(localStorage.getItem('idHeadquarter')).subscribe(res => {
      if (res.markerLocation[0]) {
        const newMarker = new Marker(res.markerLocation[0].lat, res.markerLocation[0].lng);
        this.markers[0] = newMarker
      }

        this.edit = true
        this.preHeadquarters = res;
        res.principarlServices.forEach((principalService) => {
          if(principalService){
            let service = this.services.find(ser => ser.name === principalService.value);
            service.select = principalService.checked;
          }
        })
        res.aditionalServices.forEach((additionalService) => {
          if (additionalService) {
            let additional = this.aditionalServices.find(add => add.name == additionalService.name);

            if (!additional) {
              let obj = { name: additionalService.name, img: additionalService.img, select: true }
              this.aditionalServices.push(obj)
            } else {
              additional.select = true
            }
          }

        })
      }, err =>{
        this.spinner.hide();
        Swal.fire({
          title:"ha ocurrido un error",
          icon:"error"
        })
      })
    }
  }

  //method for adding selected additional services in a new array
  getAdditionalService(nameService: String, imageService: String, position: number, event) {
    let seviceChecked: Object = {
      name: nameService.trim(),
      img: imageService
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
  selectedAditionalService(event, pos: number, img) {
    const select = event.target.checked;
    event.target.checked = select;
    const name = event.target.value;
    event.target.value = name;

    // this.preHeadquarters['aditionalServices'][pos] = { name, checked, image }
    this.aditionalServices[pos] = { name, select, img };

  }

  //method for showing and hiding the input of a new additional service
  handleBoxOtherservice() {
    this.othersServiceInput = !this.othersServiceInput;
    this.otherChecked = !this.otherChecked
  }

  //method to select an icon for a new additional service
  selectImg(event) {

    let input = event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    if (!allowedExtensions.exec(filePath)) {
      input.value = '';
      this.alertBadExtensionImageCoupon = true;
      return false;
    } else {
      if (input.files && input.files[0]) {
        this.alertBadExtensionImageCoupon = false;

        var reader = new FileReader();
        reader.onload = (e: any) => {
          this.otherServiceSave = {
            name: this.other,
            img: e.target.result,
            select: false
          }
          this.otherServiceSave.fileImage = input.files[0]
          this.arrayOtherServiceSave.push(this.otherServiceSave)
        };
        reader.readAsDataURL(input.files[0]);

      }
    }
  }

  //method for add to the view the new additional service
  addNewServiceadd() {
    // || this.otherImg == undefined
    if (this.other == undefined || !this.otherServiceSave) {
      Swal.fire({
        text: "¡Ingrese  la imagen y el nombre del servicio!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
      })
    } else {
      this.aditionalServices.push(this.otherServiceSave)
      //restore botton other anc clean varibales
      this.othersServiceInput = false
      this.otherChecked = false;
      this.other = ''
      this.otherServiceSave = ''
    }

  }

  //method for saving the new headquarter
  saveHq() {
    this.preHeadquarters['idAllies'] = this.idAllyLocalStorage;
    this.allyService.getAlliesById(this.idAllyLocalStorage).subscribe(allie => {
      this.preHeadquarters['nameAllies'] = allie.name
    })
    let selecctService = this.preHeadquarters['principarlServices'].filter(service => service.checked == true)
    if (selecctService.length > 0) {
      this.swallSaveHeadquarter()

    } else {
      Swal.fire({
        text: "¡Escoja almenos un servicio prestado!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'Ok!'
      })
    }
  }

  //method for showing the sweet alert
  swallSaveHeadquarter() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas crear esta nueva sede!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: '¡Si, crear!'
    }).then((result) => {

      if (result.value) {
        this.spinner.show()
        this.preHeadquarters['markerLocation'] = this.markers
        this.ArrayseviceChecked.forEach((element, index) => {

          let servicesChecked = this.arrayOtherServiceSave.find(service => service.name == element.name)
          if (servicesChecked) {
            this._uploadImages.uploadImages(servicesChecked.fileImage, 'allies', 'additionalServices')
              .then(urlImage => {
                element['img'] = urlImage


                if (index == (this.ArrayseviceChecked.length - 1)) {

                  this.preHeadquarters['aditionalServices'] = this.ArrayseviceChecked

                  this.headquarters.postHeadquarter(this.preHeadquarters).subscribe(message => {
                    this.spinner.hide()
                    Swal.fire({
                      title: 'Guardado',
                      text: "Tu nueva sede ha sido creada!",
                      icon: 'success',
                      confirmButtonColor: '#542b81',
                      confirmButtonText: 'Ok!'
                    }).then((result) => {
                      if (result.value) {
                        this._router.navigate(['/main', 'headquarts', this.idAlly]);
                      }
                    })
                  })
                }
              }).catch(err=>{
                this.spinner.hide();
                Swal.fire({
                  title:"Ha ocurrido un error",
                  icon:"error"
                })
              })

          } else {
            if (index == (this.ArrayseviceChecked.length - 1)) {

              this.headquarters.postHeadquarter(this.preHeadquarters).subscribe(message => {
                this.spinner.hide()
                Swal.fire({
                  title: 'Guardado',
                  text: "Tu nueva sede ha sido creada!",
                  icon: 'success',
                  confirmButtonColor: '#542b81',
                  confirmButtonText: 'Ok!'
                }).then((result) => {
                  if (result.value) {
                    this._router.navigate(['/main', 'headquarts', this.idAlly]);
                  }
                })
              }, err =>{
                this.spinner.hide();
                Swal.fire({
                  title:"ha ocurrido un error actualizando la sede",
                  icon:"error"
                })
              })
            }
          }
        });
      }
    })
  }

  //method for update headquarters new services
  updateNewServices() {
    this.spinner.show()

    let id = localStorage.getItem('idHeadquarter')
    this.headquarters.putHeadquarter(id, this.preHeadquarters).subscribe(message => {
      this.spinner.hide()
      Swal.fire({
        title: 'Guardado',
        text: "¡Tu sede ha sido actualizada!",
        icon: 'success',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'Ok!'
      }).then((result) => {
        if (result.value) {
          this._router.navigate(['/main', 'headquarts', this.idAlly]);
        }
      })
    }, err =>{
      this.spinner.hide();
    })
  }

  //method for updating the headquarter
  updateHeadquarter() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar los cambios para esta sede!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this.preHeadquarters['markerLocation'] = this.markers
        this.preHeadquarters['principarlServices'].forEach((ser, i) => {
          if(ser){
            if (ser.checked == false) {
              let cost = this.preHeadquarters['costPerService']
              cost[i].value = ""
            }
          }
        })

        if (this.ArrayseviceChecked.length > 0) {
          this.spinner.show();
          this.ArrayseviceChecked.forEach((element, index) => {

            let servicesChecked = this.arrayOtherServiceSave.find(service => service.name == element.name)
            if (servicesChecked) {
              this._uploadImages.uploadImages(servicesChecked.fileImage, 'allies', 'additionalServices')
                .then(urlImage => {
                  element['img'] = urlImage

                  if (index == (this.ArrayseviceChecked.length - 1)) {
                    this.spinner.hide();
                    this.preHeadquarters['aditionalServices'].concat(this.ArrayseviceChecked)
                    this.updateNewServices();
                  }
                })
            } else {
              if (index == (this.ArrayseviceChecked.length - 1)) {
                let servicesChecked = this.aditionalServices.filter(element => element.select == true);
                this.preHeadquarters['aditionalServices'] = servicesChecked;
                this.updateNewServices();
              }
            }


          });

        } else {
          let servicesChecked = this.aditionalServices.filter(element => element.select == true);
          this.preHeadquarters['aditionalServices'] = servicesChecked
          this.updateNewServices()
        }



      }
    })
  }

  //method for canceling the creation of a headquarter
  cancel() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas cancelar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
      if (result.value) {
        this._router.navigate(['/main', 'headquarts', this.idAlly]);
      }
    })
  }
}
