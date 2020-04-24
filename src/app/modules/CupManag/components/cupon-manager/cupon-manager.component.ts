import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//services
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service"
import { CouponsService } from 'src/app/services/coupons.service';
import { UsersService } from 'src/app/services/users.service';
import { OrdersService } from 'src/app/services/orders.service';
//models
import { Coupons } from 'src/app/models/Coupons';
import { CouponList } from 'src/app/models/CouponList';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { Orders } from 'src/app/models/Orders';
import { Users } from 'src/app/models/Users';


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
  couponsGettting: Coupons[] = [];
  newArray = this.couponsGettting;
  newArrarSearch: Coupons[] = [];
  filteredArray: Coupons[] = [];
  // obtain coupon by id coupon
  getCuponById: any;
  //variable of don't results
  noResults = false

  //variables for users
  usergetting: OrderByUser[] = []; //tofo
  newdateArray = this.usergetting;
  constructor(
    private couponsServices: CouponsService,
    private saveLocalStorageServices: SaveLocalStorageService,
    private _router: Router, private userservice: UsersService,
    private orderservice: OrdersService

  ) {

    //inicialization users by ally 
    this.userservice.getUsers().subscribe(res => {

      res.forEach((user: Users) => {

        this.orderservice.getChargeByUserId(user.id).subscribe(res => {
          if (res.length > 0) {

            const obj: OrderByUser = {};

            res.forEach((order: Orders) => {
              obj.name = user.name;
              obj.email = user.email;
              obj.phone = user.phone;
              obj.birthday = this.convertDate(user.birthday);
              obj.gender = user.gender;
              obj.nameAllie = order.nameAllies;
              obj.nameHeadquarter = order.nameHeadquartes;
              obj.usability = order.orderValue ? 1 : 0;
              obj.purchaseAmount = order.orderValue;
              obj.registerDate = this.convertDate(order.dateAndHourDelivey);
            }
            )
            this.usergetting.push(obj);

          }
        })

      })
    })
    //clean local storage  for ally and headquarter
    this.saveLocalStorageServices.saveLocalStorageIdCoupon("");

    this.table = new FormGroup({
      "name": new FormControl(),
      "nameAllies": new FormControl(),
      "general": new FormControl()
    })
    this.couponsServices.getCoupons().subscribe(res => {
      res.forEach((coupon: Coupons) => {
        let ys = coupon.createDate[0]['year'];
        let ms = coupon.createDate[0]['month'];
        let ds = coupon.createDate[0]['day'];

        let createDate = [`${ds}/${ms}/${ys}`]

        // let yf = coupon.expirationDate[0]['year'];
        // let mf = coupon.expirationDate[0]['month'];
        // let df = coupon.expirationDate[0]['day'];

        // let finishDate = [`${df}/${mf}/${yf}`]
        const obj: Coupons = {};
        obj.id = coupon.id;
        obj.name = coupon.name;
        obj.imageCoupon = coupon.imageCoupon;
        obj.nameAllies = coupon.nameAllies;
        obj.nameTypeOfCoupon = coupon.nameTypeOfCoupon;
        obj.numberOfUnits = coupon.numberOfUnits;
        obj.numberOfCouponsAvailable = coupon.numberOfCouponsAvailable
        obj.createDate = createDate;
        // obj.expirationDate = finishDate
        obj.state = coupon.state

        if (coupon.expirationDate.length && coupon.expirationTime.length != 0) {
          let yf = coupon.expirationDate[0]['year'];
          let mf = coupon.expirationDate[0]['month'];
          let df = coupon.expirationDate[0]['day'];

          let finishDate = [`${df}/${mf}/${yf}`]
          obj.expirationDate = finishDate
        }else{
          let msg= ["30 días despues de activarlo"]
          obj.expirationDate = msg
        }

        this.couponsGettting.push(obj)

      })
    })
  }

  ngOnInit() {

  }
  goToEditCoupon(idCoupon: string, i) {

    this.saveLocalStorageServices.saveLocalStorageIdCoupon(idCoupon)
    this._router.navigate(['/main', 'editCoupon', i])
  }
  goToUserManger(idCoupon: string, i) {
    this.saveLocalStorageServices.saveLocalStorageIdCoupon(idCoupon)
    this._router.navigate(['/main', 'userManager', i])
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

  //get data to export
  // datafor_Users(){
  //   // this.typepdf = false;
  //   this.selectforsend();
  // }
  //selected All items
  selectedAll(event) {
    const checked = event.target.checked;
    this.newdateArray.forEach(item => item.selected = checked)
  }

  selectedOne(event, pos: number) {
    const checked = event.target.checked;
    event.target.checked = checked;
    this.newdateArray[pos].selected = checked;
  }

  // selectforsend() {
  //   // this.userSelected = []
  //   // this.newdateArray.forEach(user => user.selected ? this.userSelected.push(user) : this.userSelected);
  // }


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
