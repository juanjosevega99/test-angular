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
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service";
import { CouponsAvailableService } from "src/app/services/coupons-available.service";
import { TermsAndConditions } from 'src/app/models/TermsAndConditions';
import { TermsAndConditionsService } from "src/app/services/terms-and-conditions.service";
@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  preCoupon: Object = {
    state: [],
    createDate: [],
    creationTime: [],
    idAllies: null,
    nameAllies: null,
    idHeadquarters: null,
    nameHeadquarters: null,
    idDishes: null,
    nameDishes: null,
    idtypeOfCoupon: null,
    nameTypeOfCoupon: null,
    discountRate: null,
    expirationDate: [],
    expirationTime: [],
    name: null,
    numberOfUnits: null,
    numberOfCouponsAvailable: null,
    description: null,
    imageCoupon: null,
    idTermsAndConditions: null,
    nameTermsAndConditions: null,
    codeReferred: null,
  }

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

  //array for search couponsAvailable by idCoupon
  couponsAvailableByIdCoupon : any;
  //variable for upload images
  fileImageCoupon: any;
  // urlImagedish: any;

  //variables for receiving the coupon that will be edited
  identificatorbyRoot: any;
  idParams: number;
  buttonPut: boolean;
  seeNewPhoto: boolean;
  
  // variables for collection Tyc
  tycGettting: TermsAndConditions[] = [];
  newArray = this.tycGettting;
  arrayTyc: any;
   //variables for general search
   generalsearch: string = "";
  // All Flags 
  //flags of type Coupons
  timeCreation = true
  finishDate = true
  //flag by state swall
  upload: boolean = false;
  // Variables of alerts
  alertBadExtensionImageCoupon = false
  //variables time
  meridian = true;
  //variable for the loading
  loading: boolean;
  loadingTable :boolean;
  // flag dont result
  noResults = false;
  
  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private typeCouponService: TypeCouponService,
    private couponsServices: CouponsService,
    private alliesServices: AlliesService,
    private headquartersServices: HeadquartersService,
    private dishesServices: DishesService,
    private _uploadImages: UploadImagesService,
    private saveLocalStorageService: SaveLocalStorageService,
    private couponsAvilableService: CouponsAvailableService,
    private tycManegerService: TermsAndConditionsService) {

    //flags
    this.loading = true;
    this.buttonPut = true;
    this.seeNewPhoto = false;
    this.State = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: true
    }]

    this.preCoupon['state'] = this.State;

    this.activatedRoute.params.subscribe(params => {
      let idCoupon = this.saveLocalStorageService.getLocalStorageIdCoupon();
      let identificator = params['id']
      if (identificator != -1) {
        this.getCoupon(idCoupon)
      } else if (identificator == -1) {
        this.loading = false
        this.buttonPut = false
      }
      this.idParams = identificator
      this.identificatorbyRoot = idCoupon
    })
    //inicialization service with collections typeCoupons
    this.typeCouponService.getTypeCoupon().subscribe(typeCoupon => {
      this.typeCoupon = typeCoupon;
      if (this.preCoupon['idtypeOfCoupon']) {
        let type = this.typeCoupon.find(element => element.id === this.preCoupon['idtypeOfCoupon'])
        this.preCoupon['idtypeOfCoupon'] = type.id
      }
    })
    //inicialization service with collections allies
    this.alliesServices.getAllies().subscribe(ally => {
      this.arrayAllies = ally

      if (this.preCoupon['idAllies']) {
        var dbAlly = this.arrayAllies.find(element => element.id === this.preCoupon['idAllies'])
        this.preCoupon['idAllies'] = dbAlly.id
        this.seeNameAlly(this.preCoupon['idAllies'])

      }
    })

  }

  ngOnInit() {

  }
  goBackProfiles() {
    this._router.navigate(['/main', 'couponManager'])
  }
  //obtain coupon selected for update
  getCoupon(idCoupon: string) {
    this.loading
    this.couponsServices.getCouponById(idCoupon).subscribe(coupon => {
      this.preCoupon = coupon
      this.loading = false;
    })
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
          this.arrayHeadquarter = headquarter
          this.arrayHeadquarter.forEach(element => {

            let obj = {
              id: element._id,
              name: element.name
            }
            this.headquartersByIdAlly.push(obj)
            if (this.preCoupon['idHeadquarters'] && obj.id == this.preCoupon['idHeadquarters']) {
              this.seeNameHeadquarter(this.preCoupon['idHeadquarters']);
            }

          });

        })
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
              id: element.id,
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


        if (element.name == "2x1") {
          return this.timeCreation = true, this.finishDate = true

        }
        if (element.name == "Fechas Especiales") {
          return this.timeCreation = true, this.finishDate = true

        }
        if (element.name == "Descuentos") {
          return this.timeCreation = false, this.finishDate = false

        }
        if (element.name == "Happy Hour") {
          return this.timeCreation = true, this.finishDate = true

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
      title: '¿Estás seguro?',
      text: "¡De que deseas colocar este estado al cupon!",
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
    return this.fileImageCoupon = input.files[0]
  }
