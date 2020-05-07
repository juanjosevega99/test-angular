import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { DishesService } from 'src/app/services/dishes.service';
import { DishesCategoriesService } from "src/app/services/dishes-categories.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Guid } from "guid-typescript";
import { Dishes } from 'src/app/models/Dishes';
import { DishList } from 'src/app/models/DishList';
import { Promotions } from 'src/app/models/Promotions';
import { PromotionsCategoriesService } from 'src/app/services/promotions-categories.service';
import { PromotionsService } from 'src/app/services/promotions.service';
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service";
import { CouponsService } from "src/app/services/coupons.service"
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { UploadImagesService } from "src/app/services/providers/uploadImages.service";


@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.scss']
})
export class CreateDishComponent implements OnInit, OnDestroy {

  //Object to save the dates of the form
  preDish: Object = {
    idDishesCategories: null,
    state: [],
    numberOfModifications: 0,
    nameDishesCategories: null,
    reference: null,
    name: null,
    price: null,
    imageDishe: null,
    description: null,
    preparationTime: [],
    idAccompaniments: [],
    idPromotion: [],
    idHeadquarter: null
  }

  editDish: Dishes = {
    idDishesCategories: null,
    nameDishesCategories: null,
    reference: null,
    name: null,
    creationDate: null,
    numberOfModifications: null,
    state: [],
    price: null,
    imageDishe: null,
    description: null,
    preparationTime: null,
    idAccompaniments: [],
    idPromotion: []
  }

  promotionArray: Object = {
    id: null,
    state: [],
    promotionStartDate: [],
    endDatePromotion: [],
    idname: null,
    price: null,
    name: null,
    imageTypePromotion: null,
    photo: null,
    description: null,
    preparationTime: [],
    reference: null,
    numberOfModifications: 0,
    idAllies: null,
    flag:false,
  }

  tickFunction: any;

  //variables for receiving the profile that will be edited
  identificatorbyRoot: any;
  buttonPut: boolean;
  seeNewPhoto: boolean;

  //variables for tick
  dateEntry: String;
  timesEntry: String;
  today: Date;

  newDate: Date;
  dateModication: String;
  timesModification: String;

  //variables for categories
  arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;
  dishesCategories: any[] = [];

  State: any[] = [];

  time: String[] = [];

  //variable for upload images
  fileImagedish: any;
  urlDish: Observable<string>;

  //variable for the loading
  loading: boolean;

  //varibles for dishes with promotion
  linkEditMenu = false;
  promotion = false;
  meridian = true;
  promotionsCategories: any[] = [];
  idPromotion: string;
  idroute: string[] = [];
  selectuser: boolean;
  stateInactive: boolean;
  //variable for images type promotion
  fileImagePromCategory: any;

