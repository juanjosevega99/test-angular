import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import Swal from 'sweetalert2';
//Models of backend
//services
import { AlliesCategoriesService } from '../../../../services/allies-categories.service';
import { MealsCategoriesService } from "../../../../services/meals-categories.service";
import { SwallServicesService } from "../../../../services/swall-services.service";
import { AttentionScheduleService } from "../../../../services/attention-schedule.service"
import { AlliesService } from "../../../../services/allies.service";
import { LoadImagesService } from "../../../../services/providers/load-images.service"
//models
import { FileItem } from 'src/app/models/loadImages_Firebase/file-item';

@Component({
  selector: 'app-create-ally',
  templateUrl: './create-ally.component.html',
  styleUrls: ['./create-ally.component.scss']
})
export class CreateAllyComponent implements OnInit {
  //news params
  forma: FormGroup;

  // allies: object = {
  //   name: null,
  //   nit: null,
  //   legalRepresentative: null,
  //   documentNumber: null,
  //   logo: null,
  //   colour: null,
  //   idTypeOfEstablishment: null,
  //   NumberOfLocations: null,
  //   idMealsCategories: null,
  //   description: null,
  //   idAttentionSchedule: [
  //     {
  //       day: null,
  //       from: null,
  //       to: null
  //     }
  //   ],// array of obj 
  //   imagesAllies: [],

  // }
  // varibles for list data from backend collection parameterized
  alliesCategories: any[] = [];
  mealsCategories: any[] = [];
  attentionSchedule: any[] = [];

  days: string[] = []
  hours: String[] = [];
  color: String = "#000000";
  Schedules: any[] = [];

  //variables carousel
  imagesAllies: FileItem[] = []
  imagesUploaded: any = [];
  imageObject: any;
  imageSize: any
  contImage: number = 0;

  // old params
  // aliado: Aliado; // instance necesary to working method onImagesSelected
  TypeEstablishment: String[] = [];
  Categoria: String[] = [];
  photo: any;
  //handle button other category
  otherMealSelect: boolean = true
  otherMealInput: boolean = false
  //handle button other type Establishment
  otherEstablishmentSelect: boolean = true
  otherEstablishmentInput: boolean = false
  newEstablishment: string
  constructor(private alliesCatServices: AlliesCategoriesService,
    private swalService: SwallServicesService,
    private mealsCatServices: MealsCategoriesService,
    private scheduleServices: AttentionScheduleService,
    private allieService: AlliesService,
    private loadImagesService: LoadImagesService) {
    this.forma = new FormGroup({

      'name': new FormControl('', Validators.required),
      'nit': new FormControl('', Validators.required),
      'legalRepresentative': new FormControl('', Validators.required),
      'documentNumber': new FormControl('', Validators.required),
      'logo': new FormControl('', Validators.required),
      'color': new FormControl('', Validators.required),
      'idTypeOfEstablishment': new FormControl('', Validators.required),
      'nameTypeOfEstablishment': new FormControl(''),
      'NumberOfLocations': new FormControl('', Validators.required),
      'idMealsCategories': new FormControl('', Validators.required),
      'nameMealsCategories': new FormControl(''),
      'description': new FormControl('', [Validators.required, Validators.maxLength(15)]),
      'idAttentionSchedule': new FormControl('', Validators.required),
      'imagesAllies': new FormControl('')

    })

    // this.schedules = new FormGroup({
    //   "dayLunes": new FormControl('',),
    //   "fromLunes": new FormControl('',Validators.required),
    //   "to": new FormControl('',Validators.required),

    // })

    this.imageSize = { width: 230, height: 120 };
    // this.imagesAllies = [];
    this.days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    this.hours = ["10:00 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm", "05:00 pm",
      "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm", "10:00 pm", "11:00 pm", "12:00 am"]

    //inicialization service with collections allies-categories
    this.alliesCatServices.getAlliesCategories().subscribe(alliesCat => {
      this.alliesCategories = alliesCat;
      console.log(this.alliesCategories) //delete console log
    })
    //inicialization service with collections meals-categorie
    this.mealsCatServices.getMealsCategories().subscribe(mealCat => {
      this.mealsCategories = mealCat;
      console.log(this.mealsCategories);
    })
    //inicialization service with collections attention-schedule
    this.scheduleServices.getAttentionSchedules().subscribe(schedule => {
      this.attentionSchedule = schedule;
      console.log(this.attentionSchedule);

    })

  }

