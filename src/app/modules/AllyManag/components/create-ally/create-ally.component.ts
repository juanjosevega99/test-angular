import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
//services
import { AlliesCategoriesService } from '../../../../services/allies-categories.service';
import { MealsCategoriesService } from "../../../../services/meals-categories.service";
import { AttentionScheduleService } from "../../../../services/attention-schedule.service"
import { AlliesService } from "../../../../services/allies.service";
import { UploadImagesService } from "../../../../services/providers/uploadImages.service";
import Swal from 'sweetalert2';
//other libraris
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ally',
  templateUrl: './create-ally.component.html',
  styleUrls: ['./create-ally.component.scss']
})
export class CreateAllyComponent implements OnInit {
  // object ally
  forma: FormGroup;
  // Variables for list data from backend collection parameterized
  alliesCategories: any[] = [];
  mealsCategories: any[] = [];
  attentionSchedule: any[] = [];
  //variables of attentin Schedule
  days: string[] = []
  hours: String[] = [];
  Schedules: any[] = [];
  idSchedule: string;
  color: String = "#000000";
  //Variables of upload Logo to firebase
  urlLogo: any;
  fileImgLogo: any;
  //Variables of upload ImagesAlly to firebase
  imagesAlly: any = []
  //variables carousel
  imagesUploaded: any = [];
  imageObject: any;
  imageSize: any
  contImage: number = this.imagesUploaded.length;
  //handle button other category
  otherMealSelect: boolean = true
  otherMealInput: boolean = false
  //handle button other type Establishment
  otherEstablishmentSelect: boolean = true
  otherEstablishmentInput: boolean = false
  constructor(
    private alliesCatServices: AlliesCategoriesService,
    private mealsCatServices: MealsCategoriesService,
    private scheduleServices: AttentionScheduleService,
    private allieService: AlliesService,
    private _uploadImages: UploadImagesService,
    private _router: Router){

    this.forma = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(2),
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
      'color': new FormControl(this.color),
      'idTypeOfEstablishment': new FormControl('', [Validators.required]),
      'nameTypeOfEstablishment': new FormControl(''),
      'NumberOfLocations': new FormControl('', [Validators.required]),
      'idMealsCategories': new FormControl('', [Validators.required]),
      'nameMealsCategories': new FormControl(''),
      'typeAlly': new FormControl('', [Validators.required]),
      'IntermediationPercentage': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.maxLength(20)]),
      'idAttentionSchedule': new FormControl('', [Validators.required,]),
      'imagesAllies': new FormControl('')

    })

    this.imageSize = { width: 230, height: 120 }; //to do 
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
  //Method for adding logo
  onPhotoSelected($event): any {
    let input = $event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    if (!allowedExtensions.exec(filePath)) {
      alert('Por favor solo subir archivos que tengan como extensión .jpeg/.jpg/.png/.gif');
      input.value = '';
      return false;
    } else {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e: any) {
          $('#photo')
            .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    return this.fileImgLogo = input.files[0];
  }
  //Method for carousel images
  onImagesSelected($event) {
    let input = $event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    let image = "";
    if (!allowedExtensions.exec(filePath)) {
      alert('Por favor solo subir archivos que tengan como extensión .jpeg/.jpg/.png/.gif');
      input.value = '';
      return false;
    } else {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e: any) => {
          image = e.target.result;
          this.imagesUploaded.push({ image: image, thumbImage: image })
        }
        reader.readAsDataURL(input.files[0]);
        this.imagesAlly.push(input.files[0])
        console.log('Array images', this.imagesAlly)
      }

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
        console.log('File of IMAGE NEED', this.fileImgLogo) //delete console.log
        //read promise of upladImages 
        const promesasImages = this.imagesAlly.map(fileImage => {
          return this._uploadImages.uploadImages(fileImage, 'ImagesEstablishment')
        });
        Promise
          .all(promesasImages)
          .then(urlImageAlly => {
            console.log(urlImageAlly)
            this.forma.controls['imagesAllies'].setValue(urlImageAlly)
            return  this._uploadImages.uploadImages(this.fileImgLogo, 'logos')
          })
          .then(urlImage => {
            this.urlLogo = urlImage;
            this.forma.controls['logo'].setValue(this.urlLogo)
            // put the values of properties establishment
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
            this.scheduleServices.postAttentionSchedule(addSchedule).subscribe((schedule: any) => {
              this.idSchedule = schedule._id;
              console.log('LAST ONE', this.idSchedule);//delete consle.log
              this.forma.controls['idAttentionSchedule'].setValue(this.idSchedule)
              console.log(this.forma.value); // delete console.log
              //upload all fields to ally  collection 
              let objAllie = this.forma.value
              console.log(objAllie); //delete console.log
              this.allieService.postAllie(objAllie).subscribe()
              this._router.navigate(['/main', 'allyManager'])
            })
          })
          .catch(error => console.log('error al subir las imagenes a fireBase: ', error));
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
        this._router.navigate(['/main', 'allyManager'])

      }
    })
  }
}
