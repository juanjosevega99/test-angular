import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
//services
import { AlliesCategoriesService } from '../../../../services/allies-categories.service';
import { MealsCategoriesService } from "../../../../services/meals-categories.service";
import { AttentionScheduleService } from "../../../../services/attention-schedule.service"
import { AlliesService } from "../../../../services/allies.service";
import { UploadImagesService } from "../../../../services/providers/uploadImages.service";
import Swal from 'sweetalert2';
import { SaveLocalStorageService } from "../../../../services/save-local-storage.service";
//other libraris
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';

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
  days: any[] = []
  hours: String[] = [];
  Schedules: any[] = [];
  idSchedule: string;

  //variable for color
  color: String = "#000000";

  //Variables of upload Logo to firebase
  urlLogo: any;
  fileImgLogo: any;
  //Variables of upload ImagesAlly to firebase
  imagesAlly: any = []

  //variables carousel of images Establisment
  imagesUploaded: any = [];
  imageObject: any;
  imageSize: any;
  contImage: number = 0;

  //handle button other category Meal
  otherMealSelect: boolean = true
  otherMealInput: boolean = false
  //handle button other type Establishment
  otherEstablishmentSelect: boolean = true
  otherEstablishmentInput: boolean = false

  //variable for the loading
  loading: boolean;

  //variables for receiving the ally that will be edited
  identificatorbyRoot: string;
  idParams: number;
  buttonPut: boolean;
  seeNewPhoto: boolean;
  seeNewImagesAlly: boolean;

  constructor(
    private alliesCatServices: AlliesCategoriesService,
    private mealsCatServices: MealsCategoriesService,
    private scheduleServices: AttentionScheduleService,
    private allieService: AlliesService,
    private _uploadImages: UploadImagesService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _saveLocalStorageService: SaveLocalStorageService) {

    // this.loading = true;

    //flags
    this.loading = true;
    this.buttonPut = true;
    this.seeNewPhoto = false;
    this.seeNewImagesAlly = false;

    //inicialization for charging the data of an Ally to edit
    this._activateRoute.params.subscribe(params => {
      let idAlly = this._saveLocalStorageService.getLocalStorageIdAlly();
      let identificator = params['id']
      if (identificator != -1) {
        this.getAlly(idAlly)
      } else {
        // this.loading = false
        this.buttonPut = false
      }
      this.idParams = identificator;
      this.identificatorbyRoot = idAlly;

    })

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
      'NumberOfLocations': new FormControl('', [Validators.required,
      Validators.pattern("[0123456789,.'--]{1,5}")
      ]),
      'idMealsCategories': new FormControl('', [Validators.required]),
      'nameMealsCategories': new FormControl(''),
      'typeAlly': new FormControl('', [Validators.required]),
      'intermediationPercentage': new FormControl('', [Validators.required,
      Validators.pattern("[0123456789,.'--]{1,3}")
      ]),
      'description': new FormControl('', [Validators.maxLength(20)]),
      'idAttentionSchedule': new FormControl('', [Validators.required,]),
      'imagesAllies': new FormControl('')

    })

    this.imageSize = { width: 230, height: 120 }; //to do 
    this.hours = ["08:00 am", "09:00 am", "10:00 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm", "05:00 pm",
      "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm", "10:00 pm", "11:00 pm", "12:00 am"]
    this.days = [
      { name: 'Lunes', hoursFrom: this.hours, hoursTo: this.hours, from: '', to: '' },
      { name: 'Martes', hoursFrom: this.hours, hoursTo: this.hours, from: '', to: '' },
      { name: 'Miércoles', hoursFrom: this.hours, hoursTo: this.hours, from: '', to: '' },
      { name: 'Jueves', hoursFrom: this.hours, hoursTo: this.hours, from: '', to: '' },
      { name: 'Viernes', hoursFrom: this.hours, hoursTo: this.hours, from: '', to: '' },
      { name: 'Sábado', hoursFrom: this.hours, hoursTo: this.hours, from: '', to: '' },
      { name: 'Domingo', hoursFrom: this.hours, hoursTo: this.hours, from: '', to: '' }
    ]

    //inicialization service with collections allies-categories
    this.alliesCatServices.getAlliesCategories().subscribe(alliesCat => {
      this.alliesCategories = alliesCat;
      if (this.forma.controls['idTypeOfEstablishment'].value) {
        var cat = this.alliesCategories.find(element => element.id === this.forma.controls['idTypeOfEstablishment'].value)
        this.forma.controls['idTypeOfEstablishment'].setValue(cat);
      }
    })
    //inicialization service with collections meals-categorie
    this.mealsCatServices.getMealsCategories().subscribe(mealCat => {
      this.mealsCategories = mealCat;
      if (this.forma.controls['idMealsCategories'].value) {
        var cat = this.mealsCategories.find(element => element.id === this.forma.controls['idMealsCategories'].value)
        this.forma.controls['idMealsCategories'].setValue(cat);
      }
    })
    //inicialization service with collections attention-schedule
    this.scheduleServices.getAttentionSchedules().subscribe(schedule => {
      this.attentionSchedule = schedule;
    })

  }
  ngOnInit() {

  }
  //charge a ally with the id
  getAlly(id: string) {
    // this.loading;
    this.allieService.getAlliesById(id).subscribe(ally => {
      this.forma.setValue(ally)
      let idSchedule = this.forma.controls['idAttentionSchedule'].value
      this.scheduleServices.getAttentionSchedulesById(idSchedule).subscribe(schedule => {
        this.days.forEach(element => {
          var scheDb = schedule.attentionSchedule.find(e => e.day == element.name)
          element.from = scheDb.from
          element.to = scheDb.to
        });
      })
    })
  }
  getColour(event) {
    this.color = event.target.value
    this.forma.controls['color'].setValue(this.color)
  }
  //CRD -- METHODS OF TypeEstablishment: CREATE ,READ AND DELETE 
  addEstablishment() {
    let newitem = this.forma.controls['nameTypeOfEstablishment'].value;
    let newEstablishment: object = {
      name: newitem
    }
    this.swallSaveOtherEstablishment(newEstablishment)
    this.forma.controls['nameTypeOfEstablishment'].reset() // reset input add new category establishment
    this.changeStateToSelect();

  }
  //method delete Type Establishment
  deleteCategory() {
    let idCategory: any = this.forma.controls['idTypeOfEstablishment'].value.id
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
        this.seeNewPhoto = true;
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
        this.seeNewImagesAlly = true;

        var reader = new FileReader();
        reader.onload = (e: any) => {
          image = e.target.result;
          this.imagesUploaded.push({ image: image, thumbImage: image })
        }

        reader.readAsDataURL(input.files[0]);
        this.imagesAlly.push(input.files[0])
        this.contImage = this.imagesUploaded.length + 1;
      }

    }

  }
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
            this.forma.controls['imagesAllies'].setValue(urlImageAlly)
            return this._uploadImages.uploadImages(this.fileImgLogo, 'logos')
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
            this.days.forEach(dayElem => {
              this.Schedules.push({
                day: dayElem.name,
                from: dayElem.from,
                to: dayElem.to
              })
            });
            //format of properties by collection AttentatinShedule
            let addSchedule: any = {
              attentionSchedule: this.Schedules
            }
            this.scheduleServices.postAttentionSchedule(addSchedule).subscribe((schedule: any) => {
              this.idSchedule = schedule._id;
              this.forma.controls['idAttentionSchedule'].setValue(this.idSchedule)
              console.log(this.forma.value); //delete console.log
              //upload all fields to ally  collection 
              let objAllie = this.forma.value
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
  uploadFielstoCollectionUpdate() {
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
    this.days.forEach(dayElem => {
      this.Schedules.push({
        day: dayElem.name,
        from: dayElem.from,
        to: dayElem.to
      })
    });

    //format of properties by collection AttentatinShedule
    let addSchedule: any = {
      attentionSchedule: this.Schedules
    }
    addSchedule._id = this.forma.controls['idAttentionSchedule'].value;
    this.scheduleServices.putAttentionSchedule(addSchedule).subscribe(() => alert('shedule updated'))
    let objAllie = this.forma.value
    objAllie._id = this.identificatorbyRoot
    this.allieService.putAllie(objAllie).subscribe(() => alert('ally update'))
    this._router.navigate(['/main', 'allyManager'])
  }
  swallPutAllie() {
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
        //read promise of upladImages
        if (this.seeNewPhoto == false && this.seeNewImagesAlly == false) {
          this.uploadFielstoCollectionUpdate()

        } else if (this.seeNewPhoto == true && this.seeNewImagesAlly == true) {
          const promesasImages = this.imagesAlly.map(fileImage => {
            return this._uploadImages.uploadImages(fileImage, 'ImagesEstablishment')
          });
          Promise
            .all(promesasImages)
            .then(urlImageAlly => {
              this.forma.controls['imagesAllies'].setValue(urlImageAlly)
              return this._uploadImages.uploadImages(this.fileImgLogo, 'logos')
            })
            .then(urlImage => {
              this.urlLogo = urlImage;
              this.forma.controls['logo'].setValue(this.urlLogo)
              this.uploadFielstoCollectionUpdate()
            })
            .catch(error => console.log('error al subir las imagenes a fireBase: ', error));
        } else if (this.seeNewPhoto == true && this.seeNewImagesAlly == false) {
          this._uploadImages.uploadImages(this.fileImgLogo, 'logos')
            .then(urlImage => {
              this.urlLogo = urlImage;
              this.forma.controls['logo'].setValue(this.urlLogo)
              this.uploadFielstoCollectionUpdate()
            })
            .catch(error => console.log('error al subir las imagenes a fireBase: ', error));
        } else if (this.seeNewPhoto == false && this.seeNewImagesAlly == true) {
          const promesasImages = this.imagesAlly.map(fileImage => {
            return this._uploadImages.uploadImages(fileImage, 'ImagesEstablishment')
          });
          Promise
            .all(promesasImages)
            .then(urlImageAlly => {
              this.forma.controls['imagesAllies'].setValue(urlImageAlly)
              this.uploadFielstoCollectionUpdate()
            })
        }
        Swal.fire(
          'Guardado!',
          'Tu nuevo aliado ha sido Actualizado',
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
  swallLeave() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "que deseas salir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, salir!'
    }).then((result) => {
      if (result.value) {
        if (this.idParams != -1) {
          this._router.navigate(['/main', 'headquarts', this.idParams])
        } else {
          this._router.navigate(['/main', 'allyManager'])
        }
      }
    })
  }
}