  ngOnInit() {

  }
  getColour(event) {
    this.color = event.target.value
    this.forma.controls['color'].setValue(this.color)
    console.log(this.color) // delete console log
  }
  //CRD -- METHODS OF TypeEstablishment: CREATE ,READ AND DELETE 
  addEstablishment() {
    let newitem = this.forma.controls['nameTypeOfEstablishment'].value;
    let newEstablishment: object = {
      name: newitem
    }
    this.swallSaveOtherEstablishment(newEstablishment)
    console.log(this.alliesCategories) // delete console log
    this.forma.controls['nameTypeOfEstablishment'].reset() // reset input add new category establishment
    this.changeStateToSelect();
  }
  //method delete Type Establishment
  deleteCategory() {
    let idCategory: any = this.forma.controls['idTypeOfEstablishment'].value
    console.log(idCategory) // delete console log
    this.swallDeleteCatEstablishment(idCategory)
  }
  //Method for chang of oring buttons
  changeStateToSelect() {
    this.otherEstablishmentSelect = true;
    this.otherEstablishmentInput = false;
  }
  //CRD -- METHODS OF MealCategory: CREATE ,READ AND DELETE 
  addMeal() {
    let newitem = this.forma.controls['nameMealsCategories'].value;
    let newMeal: object = {
      name: newitem
    }
    this.swallSaveMealCategory(newMeal)
    this.forma.controls['nameMealsCategories'].reset();
    this.changeStateToSelectMeal();

  }
  deleteMealCategory() {
    let idMealCat: any = this.forma.controls['idMealsCategories'].value
    console.log(idMealCat) // delete console log
    this.swallDeleteMealCategory(idMealCat)
  }
  changeStateToSelectMeal() {
    this.otherMealSelect = true;
    this.otherMealInput = false;
  }
  //Method for logo
  // print bs64 of image =>  e.target.result)
  onPhotoSelected($event) {
    let input = $event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        $('#photo')
          .attr('src', e.target.result)
      };
      console.log('data enter if ', input.files) //delete console.log
      console.log('data enter if ', input.files[0]) //delete console.log
      reader.readAsDataURL(input.files[0]);
    }
  }
  //Method for carousel images
  onImagesSelected($event) {
    let input = $event.target;
    console.log($event.target.files) //delete console.log
    let image = "";
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
      image = e.target.result;
      this.imagesUploaded.push({ image: image, thumbImage: image })
    }
      let fileList = input.files; //pas object
      console.log('object of each image', fileList) // array delete console
      // this.imagesAllies.push(input.files[0]) 
      console.log('imagnes loading', this.imagesAllies) // images upLoad in an Array with object delete console
      reader.readAsDataURL(input.files[0]);
      for (const propiedad in Object.getOwnPropertyNames(fileList)) {
        const temporalFile = fileList[propiedad];
        console.log(temporalFile)
        // if ( this.fileCanUpload(temporalFile) ){
          const newField = new FileItem(temporalFile)
          this.imagesAllies.push(newField)
        // }
      }
      console.log(this.imagesAllies); //

      //   this.contImage = this.imagesAllies.length;

      //   console.log('Vector de images',this.imagesAllies)
      //   this.forma.controls['imagesAllies'].setValue(this.imagesAllies)
    }
  }
  //DIRECTICVES OF VALIDATION LOADIMAGES
  fileCanUpload( file: File): boolean{
    if (this._fileAlreadyUpload(file.name) && this.isImage( file.type ) ) {
      return true;
    }else {
      return false;
    }

  }
  
  isImage(typeFile: string): boolean {
    return (typeFile === '' || typeFile == undefined) ? false : typeFile.startsWith('image')
  }

  _fileAlreadyUpload(nameFile:string): boolean{
    for ( const file of this.imagesAllies ){
      if (file.nameFile === nameFile) {
        console.log( 'El archivo '+ nameFile + ' ya esta agregado' );
        return true;        
      }
    }
    return false
  }

  // Method for adding text input and select
  handleBoxEstablishment(): boolean {
    if (this.otherEstablishmentSelect) {
      return this.otherEstablishmentSelect = false,
        this.otherEstablishmentInput = true

    } else {
      return this.otherEstablishmentSelect = true,
        this.otherEstablishmentInput = false
    }
  }
  handleBoxMeal(): boolean {
    if (this.otherMealSelect) {
      return this.otherMealSelect = false,
        this.otherMealInput = true

    } else {
      return this.otherMealSelect = true,
        this.otherMealInput = false
    }
  }
  // method save  and cancel all collection allies
  saveChanges() {
    this.swalService.saveChanges()
    let addSchedule: object = {
      attentionSchedule: this.Schedules
    }
    this.scheduleServices.postAttentionSchedule(addSchedule).subscribe(message => {
      alert('attention added')
      this.scheduleServices.getAttentionSchedules().subscribe(schedule => {
        this.attentionSchedule = schedule;
        console.log(this.attentionSchedule); // delete console log
      })
    })
    this.forma.controls['idAttentionSchedule'].setValue(this.attentionSchedule[0].id)
    console.log(this.forma.value);
    this.allieService.postAllie(this.forma.value).subscribe(message => {
      alert('allie added')
      // this.allieService.getAllies()
    })
    this.loadImagesService.loadImagesFirebase(this.imagesAllies)
  }
  cancelChanges() {
    this.swalService.cancel();
  }
  getAttentionSchedule(day: String, from: String, to: String, i: number) {
    // console.log(dayLunes);
    console.log(from); //delete console log
    console.log(to, i); //delete console log
    let schedule: object = {
      day: day,
      from: from,
      to: to
    }
    // To do one function for tracking array with filter and look what is the same and renplace-- 
    if (this.Schedules[i]) {
      this.Schedules[i] = schedule;
    }
    else {
      this.Schedules.push(schedule);
    }
    console.log(this.Schedules); //delete console log 
  }
  // method by sweetalert2 
  //saveTypeEstablishment 
  swallSaveOtherEstablishment(newEstablishment: any) {
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
        this.alliesCatServices.postAllieCategorie(newEstablishment).subscribe(() => {
          this.alliesCatServices.getAlliesCategories().subscribe(alliesCat => {
            this.alliesCategories = alliesCat;
            console.log(this.alliesCategories)
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nuevo tipo de establecimiento ha sido creado',
          'success',
        )
      }
    })
  }
  swallDeleteCatEstablishment(id: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.alliesCatServices.deleteAllieCategorie(id).subscribe(() => {
          this.alliesCatServices.getAlliesCategories().subscribe(alliesCat => {
            this.alliesCategories = alliesCat;
            console.log(this.alliesCategories)
          })
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }
  //save and Delete Meals categories 
  swallSaveMealCategory(newMeal: any) {
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
        this.mealsCatServices.postMealCategorie(newMeal).subscribe(() => {
          this.mealsCatServices.getMealsCategories().subscribe(mealCat => {
            this.mealsCategories = mealCat;
            console.log(this.mealsCategories)
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nueva categoría de comida ha sido creado',
          'success',
        )
      }
    })
  }
  swallDeleteMealCategory(id: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.mealsCatServices.deleteMealCategorie(id).subscribe(() => {
          this.mealsCatServices.getMealsCategories().subscribe(mealCat => {
            this.mealsCategories = mealCat;
            console.log(this.mealsCategories)
          })
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }


}
