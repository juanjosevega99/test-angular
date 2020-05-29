import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//models
import { FrequentQuestions } from "src/app/models/FrequentQuestions";
//services
import Swal from 'sweetalert2';
import { FrequentQuestionsService } from "src/app/services/frequent-questions.service";
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service"
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-frequent-questions-manag',
  templateUrl: './frequent-questions-manag.component.html',
  styleUrls: ['./frequent-questions-manag.component.scss']
})
export class FrequentQuestionsManagComponent implements OnInit {
  
  //varibales to obtain data
  frequentQuestionsGettting: FrequentQuestions[] = [];
  newArray = this.frequentQuestionsGettting;

  //variables for general search
  generalsearch: string = "";

  //variable of don't results
  noResults = false
  //variable for the loading
  loading: boolean;

  constructor(
    private saveLocalStorageServices: SaveLocalStorageService,
    private _router: Router,
    private spinner : NgxSpinnerService,
    private frequentQuestionsService: FrequentQuestionsService
  ) {
    this.makeObjFrequentQuestions();
  }

  ngOnInit() {
  }
  goBack() {
    this._router.navigate(['/main', 'tycManager'])
  }
  // obtained array frequentQuestions of collection
  makeObjFrequentQuestions() {
    this.loading = true
    this.frequentQuestionsGettting = [];
    this.newArray = this.frequentQuestionsGettting;
    this.frequentQuestionsService.getFrequentQuestions().subscribe(res => {
      if (res.length ) {
        res.forEach((frequentQuestion: FrequentQuestions, index) => {
          const obj: FrequentQuestions = {};
          obj.id = frequentQuestion.id
          obj.typeFrequentQuestion = frequentQuestion.typeFrequentQuestion
          obj.description = frequentQuestion.description

          this.frequentQuestionsGettting.push(obj)

          if (index === (res.length - 1)) {
            this.loading = false;
          }
        });

      } else {
        this.loading = false;
      }
    })
  }
  goToEditFrequentQuestions(idFrequentQuestion: string, i) {
    this.saveLocalStorageServices.saveLocalStorageIdFrequentQuestion(idFrequentQuestion)
    this._router.navigate(['/main', 'editFrequentQuestions', i])
  }
  //delete frequent questions
  deleteTyc(idFrequentQuestion) {
    
        Swal.fire({
          title: 'Estás seguro?',
          text: "¡De que deseas eliminarlo!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: '¡Si, eliminar!'
        }).then((result) => {
          if (result.value) {
            this.spinner.show()
            this.frequentQuestionsService.deleteFrequentQuestion(idFrequentQuestion).subscribe(() => {
              this.makeObjFrequentQuestions();
              this.spinner.hide()
              Swal.fire({
                title: 'Eliminado',
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


    

  
   //method for a specific search
   search() {

    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    this.newArray = this.frequentQuestionsGettting.
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.typeFrequentQuestion))
      })
    // condition by when don't exit results in the table
    if (this.newArray.length == 0) {
      this.noResults = true;

    } else {
      this.noResults = false;
    }

 }


}
