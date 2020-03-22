import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DishesService } from 'src/app/services/dishes.service';
import { DishesCategoriesService } from "src/app/services/dishes-categories.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.scss']
})
export class CreateDishComponent implements OnInit {

  //Object to save the dates of the form
  preDish: Object = {
    idMealsCategories: null,
    state: null,
    /* creationDate: null,
    modificationDate: null, */
    numberOfModifications: 0,
    nameMealsCategories: null,
    reference: null,
    name: null,
    price: null,
    imageDishe: null,
    description: null,
    preparationTime: [],
    idAccompaniments: [],
    idPromotion: null
  }

  //variables for tick
  date: string;
  times: string;
  today: Date;

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

  constructor(private _router: Router, private dishes: DishesService, private storage: AngularFireStorage, private dishCategory: DishesCategoriesService) {
    /*  this.Categories = ["Boxes", "Combos", "Postes"] */
    this.State = [{ name: 'Activo', selected: true }, { name: 'Inactivo', selected: false }, { name: 'Eliminar', selected: false }]
    this.time = ['segundos', 'minutos', 'horas']

    //inicialization service with collections dishes-categories
    this.dishCategory.getDishCategory().subscribe(dishesCat => {
      this.dishesCategories = dishesCat;
    })
  }

  ngOnInit() {
    setInterval(() => this.tick(), 1000);
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
    let newitem = name;
    let newCategory: object = {
      name: newitem
    }
    this.swallSaveOtherDish(newCategory)

    this.handleBoxCategories()
  }
  
  deleteCategory() {
    let categorySelected = this.preDish['nameMealsCategories']
    this.swallDeleteDish(categorySelected)
  }

  //Method for photo of the dish
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

    return this.fileImagedish = input.files[0]
  }

  //Method for selecting the state
  selectedState(event) {
    const value = event.target.value;
    event.target.value = value;
    this.preDish['state'] = value
  }

  //Method for the admission date
  tick(): void {
    this.today = new Date();
    this.times = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    this.date = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    /* this.preDish['creationDate'] = this.date.concat("-",this.times) */
  }

  //save new dish
  saveDish(shape: NgForm) {
    this.swallSaveDish(this.preDish)
  }

  //sweet alerts
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        console.log("Array FINAL: ", this.preDish);
        
        const id = Math.random().toString(36).substring(2);
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
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/main', 'editmenu']);
          }
        })
      }
    })

  }

}


