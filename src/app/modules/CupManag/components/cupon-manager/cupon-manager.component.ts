import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//services
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service"
import { CouponsService } from 'src/app/services/coupons.service';
import { CouponsAvailableService } from 'src/app/services/coupons-available.service';
//models
import { Coupons } from 'src/app/models/Coupons';

@Component({
  selector: 'app-cupon-manager',
  templateUrl: './cupon-manager.component.html',
  styleUrls: ['./cupon-manager.component.scss']
})
export class CuponManagerComponent implements OnInit {

  //object that saves the values of the table
  table: FormGroup;

  //variables for general search
  generalsearch: string = "";

  //varibales to obtain data
  couponsGettting: Coupons[] = [];
  newArray = this.couponsGettting;
  newArrarSearch: Coupons[] = [];
  filteredArray: Coupons[] = [];
  // obtain coupon by id coupon
  getCuponById: any;
  //variable of don't results
  noResults = false

  constructor(
    private couponsServices: CouponsService,
    private saveLocalStorageServices: SaveLocalStorageService,
    private _router: Router,
    private couponsAvailableService: CouponsAvailableService,
  
  ) {
    // inicilization current date 
    let currentDate: any;
    currentDate = new Date();
    let formatDate = currentDate.toLocaleString('es-ES', {year: 'numeric' , month: 'numeric', day: '2-digit' });
    let arrayDate = formatDate.split('/').map(x=>+x);
    let objtDate: any = {};
    let arrayObjDate: any[] = []
    objtDate.day = arrayDate[0];
    objtDate.month = arrayDate[1];
    objtDate.year = arrayDate[2];
    arrayObjDate = objtDate
  // function for compare of expiration date with current date
    function compareObj(a, b) {
      var aKeys = Object.keys(a).sort();
      var bKeys = Object.keys(b).sort();
      if (aKeys.length !== bKeys.length) {
          return false;
      }
      if (aKeys.join('') !== bKeys.join('')) {
          return false;
      }
      for (var i = 0; i < aKeys.length; i++) {
          if ( a[aKeys[i]]  !== b[bKeys[i]]) {
              return false;
          }
      }
      return true;
  }
    this.couponsServices.getCoupons().subscribe(res => {
      res.forEach((coupon: Coupons) =>   {
        let endDate = coupon.expirationDate[0]
        //Validation for expiration cupón
        let resulEndDate = compareObj(endDate,objtDate)
        if ( resulEndDate == true){
          let state: any = [{
            state: "active",
            check: false
          }, {
            state: "inactive",
            check: true
          }]
          coupon['state'] = state
          coupon['numberOfCouponsAvailable'] = coupon['numberOfUnits']
          this.couponsServices.putCoupon(coupon).subscribe()
          this.couponsAvailableService.getCouponAvailableByIdCoupon(coupon.id).subscribe((couponAvailable:any) => {
            couponAvailable.forEach((element) => {
              let obj: object = {
                id: element._id,
                idUser: null,
                idCoupon: element.idCoupon,
                state: false
              }
              this.couponsAvailableService.putCouponAvailable(obj).subscribe()
            });
          })
        }
      })
    })
    //inicialization users by ally 
    //clean local storage  for ally and headquarter
    this.saveLocalStorageServices.saveLocalStorageIdCoupon("");

    this.table = new FormGroup({
      "name": new FormControl(),
      "nameAllies": new FormControl(),
      "general": new FormControl()
    })
    


  }

  ngOnInit() {
    this.couponsServices.getCoupons().subscribe(res => {
      res.forEach((coupon: Coupons) => {
        let ys = coupon.createDate[0]['year'];
        let ms = coupon.createDate[0]['month'];
        let ds = coupon.createDate[0]['day'];

        let createDate = [`${ds}/${ms}/${ys}`]

        const obj: Coupons = {};
        obj.id = coupon.id;
        obj.name = coupon.name;
        obj.imageCoupon = coupon.imageCoupon;
        obj.nameAllies = coupon.nameAllies;
        obj.nameTypeOfCoupon = coupon.nameTypeOfCoupon;
        obj.numberOfUnits = coupon.numberOfUnits;
        obj.numberOfCouponsAvailable = coupon.numberOfCouponsAvailable
        obj.createDate = createDate;
        obj.state = coupon.state

        if (coupon.expirationDate.length && coupon.expirationTime.length != 0) {
          let yf = coupon.expirationDate[0]['year'];
          let mf = coupon.expirationDate[0]['month'];
          let df = coupon.expirationDate[0]['day'];

          let finishDate = [`${df}/${mf}/${yf}`]
          obj.expirationDate = finishDate
        } else {
          let msg = ["30 días despues de activarlo"]
          obj.expirationDate = msg
        }

        this.couponsGettting.push(obj)

      })
    })
  }
  goToEditCoupon(idCoupon: string, i) {

    this.saveLocalStorageServices.saveLocalStorageIdCoupon(idCoupon)
    this._router.navigate(['/main', 'editCoupon', i])
  }
  goToUserManger(idCoupon: string, i) {
    this.saveLocalStorageServices.saveLocalStorageIdCoupon(idCoupon)
    this._router.navigate(['/main', 'userManager', i])
  }


  //method for a specific search
  search(termino?: string, id?: string) {

    let objsearch = {
      name: "",
      nameAllies: ""
    };

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        objsearch[i] = this.table.value[i];
      }
    }

    // let for general searh
    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    this.newArray = this.couponsGettting.
      filter(function (coupon) {
        if (coupon["nameAllies"].toLowerCase().indexOf(this.nameAllies) >= 0) {
          return coupon;
        }
      }, objsearch).
      filter(function (coupon) {
        if (coupon["name"].toLowerCase().indexOf(this.name) >= 0) {
          return coupon;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.name) || myRegex.test(item.nameAllies) ||
          myRegex.test(item.nameTypeOfCoupon) || myRegex.test(item.createDate.toString()) ||
          myRegex.test(item.expirationDate.toString()))
      })
    // condition by when don't exit results in the table
    if (this.newArray.length == 0) {
      this.noResults = true;

    } else {
      this.noResults = false;
    }

  }

 
}
