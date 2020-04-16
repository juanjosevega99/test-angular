import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Coupons } from 'src/app/models/Coupons';
import { CouponList } from 'src/app/models/CouponList';
import { CouponsService } from 'src/app/services/coupons.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
  couponsGettting: CouponList[] = [];
  newArray = this.couponsGettting;
  newArrarSearch: Coupons[] = [];
  filteredArray: CouponList[] = [];
  // obtain coupon by id coupon
  getCuponById : any;
  constructor(
    private couponsServices: CouponsService,
  ) {

    this.table = new FormGroup({
      "code": new FormControl(),
      "nameEstablishment": new FormControl(),
      "cupon": new FormControl()
    })
    this.couponsServices.getCoupons().subscribe(res => {
      res.forEach((coupon: Coupons) => {
        console.log('coupons', coupon)
          let yf = coupon.expirationDate[0]['year'];
          let mf = coupon.expirationDate[0]['month'];
          let df = coupon.expirationDate[0]['day'];
          
          let finishDate = [`${df}/${mf}/${yf}`]
          
          const obj: CouponList = {};
          obj.id = coupon.id;
          obj.codeToRedeem = coupon.codeToRedeem;
          obj.imageCoupon = coupon.imageCoupon;
          obj.nameAllies = coupon.nameAllies;
          obj.nameTypeOfCoupon = coupon.nameTypeOfCoupon;
          // obj.createDate =  this.convertDate(coupon.createDate);
          obj.expirationDate = finishDate
          obj.state = coupon.state

          this.couponsGettting.push(obj)
          console.log('array ',this.couponsGettting);
          
        
      })
    })
  }

  ngOnInit() {
  }

  //method to convert the modification date
  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }
   //method for updating the state to active
   changeStateA(idCoupon) {
    this.couponsServices.getCouponById(idCoupon).subscribe(coupon => {
      this.getCuponById = coupon
      let state: any = [{
          state: "active",
          check: true
        }, {
          state: "inactive",
          check: false
        }]
      this.getCuponById['state'] = state      
      this.swallUpdateState()
    })
  }
   //method for updating the state to inactive
   changeStateI(idCoupon) {
    this.couponsServices.getCouponById(idCoupon).subscribe(coupon => {
      this.getCuponById = coupon
      let state: any = [{
          state: "active",
          check: false
        }, {
          state: "inactive",
          check: true
        }]
        this.getCuponById['state'] = state      
      this.swallUpdateState()
    })
  }

  //method for a specific search
  search(termino?: string, id?: string) {

    // let objsearch = {
    //   identification: "",
    //   name: ""
    // };


    // for (var i in this.table.value) {
    //   // search full fields
    //   if (this.table.value[i] !== null && this.table.value[i] !== "") {
    //     objsearch[i] = this.table.value[i];
    //   }
    // }

    // // let for general searhch
    // var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    // this.newArray = this.couponsGettting.
    //   filter(function (dish) {
    //     if (dish["name"].toLowerCase().indexOf(this.name) >= 0) {
    //       return dish;
    //     }
    //   }, objsearch).
    //   filter(function (dish) {
    //     if (dish["identification"].toLowerCase().indexOf(this.identification) >= 0) {
    //       return dish;
    //     }
    //   }, objsearch).
    //   filter(function (item) {
    //     //We test each element of the object to see if one string matches the regexp.
    //     return (myRegex.test(item.nameCharge) || myRegex.test(item.identification) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.entryDate) || myRegex.test(item.modificationDate) ||
    //       myRegex.test(item.numberOfModifications.toString()))
    //   })

  }
  //sweets alerts
  swallUpdateState() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas actualizar el estado de este cupón!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        console.log('new state: ', this.getCuponById)
        this.couponsServices.putCoupon(this.getCuponById).subscribe(res => {
          this.couponsServices.getCoupons().subscribe(profile => {
            this.couponsGettting = profile
          })
        })
        Swal.fire(
          'Actualizado!',
          'success',
        )
      }
    })
  }

}
