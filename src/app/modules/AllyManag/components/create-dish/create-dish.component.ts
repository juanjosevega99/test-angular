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
import { HeadquartersService } from "src/app/services/headquarters.service";
import { AlliesService } from "src/app/services/allies.service";
import { UsersService } from "src/app/services/users.service";

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
    imageDish: null,
    description: null,
    preparationTime: [],
    idAccompaniments: [],
    idPromotion: [],
    headquarterId: null
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
    imageDish: null,
    description: null,
    preparationTime: null,
    idAccompaniments: [],
    idPromotion: []
  }

  promotionArray: Object = {
    id: null,
    allyId: null,
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
    nameAllie: null,
    headquarterId:null,
    nameHeadquarter:null,
    flag: false,
  }

  tickFunction: any;

  //variables for receiving the profile that will be edited
  identificatorbyRoot: any;
  buttonPut: boolean;
  seeNewPhoto: boolean;
  seeNewPhotoTypePromotion: boolean;

  //variables for tick
  dateEntry: String;
  timesEntry: String;
  today: Date;

  newDate: Date;
  dateModication: String;
  timesModification: String;

  //variables for categories
  //flag for change button of CRUD
  arrayCategorySelect = true;
  otherCategoryInput = false;
  addcategoryButton = true;
  flagButtonTypePromotion = false;
  selectAgainarray = false;
  imgTypePromotion = false;
  buttonGuardarCat = false;
  buttonUpdateCat = false;

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
  fileImagePromCategory: any = []
  // Variables of alerts
  alertBadExtensionLogo = false;
  //flag by state swall
  upload: boolean = false;
  // Variables of alerts
  alertBadExtensionImagePromCategory = false
  //Vaviable for other typePromotion
  otherCat: string;

  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private chargeDishes: DishesService,
    private storage: AngularFireStorage,
    private dishCategory: DishesCategoriesService, private promotionCategory: PromotionsCategoriesService,
    private promotionService: PromotionsService, private saveLocalStorageService: SaveLocalStorageService,
    private spinner: NgxSpinnerService, private _location: Location,
    private couponsService: CouponsService,
    private _uploadImages: UploadImagesService,
    private headquartersService: HeadquartersService,
    private alliesService : AlliesService,
    private userService: UsersService){

    //flags
    this.loading = true;
    this.buttonPut = true;
    this.seeNewPhoto = false;
    this.seeNewPhotoTypePromotion = false;
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
      this.spinner.hide();
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
    this.headquartersService.getHeadquarterById(localStorage.getItem('headquarterId')).subscribe(headquarter => {
      // headquarter.for //hacer un servicio
      this.promotionArray['headquarterId'] = localStorage.getItem('headquarterId')
      this.promotionArray['nameHeadquarter'] = headquarter.name
    })
    this.alliesService.getAlliesById(localStorage.getItem('allyId')).subscribe(ally=>{
      this.promotionArray['nameAllie'] = ally.name
    })

  }

  ngOnDestroy() {
    clearTimeout(this.tickFunction);
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
  ifChanges(rute: string[]) {
    this.chargeDishes.getDisheById(this.editDish['id']).subscribe(dish => {

      if (this.editDish.state[0]['check'] === dish.state[0]['check'] && this.editDish.idDishesCategories === dish.idDishesCategories && this.editDish.reference === dish.reference
        && this.editDish.name === dish.name && this.editDish.price === dish.price && this.editDish.imageDish === dish.imageDish && this.editDish.description === dish.description
        && this.editDish.preparationTime[0] === dish.preparationTime[0] && this.editDish.preparationTime[1] === dish.preparationTime[1]) {

        this._router.navigate(rute)

      } else {

        Swal.fire({
          title: "Desea guardar los cambios",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Si',
          cancelButtonText: "No"

        }).then(res => {

          if (res.value) {
            this.updateDish(rute);
          } else {
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

  // Method for edit Type promotion
  editPromotion(idPromotionCat) {
    if (idPromotionCat) {
      this.promotionCategory.getPromotionCategoryById(this.promotionArray['idname']).subscribe(promCat => {
        this.otherCat = promCat.name
        this.promotionArray['imageTypePromotion'] = promCat.imageTypePromotion
        this.flagButtonTypePromotion = true;
        this.handleBoxCategories()
      })

    } else {
      Swal.fire({
        text: "¡Seleccione un tipo de promoción!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
      })
    }

  }

  //CRD -- Methos of TypePromo: CREATE ,READ AND DELETE 
  addCategoryPromo() {
    if (this.otherCat == '' || this.fileImagePromCategory.length == 0) {
      Swal.fire({
        text: "¡Ingrese  la imagen y el nombre del tipo de promoción!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
      })
    } else {
      this.swallSaveOtherPromo()

    }
  }
  UpdateCategoryPromo() {
    if (this.otherCat == '' || this.promotionArray['imageTypePromotion'] == '') {
      Swal.fire({
        text: "¡Ingrese  la imagen y el nombre del tipo de promoción!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
      })
    } else {
      this.swallUpdateOtherPromo()
    }
  }
  //Method for photo of the dish
  onPhotoSelectedImagesPromCategory($event) {
    let input = $event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif|.svg)$/i;
    let image = "";
    if (!allowedExtensions.exec(filePath)) {
      input.value = '';
      this.alertBadExtensionImagePromCategory = true;
      return this.fileImagePromCategory = '';
    } else {
      if (input.files && input.files[0]) {
        this.seeNewPhotoTypePromotion = true;
        this.alertBadExtensionImagePromCategory = false;

        var reader = new FileReader();
        reader.onload = function (e: any) {
          $('#photo')
            .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
      }
      return this.fileImagePromCategory = input.files[0];
    }
  }
  deleteCategoryPromo() {
    if (this.promotionArray['name']) {
      this.swallDeleteCatPromo(this.promotionArray['name'])
      
    }else{
      Swal.fire({
        text: "¡Seleccione un tipo de promoción",
        icon: 'warning',
        confirmButtonColor: '#542b81',
      })
    }
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
    this.chargeDishes.getDishesByIdHeadquarter(localStorage.getItem("headquarterId")).subscribe(dishes => {
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
    // this.otherCat = ''
    if (this.flagButtonTypePromotion) {
      this.flagButtonTypePromotion = false;
      // this.otherCat = ''
      return this.addcategoryButton = false,
        this.otherCategoryInput = true,
        this.selectAgainarray = true,
        this.buttonGuardarCat = false,
        this.buttonUpdateCat = true,
        this.imgTypePromotion = true,
        this.arrayCategorySelect = false
    }
    if (this.addcategoryButton) {
      this.otherCat = ''
      this.fileImagePromCategory = []
      return this.addcategoryButton = false,
        this.otherCategoryInput = true,
        this.selectAgainarray = true,
        this.buttonGuardarCat = true,
        this.imgTypePromotion = true,
        this.buttonUpdateCat = false,
        this.arrayCategorySelect = false
    } else {
      this.otherCat = ''
      this.fileImagePromCategory = []
      return this.addcategoryButton = true,
        this.otherCategoryInput = false,
        this.selectAgainarray = false,
        this.buttonGuardarCat = false,
        this.imgTypePromotion = false,
        this.buttonUpdateCat = false,
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
    if (this.fileImagedish) {
      this.swallSavePromotion(this.promotionArray);

    } else {
      Swal.fire({
        title: "Seleccione una imagen para la promoción",
        icon: "info",
        confirmButtonColor: "#542b81"
      })
    }
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
                const task = this.storage.upload(filePath, file)

                task.snapshotChanges()
                  .pipe(
                    finalize(() => {
                      ref.getDownloadURL().subscribe(urlImage => {
                        this.urlDish = urlImage;

                        this.promotionArray['photo'] = this.urlDish
                        this.promotionService.putPromotion(realId, this.promotionArray).subscribe(res => {
                          this.loading = false;
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
                task.catch(err => {
                  this.spinner.hide();
                  Swal.fire({
                    title: "Ocurrió un error al subir la imagen",
                    icon: "error",
                    confirmButtonColor: '#542b81'
                  })
                })
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
                this.loading = true;
                this.promotionService.deletePromotion(realId).subscribe(message => {
                  //delete promotion of dish
                  this.chargeDishes.getDishesByIdAlly(localStorage.getItem("allyId")).subscribe(res => {
                    res.forEach(dish => {
                      if (dish.idPromotion.length) {
                        for (let index = 0; index < dish.idPromotion.length; index++) {
                          if (realId == dish.idPromotion[index]) {
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
                  //delete promotion of user
                  this.userService.getUsers().subscribe(res => {
                    res.forEach(user => {
                      if (user.idsPromos.length) {
                        for (let index = 0; index < user.idsPromos.length; index++) {
                          if (realId == user.idsPromos[index]) {
                            user.idsPromos.splice(index, 1)
                            let newids: any = {
                              idsPromos: user.idsPromos
                            }
                            this.userService.putUsers(user.id, newids).subscribe(res => { 
                              Swal.fire({
                                text: `¡La promoción del usruario ${user.name} ha sido eliminada!`,
                                icon: 'success',
                                confirmButtonColor: '#542b81',
                                confirmButtonText: 'Ok!'
                              })
                             })
                          }
                        }
                      }
                    })
                  })
                  this.loading = false;
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
    if (this.fileImagedish) {

      this.swallSaveDish(this.preDish);

    } else {
      Swal.fire({
        title: "Seleccione una imagen para el plato",
        icon: "info",
        confirmButtonColor: '#542b81'
      })
    }
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
      this.chargeDishes.getDishesByIdHeadquarter(localStorage.getItem("headquarterId")).subscribe(dishes => {
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
  //CRUD FOR TYPE PROMOTIONS
  swallSaveOtherPromo() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "!Deseas guardar esta nueva categoría!",
      icon: 'question',
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
            let newCategory: object = {
              allyId: localStorage.getItem('allyId'),
              name: this.otherCat,
              imageTypePromotion: urlImage
            }
            this.promotionCategory.postPromotionCategory(newCategory).subscribe(() => {
              this.promotionCategory.getPromotionCategory().subscribe(promC => {
                this.handleBoxCategories()

                this.promotionsCategories = promC;
              })
              this.spinner.hide()
            }, err => {
              this.spinner.hide();
              Swal.fire({
                title: "Ocurrio un error al crear la promoción",
                icon: "error",
                confirmButtonColor: '#542b81'
              })
            })

            Swal.fire({
              title: 'Guardado!',
              text: "¡Tu nueva categoría de promoción ha sido creada!",
              icon: 'success',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            })

          }).catch(err => {
            this.spinner.hide();
            Swal.fire({
              title: "Ha ocurrido un error al subir la imagen",
              icon: "error",
              confirmButtonColor: '#542b81'
            })
          })
      }
    })
  }
  //method for update collection TypePromotion
  updateTypePromotion() {
    let objTypePromotion: any = {
      id: this.promotionArray['idname'],
      allyId: localStorage.getItem('allyId'),
      name: this.otherCat,
      imageTypePromotion: this.promotionArray['imageTypePromotion']
    }
    this.promotionCategory.putPromotionCategory(objTypePromotion).subscribe(() => {
      // this.spinner.hide()
      this.promotionCategory.getPromotionCategory().subscribe(promC => {
        this.handleBoxCategories()

        this.promotionsCategories = promC;
      })
      this.spinner.hide()
    }, err => {
      this.spinner.hide();
      Swal.fire({
        title: "Ocurrio un error al crear la promoción",
        icon: "error",
        confirmButtonColor: '#542b81'
      })
    })
  }
  // Update Type promotions
  swallUpdateOtherPromo() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "!Deseas guardar los cambios!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: '!Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        if (this.seeNewPhotoTypePromotion == false) {
          this.updateTypePromotion()
          Swal.fire({
            title: 'Guardado',
            text: "¡Tu tipo de promoción ha sido actualizada!",
            icon: 'success',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          })
        } else if (this.seeNewPhotoTypePromotion == true) {
          this._uploadImages.uploadImages(this.fileImagePromCategory, 'allies', 'typePromotion')
            .then(urlImage => {
              this.promotionArray['imageTypePromotion'] = urlImage
              this.updateTypePromotion()

              Swal.fire({
                title: 'Guardado!',
                text: "¡Tu nueva categoría de promoción ha sido actualizada!",
                icon: 'success',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              })

            }).catch(err => {
              this.spinner.hide();
              Swal.fire({
                title: "Ha ocurrido un error al subir la imagen",
                icon: "error",
                confirmButtonColor: '#542b81'
              })
            })

        }

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
        this.spinner.show()
        this.promotionCategory.getPromotionCategory().subscribe(promC => {
          this.promotionsCategories = promC;
          this.promotionsCategories.forEach((element: any, index) => {
            let promo: any = {
              id: element.id,
              name: element.name,
              image: element.imageTypePromotion
            }
            if (promo.name == categorySelected) {
               
                let urlImg = 'assets/allies/typePromotion/' + promo.image.split("%")[3].split("?")[0].slice(2);
                this._uploadImages.DeleteImage(urlImg).then(res=>{
                  this.promotionCategory.deletePromotionCategory(promo.id).subscribe(() => {
                    this.promotionCategory.getPromotionCategory().subscribe(promos => {
                      this.promotionsCategories = promos;
                    })
                    this.spinner.hide()
                    Swal.fire({
                      title: '¡Eliminado!',
                      icon: 'success',
                      confirmButtonColor: '#542b81',
                      confirmButtonText: 'Ok!'
                    })
                  })
  
                }).catch(error=> {
                  console.log("Se producio el siguiente error:" + error)
                  this.spinner.hide()
                })
              

            }
          });
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
            this.handleBoxCategories()

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
        this.preDish['allyId'] = localStorage.getItem('allyId');
        this.preDish['headquarterId'] = localStorage.getItem('headquarterId');
        const id: Guid = Guid.create();
        const file = this.fileImagedish;

        this._uploadImages.uploadImages(this.fileImagedish, 'allies', 'menu')
          .then(urlImage => {
            this.upload = true;
            this.preDish['imageDish'] = urlImage
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

        let urlImg = 'assets/allies/menu/' + this.preDish['imageDish'].split("%")[3].split("?")[0].slice(2);
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

        this.updateDish(['/main', 'editmenu', this.identificatorbyRoot])
      }
    })
  }

  async updateDish(rute: string[]) {
    this.spinner.show();

    await this.chargeDishes.getDishesByIdHeadquarter(localStorage.getItem("headquarterId")).subscribe(dishes => {

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

                this.preDish['imageDish'] = this.urlDish
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

                this.promotionArray['photo'] = this.urlDish
                this.promotionArray['allyId'] = localStorage.getItem('allyId') 
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