  // Variables of alerts
  alertBadExtensionLogo = false;
  //flag by state swall
  upload: boolean = false;
  // Variables of alerts
  alertBadExtensionImagePromCategory = false

  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private chargeDishes: DishesService,
    private storage: AngularFireStorage,
    private dishCategory: DishesCategoriesService, private promotionCategory: PromotionsCategoriesService,
    private promotionService: PromotionsService, private saveLocalStorageService: SaveLocalStorageService,
    private spinner: NgxSpinnerService, private _location: Location,
    private couponsService: CouponsService,
    private _uploadImages: UploadImagesService) {

    //flags
    this.loading = true;
    this.buttonPut = true;
    this.seeNewPhoto = false;
    this.selectuser = false;
    this.stateInactive = false;

    this.State = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]

    this.preDish['state'] = this.State;
    this.promotionArray['state'] = this.State;
    this.time = ['segundos', 'minutos', 'horas']


    //inicialization local storage 
    this.saveLocalStorageService.saveLocalStorageIdAlly;
    this.saveLocalStorageService.saveLocalStorageIdHeadquarter;
    this.saveLocalStorageService.saveLocalStorageIdPromotion;

    //inicialization for charging the data of a dish to edit
    this.activatedRoute.params.subscribe(params => {

      let identificator = params['id']
      if (identificator >= 0) {
        this.getDish(identificator);
      } else if (identificator == -1) {
        this.loading = false;
        this.buttonPut = false;
      } else if (identificator == -2) {

        let url = this._location.path().split('/');
        this.getDish(url[3]);
        this.loading = false;
        this.buttonPut = false;
        this.selectuser = false;
        this.promotion = true;
        // this.linkEditMenu = true;
      } else if (identificator != "") {
        this.buttonPut = true
        this.promotion = true
        this.linkEditMenu = true;
        this.selectuser = true
        this.getDishwithPromo(identificator);
      }
      this.identificatorbyRoot = identificator;
      this.tick();
      this.tickEdit();
    })

    //inicialization service with collections dishes-categories
    this.dishCategory.getDishCategory().subscribe(dishesCat => {
      this.dishesCategories = dishesCat;
    })

    //inicialization service with collections promotions-categories
    this.promotionCategory.getPromotionCategory().subscribe(promotionCat => {
      this.promotionsCategories = promotionCat;
    })
  }

  ngOnInit() {

    if (this.identificatorbyRoot == -1) {
      this.tickFunction = setInterval(() => this.tick(), 30000);
      this.tick();
    }
  }

  ngOnDestroy() {
    clearTimeout(this.tickFunction);
  }

  back() {
    console.log(this.promotion);
  }

  gotopromotion() {

    const url = this._location.path();
    // this._router.navigate([url + '/-2']);

    this.ifChanges([url + '/-2'])
  }
  
  goBackEditMenu() {

    let url = this._location.path().split('/');

    if (url.length >= 5) {
      this._location.back();

    } else {
      this._router.navigate(['/main', 'editmenu', this.identificatorbyRoot]);
    }

  }

  routeAccompaniments() {
    this.ifChanges(['/main', 'accompaniments', this.identificatorbyRoot]);
  }

  // if changes function verify if cahnges in dish and get question if you want to sava changes
  ifChanges(rute:string[]){
    this.chargeDishes.getDisheById( this.editDish['id'] ).subscribe( dish =>{
      
      if(this.editDish.state[0]['check'] === dish.state[0]['check'] && this.editDish.idDishesCategories === dish.idDishesCategories && this.editDish.reference === dish.reference
      && this.editDish.name === dish.name && this.editDish.price === dish.price && this.editDish.imageDishe === dish.imageDishe && this.editDish.description === dish.description
      && this.editDish.preparationTime[0] === dish.preparationTime[0]  && this.editDish.preparationTime[1] === dish.preparationTime[1]){

        this._router.navigate(rute)
        
      }else{

        Swal.fire({
          title:"Desea guardar los cambios",
          icon:"question",
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Guardar'

        }).then(res=>{

          if(res.value){
            this.updateDish(rute);
          }else{
            this._router.navigate(rute);
          }
        })

      }

    })
  }

  //Metod to see the id of promotion cateogy selected
  seeIdPromCat(selected) {
    for (let i = 0; i < this.promotionsCategories.length; i++) {
      const proms = this.promotionsCategories[i];
      if (selected == proms.name) {
        this.promotionArray['idname'] = proms.id
      }
    }
  }

  //CRD -- Methos of TypePromo: CREATE ,READ AND DELETE 
  addCategoryPromo(name: String) {
    if (name == undefined || !this.fileImagePromCategory  ) {
      Swal.fire({
        text: "¡Ingrese  la imagen y el nombre del tipo de promoción!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
      })
    } else { 
      this.swallSaveOtherPromo(name)
      this.handleBoxCategories()
      
    }
  }
  //Method for photo of the dish
  onPhotoSelectedImagesPromCategory($event) {
    let input = $event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    let image = "";
    if (!allowedExtensions.exec(filePath)) {
      input.value = '';
      this.alertBadExtensionImagePromCategory = true;
      return false;
    } else {
      if (input.files && input.files[0]) {
        this.seeNewPhoto = true;
        this.alertBadExtensionImagePromCategory = false;

        var reader = new FileReader();
        reader.onload = function (e: any) {
          $('#photo')
            .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    return this.fileImagePromCategory = input.files[0]
  }
  deleteCategoryPromo() {
    let categorySelected = this.promotionArray['name']
    this.swallDeleteCatPromo(categorySelected)
  }

  //Method to see the id of the dish category selected
  seeId(selected) {
    for (let i = 0; i < this.dishesCategories.length; i++) {
      const dishes = this.dishesCategories[i];
      if (selected == dishes.name) {
        this.preDish['idDishesCategories'] = dishes.id
      }
    }
  }

  //charge a dish with the id
  getDish(id: string) {

    this.loading = true;
    /* this.chargeDishes.getDishes().subscribe(dishes => { */
    this.chargeDishes.getDishesByIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(dishes => {
      let dish: Dishes = {}
      dish = dishes[id]

      this.editDish = dish;
      this.preDish = dish;
      this.loading = false;
      this.tickEdit();

    })

    /* }) */
  }

  //charge a promotion with the id
  getDishwithPromo(reference: string) {
    this.loading;
    this.promotionService.getPromotions().subscribe(promos => {
      let promo: Promotions = {}
      promos.forEach(x => {
        if (reference == x.reference) {
          promo = x
          if (x.state[1].check) { this.stateInactive = true }
          this.promotionArray = promo;
          this.chargeDishes.getDishes().subscribe(dishes => {
            dishes.forEach(y => {
              for (let index = 0; index < y.idPromotion.length; index++) {
                const element = y.idPromotion[index];
                if (x.id == element) {
                  this.editDish = y;
                  this.preDish = y;
                }
              }
            })
          })
          this.loading = false
        }
      })
    })
  }

  //select state true
  correctState() {
    Swal.fire({
      text: "El estado de la promoción debe estar en activo para poder seleccionar usuarios!",
      icon: 'warning',
      confirmButtonColor: '#542b81',
      confirmButtonText: 'Ok!'
    })
  }

  //redirect to select users
  goSelectUsers() {
    this.saveLocalStorageService.saveLocalStorageIdPromotion(this.promotionArray['id']);
    this._router.navigate(['/main', 'userManager', -1]);
  }

  //Method for showing new view in the categories field
  handleBoxCategories(): boolean {
    if (this.addcategoryButton) {
      return this.addcategoryButton = false,
        this.otherCategoryInput = true,
        this.selectAgainarray = true,
        this.arrayCategorySelect = false
    } else {
      return this.addcategoryButton = true,
        this.otherCategoryInput = false,
        this.selectAgainarray = false,
        this.arrayCategorySelect = true
    }
  }

  //CRD -- Methos of TypeDish: CREATE ,READ AND DELETE 
  addCategory(name: String) {
    if (name != null) {
      let newitem = name;
      let newCategory: object = {
        name: newitem
      }
      this.swallSaveOtherDish(newCategory)

      this.handleBoxCategories()
    } else { 
      Swal.fire({
        text: "¡Ingrese el nombre de la nueva categoría!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
      })
    }
  }

  deleteCategory() {
    let categorySelected = this.preDish['nameDishesCategories']
    this.swallDeleteDish(categorySelected)
  }

  //Method for photo of the dish
  onPhotoSelected($event) {
    let input = $event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    if (!allowedExtensions.exec(filePath)) {
      this.alertBadExtensionLogo = true;
      input.value = '';
      return false;
    } else {
      if (input.files && input.files[0]) {
        this.alertBadExtensionLogo = false;
        this.seeNewPhoto = true;
        console.log(this.seeNewPhoto);
        var reader = new FileReader();
        reader.onload = function (e: any) {
          $('#photo')
            .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);

      }
    }
    return this.fileImagedish = input.files[0];

  }

  //Method for selecting the state of a promotion
  selectedStateProm(valueA, checkedA, valueB, checkedB) {
    let fullstate: any = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }];

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas colocar este estado a la promoción!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.value) {
        fullstate = [
          { state: valueA, check: checkedA },
          { state: valueB, check: checkedB }]
        this.promotionArray['state'] = fullstate
      }
    })
  }
  //Method for selecting the state of a dish
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
      text: "¡De que deseas colocar este estado al plato!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.value) {
        fullstate = [
          { state: valueA, check: checkedA },
          { state: valueB, check: checkedB }]
        this.preDish['state'] = fullstate
      }
    })
  }

  //Method for the admission date
  tick(): void {
    if (this.identificatorbyRoot == -1) {
      this.today = new Date();
      this.timesEntry = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateEntry = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
      this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    }

  }

  tickEdit() {
    this.today = new Date();
    this.newDate = this.editDish.creationDate;
    const d = new Date(this.newDate);
    this.timesEntry = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    this.dateEntry = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
  }

  //CRUD PROMOTION

  //save a promotion
  savePromotion() {
    this.swallSavePromotion(this.promotionArray)
  }

  //put the promotion
  putPromotion() {
    this.promotionService.getPromotions().subscribe(promos => {
      let promo: Promotions = {};
      promos.forEach(x => {
        if (this.identificatorbyRoot == x.reference) {
          promo = x
          let realId = x.id;
          Swal.fire({
            title: '¿Estás seguro?',
            text: "de que deseas guardar los cambios!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#542b81',
            cancelButtonColor: '#542b81',
            confirmButtonText: 'Si, guardar!'
          }).then(async (result) => {
            if (result.value) {
              this.spinner.show()
              //console.log("Array FINAL: ", this.promotionArray);
              this.promotionArray['numberOfModifications'] = this.promotionArray['numberOfModifications'] + 1
              if (this.seeNewPhoto == false) {
                this.promotionArray['photo'] = x.photo;
                this.promotionService.putPromotion(realId, this.promotionArray).subscribe(res => {
                  this.spinner.hide()
                  Swal.fire({
                    title: 'Guardado',
                    text: "¡Tu promoción ha sido actualizada!",
                    icon: 'success',
                    confirmButtonColor: '#542b81',
                    confirmButtonText: 'Ok!'
                  }).then((result) => {
                    if (result.value) {
                      this._router.navigate(['/main', 'promoManager']);
                    }
                  })

                })
              } else if (this.seeNewPhoto == true) {
                const id: Guid = Guid.create();
                const file = this.fileImagedish;
                const filePath = `assets/allies/promotions/${id}`;
                const ref = this.storage.ref(filePath);
                const task = this.storage.upload(filePath, file);
                task.snapshotChanges()
                  .pipe(
                    finalize(() => {
                      ref.getDownloadURL().subscribe(urlImage => {
                        this.urlDish = urlImage;
                        console.log(this.urlDish);
                        this.promotionArray['photo'] = this.urlDish
                        this.promotionService.putPromotion(realId, this.promotionArray).subscribe(res => {
                          this.loading=false;
                          Swal.fire({
                            title: 'Guardado',
                            text: "Tu promoción ha sido actualizada!",
                            icon: 'success',
                            confirmButtonColor: '#542b81',
                            confirmButtonText: 'Ok!'
                          }).then((result) => {
                            if (result.value) {
                              this._router.navigate(['/main', 'promoManager']);
                            }
                          })
                        })
                      })
                    }
                    )
                  ).subscribe()
              }
            }
          })
        }
      })

    })
  }

  //delete a promotion
  deletePromo() {
    if (this.identificatorbyRoot == -2) {
      Swal.fire({
        title: 'Error',
        text: "¡No puedes eliminar esta promoción ya que no ha sido creada!",
        icon: 'error',
        showConfirmButton: true,
        confirmButtonColor: '#542b81'
      })
    } else {
      this.promotionService.getPromotions().subscribe(promos => {
        let promo: Promotions = {};
        promos.forEach(x => {
          if (this.identificatorbyRoot == x.reference) {
            promo = x
            let realId = x.id;
            Swal.fire({
              title: '¿Estás seguro?',
              text: "¡De que deseas eliminar esta promoción!",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#542b81',
              cancelButtonColor: '#542b81',
              confirmButtonText: 'Si, eliminar!'
            }).then((result) => {
              if (result.value) {
                this.loading=true;
                this.promotionService.deletePromotion(realId).subscribe(message => {
                  this.chargeDishes.getDishesByIdAlly(localStorage.getItem("idAlly")).subscribe(res => {
                    res.forEach(dish => {
                      if(dish.idPromotion.length){
                        for (let index = 0; index < dish.idPromotion.length; index++) {
                          if (realId == dish.idPromotion[index]) {
                            //console.log(dish.idPromotion);
                            dish.idPromotion.splice(index, 1)
                            let newids: any = {
                              idPromotion: dish.idPromotion
                            }
                            this.chargeDishes.putDishe(dish.id, newids).subscribe(res => { })
                          }
                        }
                      }
                    })
                  })
                  this.loading=false;
                  Swal.fire({
                    title: 'Eliminado',
                    text: "¡La promoción ha sido eliminada!",
                    icon: 'success',
                    confirmButtonColor: '#542b81',
                    confirmButtonText: 'Ok!'
                  }).then((result) => {
                    if (result.value) {
                      this._router.navigate(['/main', 'promoManager']);
                    }
                  })
                })
              }
            })
          }
        })
      })
    }
  }

  //CRUD DISH
  //save new dish
  saveDish(shape: NgForm) {
    this.swallSaveDish(this.preDish)
  }

  //delete the dish
  deleteDish() {
    if (this.identificatorbyRoot == -1) {
      Swal.fire({
        text: "¡No puedes eliminar este plato ya que no ha sido creado!",
        icon: 'error',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'Ok!'
      })
    } else {
      this.chargeDishes.getDishesByIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(dishes => {
        let dish: DishList = {}
        dish = dishes[this.identificatorbyRoot]
        let realId = dish.id
        this.couponsService.getCoupons().subscribe(coupons => {
          let tycCoupon = coupons.filter(coupon => coupon.idDishes == realId)
          if (tycCoupon.length != 0) {
            Swal.fire({
              text: `No se puede eliminar el plato porque esta utilizado en el cupón: ${tycCoupon[0].name} `,
              icon: 'warning',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            })
          } else {
            this.swallDelete(realId)
          }
        })

      })
    }
  }

  //put the dish
  putDish() {
    this.swallUpdate();
  }

  //sweet alerts
  swallSaveOtherPromo(name: String) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "!Deseas guardar esta nueva categoría!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: '!Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._uploadImages.uploadImages(this.fileImagePromCategory, 'allies', 'typePromotion')
          .then(urlImage => {
            this.promotionArray['imageTypePromotion'] = urlImage
            let newitem = name;
            let newCategory: object = {
              name: newitem,
              imageTypePromotion: urlImage
            }
            this.promotionCategory.postPromotionCategory(newCategory).subscribe(() => {
              this.promotionCategory.getPromotionCategory().subscribe(promC => {
                this.promotionsCategories = promC;
              })
              this.spinner.hide()
            })
            Swal.fire({
              title: 'Guardado!',
              text: "¡Tu nueva categoría de promoción ha sido creada!",
              icon: 'success',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            })
            
          })
      }
    })
  }

  swallDeleteCatPromo(categorySelected: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas eliminar esta categoría!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.promotionCategory.getPromotionCategory().subscribe(promC => {
          this.promotionsCategories = promC;
          this.promotionsCategories.forEach((element: any) => {
            let promo: any = {
              id: element.id,
              name: element.name
            }
            if (promo.name == categorySelected) {
              this.promotionCategory.deletePromotionCategory(promo.id).subscribe(() => {
                this.promotionCategory.getPromotionCategory().subscribe(promos => {
                  this.promotionsCategories = promos;
                })
              })
            }
          });
        })
        Swal.fire({
          title: '¡Eliminado!',
          icon: 'success',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      }
    })
  }

  swallSaveOtherDish(newCategory: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar esta nueva categoría!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.dishCategory.postDishCategory(newCategory).subscribe(() => {
          this.dishCategory.getDishCategory().subscribe(dishC => {
            this.dishesCategories = dishC;
          })
        })
        Swal.fire({
          title: 'Guardado!',
          text: "¡Tu nueva categoría de plato ha sido creada!",
          icon: 'success',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      }
    })
  }

  swallDeleteDish(categorySelected: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas eliminar esta categoría!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.dishCategory.getDishCategory().subscribe(dishC => {
          this.dishesCategories = dishC;
          this.dishesCategories.forEach((element: any) => {
            let dish: any = {
              id: element.id,
              name: element.name
            }
            if (dish.name == categorySelected) {
              this.dishCategory.deleteDishCategory(dish.id).subscribe(() => {
                this.dishCategory.getDishCategory().subscribe(dishes => {
                  this.dishesCategories = dishes;
                })
              })
            }
          });
        })
        Swal.fire({
          title: '¡Eliminado!',
          icon: 'success',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      }
    })
  }

  swallSaveDish(newHeadquarter: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {

        this.spinner.show();
        this.preDish['idAlly'] = localStorage.getItem('idAlly');
        this.preDish['idHeadquarter'] = localStorage.getItem('idHeadquarter');
        const id: Guid = Guid.create();
        const file = this.fileImagedish;

        this._uploadImages.uploadImages(this.fileImagedish, 'allies', 'menu')
          .then(urlImage => {
            this.upload = true;
            this.preDish['imageDishe'] = urlImage
            this.chargeDishes.postDishe(this.preDish).subscribe(message => {
              this.spinner.hide();

            })

            if (this.upload == true) {
              Swal.fire({
                title: 'Guardado',
                text: "¡Tu nuevo plato ha sido creado!",
                icon: 'success',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              }).then((result) => {
                if (result.value) {
                  this._router.navigate(['/main', 'editmenu', this.identificatorbyRoot]);
                }
              })
            }
          })
          .catch((e) => {
            if (this.upload == false) {
              this.spinner.hide();
              Swal.fire({
                text: "El plato no ha sido creado porque no se subió la imagen",
                icon: 'warning',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              })
            }
          });
      }
    })
  }

  swallDelete(realId) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas eliminar este plato!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {

        let urlImg = 'assets/allies/menu/' + this.preDish['imageDishe'].split("%")[3].split("?")[0].slice(2);
        this._uploadImages.DeleteImage(urlImg).then(res => {
          this.chargeDishes.deleteDishe(realId).subscribe(message => {
            Swal.fire({
              title: 'Eliminado',
              text: "!Tu plato ha sido eliminado!",
              icon: 'success',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            }).then((result) => {
              if (result.value) {
                this._router.navigate(['/main', 'editmenu', this.identificatorbyRoot]);
              }
            })
          })
        })

      }
    })
  }

  async swallUpdate() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas guardar los cambios!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then(async (result) => {

      if (result.value) {
        this.spinner.show();

        this.updateDish(['/main', 'editmenu', this.identificatorbyRoot])        
      }
    })
  }

  async updateDish( rute:string[] ){
    this.spinner.show();
        
        await this.chargeDishes.getDishesByIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(dishes => {

          let dish: Dishes = {};
          dish = dishes[this.identificatorbyRoot];

          let realId = dish.id;
          this.editDish.numberOfModifications = this.editDish['numberOfModifications'] + 1;

          if (this.seeNewPhoto == false) {

            this.chargeDishes.putDishe(realId, this.editDish).subscribe(res => {
              this.spinner.hide();
              Swal.fire({
                title: 'Guardado',
                text: "!Tu plato ha sido actualizado!",
                icon: 'success',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              }).then((result) => {
                if (result.value) {
                  this._router.navigate(rute);
                }
              })

            })
          } else if (this.seeNewPhoto == true) {
            const id: Guid = Guid.create();
            const file = this.fileImagedish;
            const filePath = `assets/allies/menu/${id}`;
            const ref = this.storage.ref(filePath);
            const task = this.storage.upload(filePath, file);
            task.snapshotChanges()
              .pipe(
                finalize(() => {
                  ref.getDownloadURL().subscribe(urlImage => {
                    this.urlDish = urlImage;
                    console.log(this.urlDish);
                    this.preDish['imageDishe'] = this.urlDish
                    this.chargeDishes.putDishe(realId, this.editDish).subscribe(res => {
                      this.spinner.hide();

                      Swal.fire({
                        title: 'Guardado',
                        text: "!Tu plato ha sido actualizado!",
                        icon: 'success',
                        confirmButtonColor: '#542b81',
                        confirmButtonText: 'Ok!'
                      }).then((result) => {
                        if (result.value) {
                          this._router.navigate(rute);
                        }
                      })
                    })
                  })
                }
                )
              ).subscribe()
          }
        })

  }

  swallSavePromotion(promotionArray) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡De que deseas guardar los cambios!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        const id: Guid = Guid.create();
        const file = this.fileImagedish;
        const filePath = `assets/allies/promotions/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file)
        task.snapshotChanges()
          .pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe(urlImage => {
                this.urlDish = urlImage;
                console.log(this.urlDish);
                this.promotionArray['photo'] = this.urlDish
                this.promotionArray['idAllies'] = localStorage.getItem('idAlly')
                //console.log("Array FINAL: ", this.promotionArray);
                this.promotionService.postPromotion(this.promotionArray).subscribe((message: any) => {
                  this.editDish.idPromotion.push(message._id)
                  this.chargeDishes.putDishe(this.editDish.id, this.editDish).subscribe(res => {
                    this.spinner.hide()
                    Swal.fire({
                      title: 'Guardado',
                      text: "¡Tu nuevo plato con promoción ha sido creado!",
                      icon: 'success',
                      confirmButtonColor: '#542b81',
                      confirmButtonText: 'Ok!'
                    }).then((result) => {
                      if (result.value) {
                        this._router.navigate(['/main', 'promoManager']);
                      }
                    })
                  })
                })
              })
            }
            )
          ).subscribe()
      }
    })
  }

}


