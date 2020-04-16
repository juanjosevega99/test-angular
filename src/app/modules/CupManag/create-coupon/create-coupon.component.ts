import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//services
import Swal from 'sweetalert2';
import { CouponsService } from "src/app/services/coupons.service";
import { TypeCouponService } from "src/app/services/typeCoupons.service";
import { AlliesService } from "src/app/services/allies.service";
import { HeadquartersService } from "src/app/services/headquarters.service";
import { DishesService } from "src/app/services/dishes.service";
import { UploadImagesService } from "src/app/services/providers/uploadImages.service";
//models
import { Coupons } from 'src/app/models/Coupons';
import { TypeCoupon } from "src/app/models/typeCoupons";
import { CouponList } from 'src/app/models/CouponList';
import { Allies } from '../../../models/Allies';
import { Headquarters } from 'src/app/models/Headquarters';
import { Dishes } from '../../../models/Dishes';
//import for images 
import { Guid } from "guid-typescript";
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from "@angular/fire/storage";
import { element } from 'protractor';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  preCoupon: Object = {
    codeToRedeem: null,
    state: [],
    // createDate: null,
    expirationDate: null,
    idAllies: null,
    nameAllies: null,
    idHeadquarters: null,
    nameHeadquarters: null,
    idDishes: null,
    nameDishes: null,
    idtypeOfCoupon: null,
    nameTypeOfCoupon: null,
    numberOfUnits: null,
    name: null,
    discountRate: null,
    creationTime: null,
    expirationTime: null,
    description: null,
    imageCoupon: null,
    termsAndConditions: null,
    codeReferred: null,
  }

  // editCoupon: Profiles = {
  //   state: [],
  //   entryDate: null,
  //   modificationDate: null,
  //   numberOfModifications: 0,
  //   idAllies: null,
  //   nameAllie: "kfc",
  //   idHeadquarter: null,
  //   nameHeadquarter: null,
  //   idCharge: null,
  //   nameCharge: null,
  //   userCode: null,
  //   permis: null,
  //   identification: null,
  //   name: null,
  //   email: null,
  //   photo: null
  // }

  //variables for typeCoupon
  arrayTypeCouponSelect: boolean = true;
  otherTypeCouponInput: boolean = false;
  addTypeCouponButton: boolean = true;
  selectAgainarray: boolean = false;
  newTypeCoupon: String;
  typeCoupon: any[] = [];

  //variable for the state
  State: any[] = [];

  //variables for tick
  dateEntry: String;
  timesEntry: String;
  today: Date;

  newDate: Date;
  dateModication: String;
  timesModification: String;
  //array allies
  arrayAllies: any[] = [];
  // array for search headquuarters
  arrayHeadquarter: any;
  headquartersByIdAlly: any[] = [];

  //array for search diches by id Headquarters
  arrayDishes: any;
  dishesByIdHeadquarter: any[] = [];

  //variable for upload images
  fileImagedish: any;
  urlImagedish: any;


  //variables for receiving the coupon that will be edited
  identificatorbyRoot: any;
  buttonPut: boolean;
  seeNewPhoto: boolean;

  // All Flags 
  //flags of type Coupons
  discount = false
  timeCreation = false
  //flag by state swall
  upload: boolean = false;
  // Variables of alerts
  alertBadExtensionImageCoupon = false
  //variables time
  meridian = true;
  //variable for the loading
  loading: boolean;
  

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private typeCouponService: TypeCouponService,
    private couponsServices: CouponsService,
    private alliesServices: AlliesService,
    private headquartersServices: HeadquartersService,
    private dishesServices: DishesService,
    private _uploadImages: UploadImagesService) {

    //inicalization code remider for coupon 
    let codeToRedeem = Math.random().toString(36).substring(7);
    this.preCoupon['codeToRedeem'] = codeToRedeem;
    //flags
    // this.loading = true;
    this.buttonPut = true;
    this.seeNewPhoto = false;
    this.State = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]

    this.preCoupon['state'] = this.State;

    this.activatedRoute.params.subscribe(params => {
      let identificator = params['id']
      if (identificator != -1) {
        // this.getProfile(identificator)
      } else if (identificator == -1) {
        // this.loading = false
        this.buttonPut = false
      }
      this.identificatorbyRoot = identificator
    })
    //inicialization service with collections typeCoupons
    this.typeCouponService.getTypeCoupon().subscribe(typeCoupon => {
      this.typeCoupon = typeCoupon;
    })
    //inicialization service with collections allies
    this.alliesServices.getAllies().subscribe(ally => {
      this.arrayAllies = ally
    })

  }

  ngOnInit() {
    setInterval(() => this.tick(), 1000);
  }
  goBackProfiles() {
    this._router.navigate(['/main', 'couponManager'])
  }

  //see Name ally for show headquarter
  seeNameAlly(selected: any) {
    this.arrayHeadquarter = []
    this.headquartersByIdAlly = []
    this.arrayDishes = []
    this.dishesByIdHeadquarter = []
    this.arrayAllies.forEach((element: any) => {
      if (selected == element.id) {
        this.preCoupon['nameAllies'] = element.name
        this.headquartersServices.getHeadquarterByAllIdAlly(element.id).subscribe(headquarter => {
          console.log(headquarter)
          this.arrayHeadquarter = headquarter
          this.arrayHeadquarter.forEach(element => {

            console.log('elem', element);
            let obj = {
              id: element._id,
              name: element.name
            }

            this.headquartersByIdAlly.push(obj)

          });
        })
        console.log('fsdfd', this.headquartersByIdAlly)
      }
    })
  }

  seeNameHeadquarter(selected: any) {
    this.arrayDishes = []
    this.dishesByIdHeadquarter = []
    this.headquartersByIdAlly.forEach(element => {
      if (selected == element.id) {
        this.preCoupon['nameHeadquarters'] = element.name
        this.dishesServices.getDishesByIdHeadquarter(element.id).subscribe(dish => {
          this.arrayDishes = dish
          this.arrayDishes.forEach(element => {
            let obj = {
              id: element._id,
              name: element.name
            }

            this.dishesByIdHeadquarter.push(obj)
          });

        })
      }
    });
  }

  seeNameDish(selected: any) {
    this.dishesByIdHeadquarter.forEach(element => {
      if (selected == element.id) {
        this.preCoupon['nameDishes'] = element.name;
      }
    })
  }
  seeNameTypeCoupon(selected: any) {

    this.typeCoupon.forEach(element => {
      if (selected == element.id) {
        this.preCoupon['nameTypeOfCoupon'] = element.name

        if (element.name == "Bienvenida") {
          return this.timeCreation = false

        }
        if (element.name == "2x1") {
          return this.timeCreation = true

        }
        if (element.name == "Fechas Especiales") {
          return this.timeCreation = true

        }
        if (element.name == "Descuentos 10, 20, 30, 40 % ") {
          return this.timeCreation = true

        }
        if (element.name == "Happy Hour") {
          return this.timeCreation = true

        }
        if (element.name == "Referido") {
          return this.timeCreation = false
        }

      }
    })
  }

  //Method for selecting the state
  selectedState(valueA, checkedA, valueB, checkedB) {
    let fullstate: any = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }];

    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas colocar este estado al cupon!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.value) {
        fullstate = [
          { state: valueA, check: checkedA },
          { state: valueB, check: checkedB }]
        this.preCoupon['state'] = fullstate
      }
    })
  }
  //method for delete a profile
  deleteProfile() {
    if (this.identificatorbyRoot == -1) {
      Swal.fire('No puedes eliminar este perfil ya que no ha sido creado!!')
    } else {
      // this.chargeProfiles.getProfiles().subscribe(profiles => {
      //   let profile: ProfileList = {}
      //   profile = profiles[this.identificatorbyRoot]
      //   let realId = profile.id
      //   this.swallDelete(realId)
      // })
    }
  }
  //Method for showing new view in the typeCoupon field
  handleBoxTypeCoupons(): boolean {

    if (this.addTypeCouponButton) {
      return this.addTypeCouponButton = false,
        this.otherTypeCouponInput = true,
        this.selectAgainarray = true,
        this.arrayTypeCouponSelect = false
    } else {
      return this.addTypeCouponButton = true,
        this.otherTypeCouponInput = false,
        this.selectAgainarray = false,
        this.arrayTypeCouponSelect = true
    }
  }
  //CRD -- Methos of TypeProfile: CREATE ,READ AND DELETE 
  addTypeCoupon(name: String) {
    if (name != null) {
      let newitem = name;
      let newTypeCoupon: object = {
        name: newitem
      }
      this.swallSaveTypeCoupon(newTypeCoupon)

      this.handleBoxTypeCoupons()
    } else { alert("Ingrese el nuevo cupon") }

  }

  deleteTypeCoupon() {
    let typeCouponSelected = this.preCoupon['idtypeOfCoupon']
    this.swallDeleteTypeCoupon(typeCouponSelected)
  }


  //Metod for the admission and modification date
  tick(): void {
    if (this.identificatorbyRoot == -1) {
      this.today = new Date();
      this.timesEntry = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateEntry = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
      this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    }
    else {
      // this.today = new Date();
      // this.newDate = this.editProfile['entryDate']
      // const d = new Date(this.newDate);
      // this.timesEntry = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      // this.dateEntry = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
      // this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      // this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });

    }
  }
  //Method for photo of the dish
  onPhotoSelected($event) {
    let input = $event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    let image = "";
    if (!allowedExtensions.exec(filePath)) {
      input.value = '';
      this.alertBadExtensionImageCoupon = true;
      return false;
    } else {
      if (input.files && input.files[0]) {
        this.seeNewPhoto = true;
        this.alertBadExtensionImageCoupon = false;

        var reader = new FileReader();
        reader.onload = function (e: any) {
          $('#photo')
            .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    return this.fileImagedish = input.files[0]
  }
  //save new coupon
  saveCoupon() {
    this.swallSave()
  }
  //putProfile
  // putProfile() {
  //   this.chargeProfiles.getProfiles().subscribe(profiles => {
  //     let profile: Profiles = {};
  //     profile = profiles[this.identificatorbyRoot];
  //     let realId = profile.id;
  //     this.editProfile.state = this.preProfile['state'];
  //     this.editProfile.entryDate = profile.entryDate;
  //     this.editProfile.modificationDate = this.today;
  //     this.editProfile.idAllies = profile.idAllies;
  //     this.editProfile.nameAllie = profile.nameAllie;
  //     this.editProfile.idHeadquarter = profile.idHeadquarter;
  //     this.editProfile.nameHeadquarter = profile.nameHeadquarter;
  //     this.editProfile.idCharge = this.preProfile['idCharge'];
  //     this.editProfile.nameCharge = this.preProfile['nameCharge'];
  //     this.editProfile.userCode = this.preProfile['userCode'];
  //     this.editProfile.permis = this.preProfile['permis'];
  //     this.editProfile.identification = this.preProfile['identification'];
  //     this.editProfile.name = this.preProfile['name'];
  //     this.editProfile.email = this.preProfile['email'];
  //     this.swallUpdate(realId)
  //   })
  // }

  //sweet alerts
  swallSaveTypeCoupon(newTypeCoupon: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar este nuevo cupon!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.typeCouponService.postTypeCoupon(newTypeCoupon).subscribe(() => {
          this.typeCouponService.getTypeCoupon().subscribe(typeCoupon => {
            this.typeCoupon = typeCoupon;
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nuevo cupon ha sido creado',
          'success',
        )
      }
    })
  }
  swallDeleteTypeCoupon(typeCouponSelected: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este cupon!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.typeCouponService.deleteTypeCoupon(typeCouponSelected).subscribe(() => {
          this.typeCouponService.getTypeCoupon().subscribe(typeCoupon => {
            this.typeCoupon = typeCoupon;
            console.log(this.typeCoupon)
          })
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }

  //swall for save collection Coupon
  swallSave() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this._uploadImages.uploadImages(this.fileImagedish, 'adminCoupon', 'coupon') 
        .then(urlImage => {
            this.upload = true;
            this.preCoupon['imageCoupon'] = urlImage
            this.couponsServices.postCoupon(this.preCoupon).subscribe()
            if (this.upload == true) {
              Swal.fire({
                title: 'Guardado',
                text: "Tu nuevo cupón ha sido creado!",
                icon: 'warning',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              }).then((result) => {
                if (result.value) {
                  this._router.navigate(['/main', 'couponManager',]);
                }
              })
            }
          })
          .catch((e)=> { console.log(e)
            if (this.upload == false) {
              Swal.fire({
                text: "El cupón no ha sido creado porque no se subió la imagen",
                icon: 'warning',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              })
            }
          }
          );

       
      }
    })
  }

}
