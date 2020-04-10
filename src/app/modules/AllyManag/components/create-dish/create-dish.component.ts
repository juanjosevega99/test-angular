import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.scss']
})
export class CreateDishComponent implements OnInit {

  //Object to save the dates of the form
  preDish: Object = {
    idDishesCategories: null,
    state: [],
    /* creationDate: null,
    modificationDate: null, */
    numberOfModifications: 0,
    nameDishesCategories: null,
    reference: null,
    name: null,
    price: null,
    imageDishe: null,
    description: null,
    preparationTime: [],
    idAccompaniments: [],
    idPromotion: null
  }

  editDish: Dishes = {
    idDishesCategories: null,
    nameDishesCategories: null,
    reference: null,
    name: null,
    creationDate: null,
    modificationDate: null,
    numberOfModifications: null,
    state: [],
    price: null,
    imageDishe: null,
    description: null,
    preparationTime: null,
    idAccompaniments: [],
    idPromotion: null
  }

  promotionArray: Object = {
    state: [],
    idname: null,
    name: null,
    promotionStartDate: [],
    endDatePromotion: [],
    price: null,
    photo: null,
    description: null,
    preparationTime: []
  }

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
  /* Categories: String[] = []; */
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
  promotion: boolean;
  meridian = true;
  promotionsCategories: any[] = [];
  idPromotion: string;
  /* proof : any[] = [] */


  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private chargeDishes: DishesService, private dishes: DishesService, private storage: AngularFireStorage, private dishCategory: DishesCategoriesService, private promotionCategory: PromotionsCategoriesService, private promotionService: PromotionsService) {

    //flags
    this.loading = true;
    this.buttonPut = true;
    this.seeNewPhoto = false;
    this.promotion = false;

    this.State = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]

    /* this.proof = [{"year":2020,"month":4,"day":13}]
    this.promotionArray['promotionStartDate']=this.proof */

    this.preDish['state'] = this.State;
    this.promotionArray['state'] = this.State;
    this.time = ['segundos', 'minutos', 'horas']

    //inicialization for charging the data of a dish to edit
    this.activatedRoute.params.subscribe(params => {
      let identificator = params['id']
      if (identificator >= 0) {
        this.getDish(identificator)
      } else if (identificator == -1) {
        this.loading = false
        this.buttonPut = false
      } else if (identificator == -2) {
        this.loading = false
        this.buttonPut = false
        this.promotion = true
      }
      this.identificatorbyRoot = identificator
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
    setInterval(() => this.tick(), 1000);
  }

  goBackEditMenu() {
    this._router.navigate(['/main', 'editmenu', this.identificatorbyRoot])
  }
  routeAccompaniments() {
    this._router.navigate(['/main', 'accompaniments', this.identificatorbyRoot])
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
    if (name != null) {
      let newitem = name;
      let newCategory: object = {
        name: newitem
      }
      this.swallSaveOtherPromo(newCategory)

      this.handleBoxCategories()
    } else { alert("Ingrese el nombre de la nueva categoría") }
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
    this.loading;
    this.chargeDishes.getDishes().subscribe(dishes => {
      let dish: Dishes = {}
      dish = dishes[id]
      this.editDish = dish;
      this.preDish = this.editDish;
      this.loading = false;
    })
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
    } else { alert("Ingrese el nombre de la nueva categoría") }
  }

  deleteCategory() {
    let categorySelected = this.preDish['nameDishesCategories']
    this.swallDeleteDish(categorySelected)
  }

  //Method for photo of the dish
  onPhotoSelected($event) {
    let input = $event.target;
    if (input.files && input.files[0]) {
      this.seeNewPhoto = true;
      console.log(this.seeNewPhoto);
      var reader = new FileReader();
      reader.onload = function (e: any) {
        $('#photo')
          .attr('src', e.target.result)
      };
      reader.readAsDataURL(input.files[0]);

    }
    console.log(this.fileImagedish);
    return this.fileImagedish = input.files[0]
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
      title: 'Estás seguro?',
      text: "de que deseas colocar este estado a la promoción!",
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
      title: 'Estás seguro?',
      text: "de que deseas colocar este estado al plato!",
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
    else {
      this.today = new Date();
      this.newDate = this.editDish['creationDate']
      const d = new Date(this.newDate);
      this.timesEntry = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateEntry = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
      this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });

    }
  }

  //CRUD PROMOTION

  //save a promotion
  savePromotion() {
    this.swallSavePromotion(this.promotionArray)
  }
  //delete a promotion
  deletePromo() {

  }

  //CRUD DISH
  //save new dish
  saveDish(shape: NgForm) {
    this.swallSaveDish(this.preDish)
  }

  //delete the dish
  deleteDish() {
    if (this.identificatorbyRoot == -1 || this.identificatorbyRoot == -2) {
      Swal.fire('No puedes eliminar este plato ya que no ha sido creado!!')
    } else {
      this.chargeDishes.getDishes().subscribe(dishes => {
        let dish: DishList = {}
        dish = dishes[this.identificatorbyRoot]
        let realId = dish.id
        this.swallDelete(realId)
      })
    }
  }

  //put the dish
  putDish() {
    this.chargeDishes.getDishes().subscribe(dishes => {
      let dish: Dishes = {};
      dish = dishes[this.identificatorbyRoot];
      let realId = dish.id;
      this.editDish.state = this.preDish['state'];
      this.editDish.creationDate = dish.creationDate;
      this.editDish.modificationDate = this.today;
      this.editDish.idAccompaniments = dish.idAccompaniments;
      this.editDish.idPromotion = dish.idPromotion;
      this.editDish.nameDishesCategories = this.preDish['nameDishesCategories'];
      this.editDish.idDishesCategories = this.preDish['idDishesCategories'];
      this.editDish.reference = this.preDish['reference'];
      this.editDish.name = this.preDish['name'];
      this.editDish.price = this.preDish['price'];
      this.editDish.description = this.preDish['description'];
      this.editDish.preparationTime = this.preDish['preparationTime'];
      this.swallUpdate(realId)
    })
  }

  //sweet alerts
  swallSaveOtherPromo(newCategory: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar esta nueva categoría!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.promotionCategory.postPromotionCategory(newCategory).subscribe(() => {
          this.promotionCategory.getPromotionCategory().subscribe(promC => {
            this.promotionsCategories = promC;
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nueva categoría de promoción ha sido creada',
          'success',
        )
      }
    })
  }

  swallDeleteCatPromo(categorySelected: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar esta categoría!",
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
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }

  swallSaveOtherDish(newCategory: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar esta nueva categoría!",
      icon: 'warning',
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
        Swal.fire(
          'Guardado!',
          'Tu nueva categoría de plato ha sido creada',
          'success',
        )
      }
    })
  }

  swallDeleteDish(categorySelected: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar esta categoría!",
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
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }

  swallSaveDish(newHeadquarter: any) {
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
        console.log("Array FINAL: ", this.preDish);
        const id: Guid = Guid.create();
        const file = this.fileImagedish;
        const filePath = `assets/allies/menu/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file)
        task.snapshotChanges()
          .pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe(urlImage => {
                this.urlDish = urlImage;
                console.log(this.urlDish);
                this.preDish['imageDishe'] = this.urlDish
                this.dishes.postDishe(this.preDish).subscribe(message => { })
              })
            }
            )
          ).subscribe()
        Swal.fire({
          title: 'Guardado',
          text: "Tu nuevo plato ha sido creado!",
          icon: 'warning',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/main', 'editmenu', this.identificatorbyRoot]);
          }
        })
      }
    })
  }

  swallDelete(realId) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este plato!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.chargeDishes.deleteDishe(realId).subscribe()
        Swal.fire(
          'Eliminado!',
          'success',
        )
        this._router.navigate(['/main', 'editmenu', this.identificatorbyRoot]);
      }
    })
  }

  swallUpdate(realId) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then(async (result) => {
      if (result.value) {
        console.log("Array FINAL: ", this.editDish);
        this.chargeDishes.getDishes().subscribe(dishes => {
          let dish: Dishes = {};
          dish = dishes[this.identificatorbyRoot];
          this.editDish.numberOfModifications = this.editDish['numberOfModifications'] + 1;
          if (this.seeNewPhoto == false) {
            this.editDish.imageDishe = dish.imageDishe;
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
                    this.chargeDishes.putDishe(realId, this.editDish).subscribe()
                  })
                }
                )
              ).subscribe()
          }
          this.chargeDishes.putDishe(realId, this.editDish).subscribe(res => {

            Swal.fire({
              title: 'Guardado',
              text: "Tu plato ha sido actualizado!",
              icon: 'warning',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            }).then((result) => {
              if (result.value) {
                this._router.navigate(['/main', 'editmenu',this.identificatorbyRoot]);
              }
            })
            
          })
        })
      }
    })
  }

  swallSavePromotion(promotionArray) {
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
        console.log("Array FINAL: ", this.promotionArray);
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
                this.promotionService.postPromotion(this.promotionArray).subscribe((message: any) => {
                  this.editDish.idPromotion = message._id;
                  this.chargeDishes.putDishe(this.editDish.id, this.editDish).subscribe(res => {
                    Swal.fire({
                      title: 'Guardado',
                      text: "Tu nuevo plato con promoción ha sido creado!",
                      icon: 'warning',
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


