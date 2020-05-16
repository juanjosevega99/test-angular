import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//models
import { FrequentQuestions } from "src/app/models/FrequentQuestions";
//services
import Swal from 'sweetalert2';
import { FrequentQuestionsService } from "src/app/services/frequent-questions.service";
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service"
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
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
    private _location: Location
  ) {
    

  }

  ngOnInit() {
  }
  goBack() {
    this._location.back();
  }
  goToEditFrequentQuestions(idTyc: string, i) {
    // this.saveLocalStorageServices.saveLocalStorageIdTyc(idTyc)
    // this._router.navigate(['/main', 'editTycManager', i])
  }
  //delete frequent questions
  deleteTyc(idTyc) {
    // this.couponsService.getCoupons().subscribe(coupons => {
    //   let tycCoupon = coupons.filter(coupon => coupon.idTermsAndConditions == idTyc)
    //   if (tycCoupon.length != 0) {
    //     Swal.fire({
    //       text: `No se puede eliminar el TyC porque esta utilizado en el cupón: ${tycCoupon[0].name} `,
    //       icon: 'warning',
    //       confirmButtonColor: '#542b81',
    //       confirmButtonText: 'Ok!'
    //     })
    //   } else {
    //     Swal.fire({
    //       title: 'Estás seguro?',
    //       text: "¡De que deseas eliminarlo!",
    //       icon: 'question',
    //       showCancelButton: true,
    //       confirmButtonColor: '#542b81',
    //       cancelButtonColor: '#542b81',
    //       confirmButtonText: 'Si, eliminar!'
    //     }).then((result) => {
    //       if (result.value) {
    //         this.spinner.show()
    //         this.tycManegerService.deleteTermAndCondition(idTyc).subscribe(() => {
    //           this.makeObjTycManager();
    //           this.spinner.hide()
    //           Swal.fire({
    //             title: 'Eliminado',
    //             icon: 'success',
    //             confirmButtonColor: '#542b81',
    //             confirmButtonText: 'Ok!'
    //           }).then((result) => {
    //             if (result.value) {
    //               this._router.navigate(['/main', 'tycManager',]);
    //             }
    //           })
    //         })
    //       }
    //     })
    //   }


    // })


  }
   //method for a specific search
   search() {

  //   let objsearch = {
  //     nameTypeTyc: "",
  //   };

  //   for (var i in this.table.value) {
  //     // search full fields
  //     if (this.table.value[i] !== null && this.table.value[i] !== "") {
  //       objsearch[i] = this.table.value[i];
  //     }
  //   }

  //   var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

  //   this.newArray = this.tycGettting.
  //     filter(function (tyC) {
  //       if (tyC["nameTypeTyc"].toLowerCase().indexOf(this.nameTypeTyc) >= 0) {
  //         return tyC;
  //       }
  //     }, objsearch).
  //     filter(function (item) {
  //       //We test each element of the object to see if one string matches the regexp.
  //       return (myRegex.test(item.name) || myRegex.test(item.nameTypeTyc) || myRegex.test(item.description))
  //     })
  //   // condition by when don't exit results in the table
  //   if (this.newArray.length == 0) {
  //     this.noResults = true;

  //   } else {
  //     this.noResults = false;
  //   }

 }


}
