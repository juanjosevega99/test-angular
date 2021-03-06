import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

//services
import Swal from 'sweetalert2';
import { TermsAndConditionsService } from "src/app/services/terms-and-conditions.service";
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service"
import { CouponsService } from "src/app/services/coupons.service"
import { NgxSpinnerService } from 'ngx-spinner';
//models
import { TermsAndConditions } from '../../../../models/TermsAndConditions';

@Component({
  selector: 'app-tyc-manager',
  templateUrl: './tyc-manager.component.html',
  styleUrls: ['./tyc-manager.component.scss'],
})

export class TycManagerComponent implements OnInit {

  //object that saves the values of the table
  table: FormGroup;
  //varibales to obtain data
  tycGettting: TermsAndConditions[] = [];
  newArray = this.tycGettting;

  //variables for general search
  generalsearch: string = "";

  //variable of don't results
  noResults = false
  //variable for the loading
  loading: boolean;

  constructor(
    private saveLocalStorageServices: SaveLocalStorageService,
    private _router: Router,
    private tycManegerService: TermsAndConditionsService,
    private couponsService: CouponsService,
    private spinner : NgxSpinnerService) {
    this.table = new FormGroup({
      "nameTypeTyc": new FormControl(),
    })
    this.makeObjTycManager();
  }

  ngOnInit() { }


  goToEditTyc(idTyc: string, i) {
    this.saveLocalStorageServices.saveLocalStorageIdTyc(idTyc)
    this._router.navigate(['/main', 'editTycManager', i])
  }


  // obtained array tyc of collection
  makeObjTycManager() {
    this.loading = true
    this.tycGettting = [];
    this.newArray = this.tycGettting;
    this.tycManegerService.getTermsAndConditions().subscribe(res => {
      if (res.length ) {
        res.forEach((tyc: TermsAndConditions, index) => {
          const obj: TermsAndConditions = {};
          obj.id = tyc.id
          obj.name = tyc.name
          obj.nameTypeTyc = tyc.nameTypeTyc
          obj.description = tyc.description

          this.tycGettting.push(obj)

          if (index === (res.length - 1)) {
            this.loading = false;
          }
        });

      } else {
        this.loading = false;
      }
    })
  }

  //delete Tyc
  deleteTyc(idTyc) {
    this.couponsService.getCoupons().subscribe(coupons => {
      let tycCoupon = coupons.filter(coupon => coupon.idTermsAndConditions == idTyc)
      if (tycCoupon.length != 0) {
        Swal.fire({
          text: `No se puede eliminar el TyC porque esta utilizado en el cupón: ${tycCoupon[0].name} `,
          icon: 'warning',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      } else {
        Swal.fire({
          title: 'Estás seguro?',
          text: "¡De que deseas eliminarlo!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
          if (result.value) {
            this.spinner.show()
            this.tycManegerService.deleteTermAndCondition(idTyc).subscribe(() => {
              this.makeObjTycManager();
              this.spinner.hide()
              Swal.fire({
                title: 'Eliminado',
                icon: 'success',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              }).then((result) => {
                if (result.value) {
                  this._router.navigate(['/main', 'tycManager',]);
                }
              })
            })
          }
        })
      }


    })


  }
  //method for a specific search
  search() {

    let objsearch = {
      nameTypeTyc: "",
    };

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        objsearch[i] = this.table.value[i];
      }
    }

    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    this.newArray = this.tycGettting.
      filter(function (tyC) {
        if (tyC["nameTypeTyc"].toLowerCase().indexOf(this.nameTypeTyc) >= 0) {
          return tyC;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.name) || myRegex.test(item.nameTypeTyc) || myRegex.test(item.description))
      })
    // condition by when don't exit results in the table
    if (this.newArray.length == 0) {
      this.noResults = true;

    } else {
      this.noResults = false;
    }

  }


}
