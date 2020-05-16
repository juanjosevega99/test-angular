import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//services
import Swal from 'sweetalert2';
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { FrequentQuestionsService } from 'src/app/services/frequent-questions.service'

@Component({
  selector: 'app-create-frequent-questions',
  templateUrl: './create-frequent-questions.component.html',
  styleUrls: ['./create-frequent-questions.component.scss']
})
export class CreateFrequentQuestionsComponent implements OnInit, OnDestroy {

  preFrequentQuestions: Object = {
    typeFrequentQuestion: '',
    description: '',
    howPromworks: '',
    howUseProm: '',
    howFindPromo: '',
    howCouponWorks: '',
    howUseCoupon: '',
    howGetCoupon: '',
  }
   //variables for receiving the coupon that will be edited
   identificatorbyRoot: any;
   idParams: number;
   buttonPut: boolean;

  questions = ["¿Comó funciona una promoción?", "¿Cómo obtener cupones?",]
  //flags for show question:
    flagHowPromworks= false;
    flagHowUseProm= false;
    flagHowFindPromo= false;
    flagHowCouponWorks= false;
    flagHowUseCoupon= false;
    flagHowGetCoupon= false;

  constructor(
    private spinner: NgxSpinnerService,private _router: Router,
    private activatedRoute: ActivatedRoute,
    private saveLocalStorageService: SaveLocalStorageService,
    private frequentQuestionsService: FrequentQuestionsService,

  ) {
    //flags
    this.buttonPut = true;
    // obtain params for identification between create and edit
    this.activatedRoute.params.subscribe(params => {
      let IdFrequentQuestion = this.saveLocalStorageService.getLocalStorageIdFrequentQuestion();
      let identificator = params['id']
      if (identificator != -1) {
        this.getObjFrequentQuestion(IdFrequentQuestion)
      } else if (identificator == -1) {
        this.buttonPut = false
      }
      this.idParams = identificator
      this.identificatorbyRoot = IdFrequentQuestion
    })
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    localStorage.removeItem('idFrequentQuestion');
  }
  getObjFrequentQuestion(IdFrequentQuestion: string) {
    this.spinner.show()
    this.frequentQuestionsService.getFrequentQuestionsById(IdFrequentQuestion).subscribe(FrequentQuestions => {
      this.preFrequentQuestions = FrequentQuestions
      switch (this.preFrequentQuestions['typeFrequentQuestion']) {
        case '¿Comó funciona una promoción?':
            return this.flagHowPromworks= true,
            this.flagHowUseProm= true,
            this.flagHowFindPromo= true,
            this.flagHowCouponWorks= false,
            this.flagHowUseCoupon= false,
            this.flagHowGetCoupon= false,
            this.spinner.hide();
            
        case '¿Cómo obtener cupones?':
            return this.flagHowPromworks= false,
            this.flagHowUseProm= false,
            this.flagHowFindPromo= false,
            this.flagHowCouponWorks= true,
            this.flagHowUseCoupon= true,
            this.flagHowGetCoupon= true,
            this.spinner.hide();
  
        default:
          
          break;
      }
    })
  }

  goBack() {
    this._router.navigate(['/main', 'frequentQuestionsManag'])
  }
  seeNameFrequentQuestion(frequentQuestion){
    switch (frequentQuestion) {
      case '¿Comó funciona una promoción?':
          return this.flagHowPromworks= true,
          this.flagHowUseProm= true,
          this.flagHowFindPromo= true,
          this.flagHowCouponWorks= false,
          this.flagHowUseCoupon= false,
          this.flagHowGetCoupon= false
          
      case '¿Cómo obtener cupones?':
          return this.flagHowPromworks= false,
          this.flagHowUseProm= false,
          this.flagHowFindPromo= false,
          this.flagHowCouponWorks= true,
          this.flagHowUseCoupon= true,
          this.flagHowGetCoupon= true

      default:
        break;
    }
    
  }
    //save new Tyc
    saveFrequentQuestions() {
      this.swallSaveFrequentQuestions()
    }
    //swalls 
    swallSaveFrequentQuestions() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡De que deseas guardar los cambios!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#542b81',
        cancelButtonColor: '#542b81',
        confirmButtonText: '¡Si, guardar!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show()
          this.frequentQuestionsService.postFrequentQuestion(this.preFrequentQuestions).subscribe(()=> this.spinner.hide())
          Swal.fire({
            title: 'Guardado',
            text: "¡Tus preguntas frecuentes han sido creadas!",
            icon: 'success',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.value) {
              this._router.navigate(['/main', 'frequentQuestionsManag',]);
            }
          })
        }
      })
    }
  
    //swall for update collection tyc
    swallUpdateFrequentQuestions() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡De que deseas guardar los cambios!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#542b81',
        cancelButtonColor: '#542b81',
        confirmButtonText: '¡Si, guardar!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show()
          let objFrequentQuestion: any = this.preFrequentQuestions
          objFrequentQuestion.id = this.identificatorbyRoot
          this.frequentQuestionsService.putFrequentQuestion(objFrequentQuestion).subscribe(()=> {
            this.spinner.hide()
              Swal.fire({
                title: 'Actualizado',
                text: "¡Tus cambios han sido guardados!",
                icon: 'success',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              }).then((result) => {
                if (result.value) {
                  this._router.navigate(['/main', 'frequentQuestionsManag',]);
                }
              })
          })
  
        }
  
      })
  
    }

}
