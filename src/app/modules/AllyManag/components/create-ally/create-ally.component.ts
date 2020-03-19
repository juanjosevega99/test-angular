import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from "rxjs/operators";
import { Observable } from 'rxjs/internal/Observable';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
//Models of backend
//services
import { AlliesCategoriesService } from '../../../../services/allies-categories.service';
import { MealsCategoriesService } from "../../../../services/meals-categories.service";
import { AttentionScheduleService } from "../../../../services/attention-schedule.service"
import { AlliesService } from "../../../../services/allies.service";
// import { LoadImagesService } from "../../../../services/providers/load-images.service"
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
  // varibles for list data from backend collection parameterized
  alliesCategories: any[] = [];
  mealsCategories: any[] = [];
  attentionSchedule: any[] = [];
  allies : any[]= [];

  days: string[] = []
  hours: String[] = [];
  Schedules: any[] = [];
  color: String = "#000000";
  objectEstablishment: any;

  //varibles of upload Logo
  urlLogo: Observable<any>;
  fileImgLogo: any;

  //variables carousel
  imagesAllies: FileItem[] = []
  imagesUploaded: any = [];
  imageObject: any;
  imageSize: any
  contImage: number = 0;

  // old params
  // aliado: Aliado; // instance necesary to working method onImagesSelected
  // TypeEstablishment: String[] = [];
  // Categoria: String[] = [];
  // photo: any;

  //handle button other category
  otherMealSelect: boolean = true
  otherMealInput: boolean = false
  //handle button other type Establishment
  otherEstablishmentSelect: boolean = true
  otherEstablishmentInput: boolean = false
  // newEstablishment: string
  constructor(private alliesCatServices: AlliesCategoriesService,
    private mealsCatServices: MealsCategoriesService,
    private scheduleServices: AttentionScheduleService,
    private allieService: AlliesService,
    private storage: AngularFireStorage) {

    this.forma = new FormGroup({

      'name': new FormControl('', [Validators.required, Validators.minLength(2),
        // Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.0123456789'--()]{2,48}")
      ]),
      'nit': new FormControl('', [Validators.required,
      Validators.pattern("[0123456789,.'--]{8,20}")

      ]),
      'legalRepresentative': new FormControl('', [Validators.required,
      Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}")

      ]),
      'documentNumber': new FormControl('', [Validators.required,
      Validators.pattern("[0123456789,.'--]{8,20}")

      ]),
      'logo': new FormControl('', [Validators.required,
      ]),
      'color': new FormControl(this.color, [Validators.pattern("")

      ]),
      'idTypeOfEstablishment': new FormControl('', [Validators.required,

      ]),
      'nameTypeOfEstablishment': new FormControl(''),
      'NumberOfLocations': new FormControl('', [Validators.required]),
      'idMealsCategories': new FormControl('', [Validators.required,
      ]),
      'nameMealsCategories': new FormControl(''),
      'description': new FormControl('', [
        Validators.maxLength(20)

      ]),
      'idAttentionSchedule': new FormControl('', [Validators.required,
      ]),
      'imagesAllies': new FormControl('')

    })

    this.imageSize = { width: 230, height: 120 };
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
      console.log(this.mealsCategories);// delete console log
    })
    //inicialization service with collections attention-schedule
    this.scheduleServices.getAttentionSchedules().subscribe(schedule => {
      this.attentionSchedule = schedule;
      console.log(this.attentionSchedule);// delete console log
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
    let idCategory: any = this.forma.controls['idTypeOfEstablishment'].value.id
    console.log(idCategory) // delete console log
    this.swallDeleteCatEstablishment(idCategory)
  }
  //Method for change of oring buttons
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
  //method delete Type MealCategory
  deleteMealCategory() {
    let idMealCat: any = this.forma.controls['idMealsCategories'].value.id
    console.log(idMealCat) // delete console log
    this.swallDeleteMealCategory(idMealCat)
  }
  //Method for change of oring buttons
  changeStateToSelectMeal() {
    this.otherMealSelect = true;
    this.otherMealInput = false;
  }
  //Method for logo
  // print bs64 of image =>  e.target.result)
  onPhotoSelected($event): any {
    let input = $event.target;
    // console.log(input.files);

    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        $('#photo')
          .attr('src', e.target.result)
      };
      reader.readAsDataURL(input.files[0]);
    }
    return this.fileImgLogo = input.files[0];
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
  // //DIRECTICVES OF VALIDATION LOADIMAGES
  // fileCanUpload(file: File): boolean {
  //   if (this._fileAlreadyUpload(file.name) && this.isImage(file.type)) {
  //     return true;
  //   } else {
  //     return false;
  //   }

  // }

  // isImage(typeFile: string): boolean {
  //   return (typeFile === '' || typeFile == undefined) ? false : typeFile.startsWith('image')
  // }

  // _fileAlreadyUpload(nameFile: string): boolean {
  //   for (const file of this.imagesAllies) {
  //     if (file.nameFile === nameFile) {
  //       console.log('El archivo ' + nameFile + ' ya esta agregado');
  //       return true;
  //     }
  //   }
  //   return false
  // }

  // Method for change botton of de CRD in typeEstablihment and MelaCategoryes
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
    this.swallSaveAllie()

  }

  cancelChanges() {
    this.swallCancelAlly()
  }

  getAttentionSchedule(day: String, from: String, to: String, i: number) {
    console.log(from); //delete console log
    console.log(to, i); //delete console log
    let schedule: object = {
      day: day,
      from: from,
      to: to
    }
    // function to replace the values of array 
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
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
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
  // Modal for delete Establishmet
  swallDeleteCatEstablishment(id: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
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
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
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
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
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
  //save AND cancel allie 
  swallSaveAllie() {
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
        console.log('File of IMAGE NEED', this.fileImgLogo)
        // upload Image Logo
        const id = Math.random().toString(36).substring(2);
        const file = this.fileImgLogo;
        const filePath = `assets/allies/logos/${id}`
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file)
        task.snapshotChanges()
          .pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe(urlImage => {
                this.urlLogo = urlImage;
                console.log('URL IMAGE', this.urlLogo)
                // 
              })
            })
          ).subscribe();
        // put the values of properties establishment
        console.log(this.forma.controls['idTypeOfEstablishment'].value);
        console.log(this.forma.controls['idTypeOfEstablishment'].value.id);

        let idEstablishment: any = this.forma.controls['idTypeOfEstablishment'].value.id
        let nameEstablishment: any = this.forma.controls['idTypeOfEstablishment'].value.name

        this.forma.controls['idTypeOfEstablishment'].setValue(idEstablishment)
        this.forma.controls['nameTypeOfEstablishment'].setValue(nameEstablishment)
        // put the values of properties Meals categories
        let idMeal: any = this.forma.controls['idMealsCategories'].value.id
        let nameMeal: any = this.forma.controls['idMealsCategories'].value.name

        this.forma.controls['idMealsCategories'].setValue(idMeal)
        this.forma.controls['nameMealsCategories'].setValue(nameMeal)

        //format of properties by collection AttentatinShedule
        let addSchedule: object = {
          attentionSchedule: this.Schedules
        }
        this.scheduleServices.postAttentionSchedule(addSchedule).subscribe(() => {
          this.scheduleServices.getAttentionSchedules().subscribe(schedule => {
            this.attentionSchedule = schedule;
            console.log(this.attentionSchedule); // delete console log
          })
        })
        this.forma.controls['idAttentionSchedule'].setValue(this.attentionSchedule[0].id)  //to do
        console.log(this.forma.value); // delete console.log
        let objAllie = this.forma.value
        // console.log('valor of nameEStblishment ', this.forma.controls['nameTypeOfEstablishment'].value) //delete console.log
        console.log(objAllie);

        //agrgate urlLogo of propertie object 
        this.allieService.postAllie(objAllie).subscribe(()=> {
          this.allieService.getAllies().subscribe(allie=> {
            this.allies = allie;
            console.log(this.allies); // to do 
          })
        })

        Swal.fire(
          'Guardado!',
          'Tu nuevo aliado ha sido creado',
          'success',
        )
      }
    })
  }
  swallCancelAlly() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas cancelar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Cancelado!',
          'success',
        )
      }
    })
  }



}