// method for modal TyC

  makeObjTycManager() {
    this.loadingTable = true
    this.tycGettting = [];
    this.newArray = this.tycGettting;
    this.tycManegerService.getTermsAndConditions().subscribe((res:any) => {
      this.arrayTyc = res;
      let arrayTycCoupons = this.arrayTyc.filter((tyc) => tyc.nameTypeTyc == 'Términos y condiciones cupones')
      if (arrayTycCoupons.length != 0) {
        arrayTycCoupons.forEach((tyc: TermsAndConditions, index) => {
          const obj: TermsAndConditions = {};
          obj.id = tyc.id
          obj.name = tyc.name
          obj.nameTypeTyc = tyc.nameTypeTyc
          obj.description = tyc.description

          this.tycGettting.push(obj)          
          if(index === (res.length -1)){
            this.loadingTable = false;
          }
        });
      }else {
        this.loadingTable=false
        this.noResults = true 
      }
    })
  }
  addTycToCoupon(idTyc:string, nameTyc:string){
    this.preCoupon['idTermsAndConditions'] = idTyc
    this.preCoupon['nameTermsAndConditions'] = nameTyc
  }

  //save new coupon
  saveCoupon() {
    this.swallSave()
  }
  //method for create coupon units
  generateCoupons(idCoupon: string) {
    for (let i = 0; i < this.preCoupon['numberOfUnits']; i++) {
      let obj = {
        idCoupon: idCoupon,
        state: false
      }
      this.couponsAvilableService.postCouponAvailable(obj).subscribe()
    }
  }

  //sweet alerts
  swallSaveTypeCoupon(newTypeCoupon: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas guardar este nuevo cupon!",
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
      title: '¿Estás seguro?',
      text: "¡De que deseas eliminar este cupon!",
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
      title: '¿Estás seguro?',
      text: "¡De que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.loading = true
        this._uploadImages.uploadImages(this.fileImageCoupon, 'adminCoupon', 'coupon')
          .then(urlImage => {
            this.upload = true;
            this.preCoupon['imageCoupon'] = urlImage
            this.preCoupon['numberOfCouponsAvailable'] = this.preCoupon['numberOfUnits']
            this.couponsServices.postCoupon(this.preCoupon).subscribe((coupon: any) => {
              let idCoupon = coupon._id;
              this.generateCoupons(idCoupon)
              this.loading = false
              
            })

            if (this.upload == true) {
              Swal.fire({
                title: 'Guardado',
                text: "¡Tu nuevo cupón ha sido creado!",
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
          .catch((e) => {
            if (this.upload == false) {
              Swal.fire({
                text: "¡El cupón no ha sido creado porque no se subió la imagen",
                icon: 'warning',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              })
            }
          });
      }
    })
  }
  uploadCouponUpdate() {
    let objCoupon: any = this.preCoupon
    objCoupon.id = this.identificatorbyRoot
    objCoupon.numberOfCouponsAvailable = this.preCoupon['numberOfUnits']
    this.couponsServices.putCoupon(objCoupon).subscribe(()=> this.loading=false)
  }

  //swall for update collection Coupon
  swallUpdateCoupon() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {

      if (result.value) {
        this.loading = true
        if (this.seeNewPhoto == false) {
          this.uploadCouponUpdate()
          Swal.fire({
            title: 'Guardado',
            text: "¡Tu nuevo cupón ha sido actualizado!",
            icon: 'warning',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.value) {
              this._router.navigate(['/main', 'couponManager',]);
            }
          })
        } else if (this.seeNewPhoto == true) {
          this._uploadImages.uploadImages(this.fileImageCoupon, 'adminCoupon', 'coupon')
            .then(urlImage => {
              this.upload = true;
              this.preCoupon['imageCoupon'] = urlImage
              this.uploadCouponUpdate()
              if (this.upload == true) {
                Swal.fire({
                  title: 'Guardado',
                  text: "¡Tu nuevo cupón ha sido actualizado!",
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
            .catch((e) => {
              if (this.upload == false) {
                Swal.fire({
                  text: "El cupón no ha sido actualizado porque no se subió la imagen",
                  icon: 'warning',
                  confirmButtonColor: '#542b81',
                  confirmButtonText: 'Ok!'
                })
              }
            });
        }
      }
    })

  }
  // delete coupon selected 
  swallDeleteCoupon() {
    if (this.idParams == -1) {
      Swal.fire('¡No puedes eliminar este cupón ya que no ha sido creado!')
    } else {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡De que deseas eliminar este coupón!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#542b81',
        cancelButtonColor: '#542b81',
        confirmButtonText: 'Si, eliminar!'
      }).then((result) => {
        if (result.value) {
          this.loading = true
          let urlImg = 'assets/adminCoupon/coupon/' + this.preCoupon['imageCoupon'].split("%")[3].split("?")[0].slice(2);
          this._uploadImages.DeleteImage(urlImg).then(res =>{
            this.couponsServices.deleteCoupon(this.identificatorbyRoot).subscribe()
            this.couponsAvilableService.getCouponAvailableByIdCoupon(this.identificatorbyRoot)
            .subscribe( couponAvailable => {
              this.couponsAvailableByIdCoupon = couponAvailable
              this.couponsAvailableByIdCoupon.forEach(element => {
                this.couponsAvilableService.deleteCouponAvailable(element._id).subscribe()
              });
            })          
          })
          Swal.fire({
            title: 'Eliminado',
            text: "¡Tu cupón ha sido eliminado!",
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
    }
  }
    //method for a specific search
    search() {

      var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');
  
      this.newArray = this.tycGettting.
        filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.name) || myRegex.test(item.description))
        })
      // condition by when don't exit results in the table
      if (this.newArray.length == 0) {
        this.noResults = true;
  
      } else {
        this.noResults = false;
      }
  
    }
  

}
