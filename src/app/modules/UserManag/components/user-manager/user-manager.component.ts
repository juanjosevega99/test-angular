import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//export table excel
import * as XLSX from 'xlsx';

//export pdf
import 'jspdf-autotable';

//service modal
import { SwallServicesService } from 'src/app/services/swall-services.service';
import * as jsPDF from 'jspdf';
import { Users } from 'src/app/models/Users';
import { UsersService } from 'src/app/services/users.service';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderByUser } from '../../../../models/OrderByUser';
import { Orders } from '../../../../models/Orders';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DishPromotion } from 'src/app/models/DishPromotion';
import { DishesService } from 'src/app/services/dishes.service';
import { Dishes } from 'src/app/models/Dishes';
import { AlliesService } from 'src/app/services/allies.service';

import Swal from 'sweetalert2';
import { PromotionsService } from 'src/app/services/promotions.service';
import { Promotions } from 'src/app/models/Promotions';
import { User } from 'firebase';
import { CouponsService } from "src/app/services/coupons.service";
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service";
import { CouponsAvailableService } from 'src/app/services/coupons-available.service';


@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit, OnDestroy {

  /*name of the excel-file which will be downloaded. */
  fileName = 'ExcelSheet.xlsx';

  //var to know if pdf or excel
  typepdf = false;
  typeExcel = false;
  //variable to know if coupon 
  typeCoupon = false
  //vars to date filter
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  from: string;
  to: string;

  // =======================
  // promotions
  dishgetting: DishPromotion[] = [];
  dishPromoArray = this.dishgetting;
  today: Date;
  promosSelected = [];
  allies = [];
  alertPromos = false;
  loadingPromos = false;
  isIdPromotion = false;
  // =======================


  generalsearch: string = '';

  usergetting: OrderByUser[] = [];
  //newdateArray: OrderByUser[] = this.users;
  newdateArray = this.usergetting;
  filteredArray: OrderByUser[] = [];
  loadingUsers = false;

  userSelected: {}[] = [];
  //variable para formatear los campos de la tabla
  table: FormGroup;

  //variables for send coupons
  idCoupon: string;
  numberOfCoupons: number;
  //variable to know couponsAvailable by idCoupon
  couponsAvailableByIdCoupon: any;
  arrayCoupon: any[] = []
  numberOfUnits: number;


  constructor(private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private userservice: UsersService,
    private orderservice: OrdersService,
    private couponsService: CouponsService,
    private saveLocalStorageService: SaveLocalStorageService,
    private promotionService: PromotionsService,
    private couponsAvailableService: CouponsAvailableService,
    private modalpromo: NgbModal,
    private allyservice: AlliesService,
    private dishesService: DishesService,
    private promoService: PromotionsService,
    private _router: Router) {

    this.idCoupon = this.saveLocalStorageService.getLocalStorageIdCoupon()

    this.table = new FormGroup({
      "date": new FormControl(),
      "name": new FormControl(),
      "email": new FormControl(),
      "phone": new FormControl(),
      "birthday": new FormControl(),
      "gender": new FormControl(),
      "nameAllie": new FormControl(),
      "nameHeadquarter": new FormControl(),
      "usability": new FormControl(),
      "purchaseAmount": new FormControl(),

    })

    // loading users
    this.loadUsers();

    this.couponsService.getCouponById(this.idCoupon).subscribe(coupon => {
      this.numberOfCoupons = coupon.numberOfCouponsAvailable
      this.numberOfUnits = coupon.numberOfUnits// don't working with identificator
    })

    if (localStorage.getItem('idPromotion')) {
      this.isIdPromotion = true;
    }

  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  ngOnInit() {

  }
  ngOnDestroy(){
    this.deleteFromLocal();
  }

  loadUsers() {

    if (localStorage.getItem('idPromotion')) {
      this.isIdPromotion = true;
    }

    this.usergetting = [];

    this.loadingUsers = true;

    this.userservice.getUsers().subscribe(res => {

      res.forEach((user: Users) => {

        this.orderservice.getChargeByUserId(user.id).subscribe(res => {
          if (res.length > 0) {

            const obj: OrderByUser = {};

            res.forEach((order: Orders) => {
              obj.idUser = user.id;
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
              obj.idsPromos = user.idsPromos;
            })
            this.usergetting.push(obj);
            this.loadingUsers = false;

          } else {
            this.loadingUsers = false;
          }
        })

      })
    })

    this.newdateArray = this.usergetting;
  }


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

  selectforsend() {
    this.userSelected = [];
    this.newdateArray.forEach(user => user.selected ? this.userSelected.push(user) : this.userSelected);
  }

  sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  selectedPromo(event, pos: number) {
    const checked = event.target.checked;
    event.target.checked = checked;
    this.dishPromoArray[pos]['selected'] = checked;
  }
  // =====================================

  async selectPromosSend() {
    this.promosSelected = [];
    await this.dishPromoArray.forEach(promo => promo['selected'] ? this.promosSelected.push(promo['id']) : this.promosSelected);
  }

  sendCupons() {

    this.selectforsend();
    this.typeCoupon = true
    this.typeExcel = false;
    this.typepdf = false;

  }
  // ==========================
  // delete idpromo from localstorage
  // ==========================

  deleteFromLocal() {
    localStorage.removeItem('idPromotion');
    localStorage.removeItem('idCoupon')
  }

  // ==========================
  // Send promos
  // ==========================
  sendPromos() {

    this.selectforsend();

    if (localStorage.getItem('idPromotion')) {
      if (this.userSelected.length) {
        this.promotionService.getPromotionById(localStorage.getItem('idPromotion')).subscribe(promo => {
          let name = promo.name
          let reference = promo.reference
          Swal.fire({
            html:
              '¿Estás seguro de que deseas<br>' +
              ' <b>aplicar la promocion </b>' +
              `<b>${name}</b><br>` +
              'a los usuarios seleccionados<br>',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#542b81',
            cancelButtonColor: '#542b81',
            confirmButtonText: 'Si, enviar!'
          }).then((result) => {

            if (result.value) {
              let idPromo = localStorage.getItem('idPromotion');

              this.userSelected.forEach((user: OrderByUser, i) => {

                const idsP = user.idsPromos;

                if (idsP.length) {

                  let promoexist = idsP.indexOf(idPromo); // it's -1 if not exist

                  if (promoexist < 0) {
                    user.idsPromos.push(idPromo);
                    this.promoSelectedToUsers(user, reference);

                  } else {
                    Swal.fire({
                      text: "La promoción ha sido aplicada satisfactoriamente a los usuarios seleccionados!",
                      icon: 'success',
                      confirmButtonColor: '#542b81',
                      confirmButtonText: 'Ok!'
                    }).then((result) => {
                      if (result.value) {
                        localStorage.removeItem('idPromotion');
                        this._router.navigate(['/main', 'createDish', reference]);
                      }
                    })
                  }
                } else {
                  // enviar promociones
                  user.idsPromos.push(idPromo);
                  this.promoSelectedToUsers(user, reference);
                }

              })
            }

          })

        })

      } else {
        Swal.fire({
          text: "Por favor, seleccione al menos un usuario!",
          icon: 'warning',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      }

    } else {

      console.log(this.userSelected);
      this.selectPromosSend();

      if (this.promosSelected.length) {
        this.alertPromos = false;
        this.updatePromosUser();

      } else {
        this.alertPromos = true;
      }
    }

  }

  promoSelectedToUsers(user: OrderByUser, reference: string) {
    const promosend = {
      idsPromos: user.idsPromos
    }

    this.userservice.putUsers(user.idUser, promosend).subscribe((userUpdate: Users) => {
      console.log("promociones enviadas satisfactoriamente");
      Swal.fire({
        text: "La promoción ha sido aplicada satisfactoriamente a los usuarios seleccionados!",
        icon: 'success',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'Ok!'
      }).then((result) => {
        if (result.value) {
          localStorage.removeItem('idPromotion');
          this._router.navigate(['/main', 'createDish', reference]);
        }
      })
    })
  }


  updatePromosUser() {

    Swal.fire({
      title: '¿Enviar promociones a los usuarios seleccioandos?',
      // text: `"de que deseas enviar estos cupones!"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'enviar!'
    }).then(res => {

      if (res) {
        this.userSelected.forEach((user: OrderByUser) => {

          if (user.idsPromos.length) {

            let promosToSend = [];
            let count = 0;
            this.promosSelected.forEach(promoToSend => {

              count += 1;
              let promoexits = user.idsPromos.indexOf(promoToSend); // it's -1 if not exist

              if (promoexits < 0) {
                // promocion no existe
                promosToSend.push(promoToSend);
              }

            })

            if (promosToSend.length && count === this.promosSelected.length) {
              user.idsPromos = user.idsPromos.concat(promosToSend);
              this.promoToUser(user);
            } else {
              Swal.fire({
                text: "Promociones enviadas satisfactoriamente!",
                icon: 'success',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              })
            }

          } else {
            // usuario sin promociones se le pasa las promociones
            user.idsPromos = this.promosSelected;
            this.promoToUser(user);
          }
        })
        this.loadUsers();
      }
    })


  }

  promoToUser(user: OrderByUser) {
    const promosend = {
      idsPromos: user.idsPromos
    }

    this.userservice.putUsers(user.idUser, promosend).subscribe((userUpdate: Users) => {
      console.log("promociones enviadas satisfactoriamente");
      Swal.fire({
        title: 'promociones enviadas satisfactoriamente',
        // text: `"de que deseas enviar estos cupones!"`,
        icon: 'success'
      })


    })
  }

  loadAllies(content) {

    this.dishPromoArray = [];
    this.selectforsend();

    if (this.userSelected.length) {

      this.modalpromo.open(content, { size: 'xl', scrollable: true, centered: true });
      this.allyservice.getAllies().subscribe((allies: []) => {
        this.allies = allies;
      })

    } else {
      Swal.fire({
        text: "Por favor, seleccione al menos un usuario!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'Ok!'
      })
    }

    this.selectforsend();
    // console.log("users", this.usergetting);
    // console.log(this.table);
  }

  //get data to export
  datafor_Excel() {
    this.typeExcel = true;
    this.typeCoupon = false;
    this.typepdf = false;
    this.selectforsend();
  }
  datafor_pdf() {
    this.typepdf = true;
    this.typeExcel = false;
    this.typeCoupon = false;
    this.selectforsend();
  }

  // ==========================
  // methods for send Coupons
  // ==========================

  sendCouponToUsers() {
    if (this.userSelected.length) {
      if (this.userSelected.length > this.numberOfCoupons) {
        // alert("")
        Swal.fire({
          text: "no puede entregar más cupones de los que tiene disponibles",
          icon: 'warning',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      } else {
        console.log(this.userSelected)
        this.swallSendCouponToUsersSelected();
      }

    } else {
      Swal.fire({
        text: "seleccione al menos un usuario",
        icon: 'warning',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'Ok!'
      })
    }
  }

  swallSendCouponToUsersSelected() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas enviar estos cupones!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, enviar!'
    }).then((result) => {
      if (result.value) {
        let flagThereIsNoUser: boolean;
        let currentDate: any;
        let contCouponsSend : number = 0
        this.couponsAvailableService.getCouponAvailableByIdCoupon(this.idCoupon)
          .subscribe(coupons => {
            this.couponsAvailableByIdCoupon = coupons
            for (let i = 0; i < this.userSelected.length; i++) {
              let cont = 1
              for (let j = 0; j < this.userSelected.length; j++) {
                let user = this.userSelected[i];
                let iduser = user['id']
                let userName = user['name']
                let arrayCuponByIdUser = this.couponsAvailableByIdCoupon.filter(coupon => coupon.idUser == iduser)
                if (arrayCuponByIdUser.length != 0) {
                  alert(`al usuario ${userName} no se le puede asignar un cupón`)
                  // Swal.fire({
                  //   text: `al usuario ${userName} no se le puede asignar un cupón`,
                  //   icon: 'warning',
                  //   confirmButtonColor: '#542b81',
                  //   confirmButtonText: 'Ok!'
                  // })
                  break;
                } else {
                  let couponsAvailable = this.couponsAvailableByIdCoupon.filter(coupon => coupon.state == false)
                  let couponByIdUser = couponsAvailable[i]
                  let obj: object = {
                    id: couponByIdUser._id,
                    idUser: iduser,
                    idCoupon: couponByIdUser.idCoupon,
                    state: true
                  }
                  console.log(obj)
                  this.couponsAvailableService.putCouponAvailable(obj).subscribe(() => {
                    contCouponsSend = contCouponsSend + 1 
                    flagThereIsNoUser = true
                  })
                  this.couponsService.getCouponById(this.idCoupon).subscribe(coupon => {
                    coupon['numberOfCouponsAvailable'] = this.numberOfCoupons - cont
                    this.numberOfCoupons = coupon['numberOfCouponsAvailable']

                  })
                  break;
                }

              }
            }

            this.couponsService.getCouponById(this.idCoupon).subscribe(coupon => {
              coupon['numberOfCouponsAvailable'] = this.numberOfCoupons
              let state: any = [{
                state: "active",
                check: true
              }, {
                state: "inactive",
                check: false
              }]
              coupon['state'] = state

              currentDate = new Date();
              let formatDate = currentDate.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
              let arrayDate = formatDate.split('/').map(x => +x);
              let objStartDate: any = {};
              let arrayObjDate: any[] = []
              objStartDate.day = arrayDate[0];
              objStartDate.month = arrayDate[1];
              objStartDate.year = arrayDate[2];
              arrayObjDate = objStartDate
              coupon['createDate'] = arrayObjDate

              if (coupon.nameTypeOfCoupon == 'Descuentos') {

                let currentEndDate: Date;
                currentEndDate = new Date();
                this.sumarDias(currentEndDate, 30)
                let formatEndDate = currentEndDate.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
                let arrayEndDate = formatEndDate.split('/').map(x => +x);
                let objEndDate: any = {};
                let arrayObjEndDate: any[] = []
                objEndDate.day = arrayEndDate[0];
                objEndDate.month = arrayEndDate[1];
                objEndDate.year = arrayEndDate[2];
                arrayObjEndDate = objEndDate
                console.log(arrayObjEndDate)
                coupon['expirationDate'] = arrayObjEndDate

              }
              if (flagThereIsNoUser == true) {
                Swal.fire({
                  title: 'Enviado',
                  text: `Cupones enviados: ${contCouponsSend} `,
                  icon: 'warning',
                  confirmButtonColor: '#542b81',
                  confirmButtonText: 'Ok!'
                })
              }
              this.couponsService.putCoupon(coupon).subscribe()

            })
          })
      }
    })
  }


  //generate excel file
  generateExcel() {

    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  //generate pdf file

  generatePdf(content: any) {
    console.log(content);
    //'p', 'mm', 'a4'

    let doc = new jsPDF('landscape');
    let col = ["#", "Fecha", "Nombre", "Correo", "Celular", "F. Nacimiento", "Genero", "Establecimiento",
      "Sede", "Usabilidad", "Monto"];
    let rows = [];
    let auxrow = [];
    this.userSelected.map((user, i) => {
      auxrow = [];
      auxrow[0] = i + 1;
      for (const key in user) {
        if (user.hasOwnProperty(key)) {
          // Mostrando en pantalla la clave junto a su valor
          auxrow.push(user[key]);
        }
      }
      rows.push(auxrow);
    });

    //build the pdf file
    doc.autoTable(col, rows);
    doc.save('Test.pdf');

  }


  clear() {

    this.table.reset({
      date: null,
      name: null,
      email: null,
      phone: null,
      birthday: null,
      gender: null,
      nameAllie: null,
      nameHeadquarter: null,
      usability: null,
      purchaseAmount: null
    });

    this.fromDate = null;
    this.toDate = null;
    this.filteredArray = [];
    this.newdateArray = [];
    this.newdateArray = this.usergetting;
    this.newdateArray.forEach(item => item.selected = false)
    this.generalsearch = '';
  }


  search(termino?: string, id?: string) {

    // vars to filter table
    let objsearch = {

      name: "",
      email: "",
      phone: "",
      birthday: "",
      gender: "",
      nameAllie: "",
      nameHeadquarter: "",
      usability: "",
      purchaseAmount: ""
    };
    // let for date search
    let objdate = {
      fromdate: this.fromDate != null ? [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-') : '',
      todate: this.toDate != null ? [this.toDate.year, this.toDate.month, this.toDate.day].join('-') : ''
    }

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        objsearch[i] = this.table.value[i];
        /* console.log(this.table.controls[i].parent.value); *//* this.table.controls['generalsearch'].value */
      }
    }

    // let for general searhch
    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    // const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
    // const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');

    this.newdateArray = this.usergetting.
      filter(function (dish) {
        if (dish["name"].toLowerCase().indexOf(this.name) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["email"].toLowerCase().indexOf(this.email) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["phone"].toLowerCase().indexOf(this.phone) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["birthday"].toLowerCase().indexOf(this.birthday) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["gender"].toLowerCase().indexOf(this.gender) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["nameAllie"].toLowerCase().indexOf(this.nameAllie) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["nameHeadquarter"].toLowerCase().indexOf(this.nameHeadquarter) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["usability"].toString().indexOf(this.usability) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["purchaseAmount"].toString().indexOf(this.purchaseAmount) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
          myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

      }).
      filter(function (item) {

        if (this.fromdate != '' && this.todate != '') {

          const mydateFrom = new Date(this.fromdate);
          const mydateTo = new Date(this.todate);

          let datetransform = item.registerDate.split("/");
          let newdatetransform = datetransform[2] + "-" + datetransform[1] + "-" + datetransform[0];
          const userdate = new Date(newdatetransform);
          if (userdate >= mydateFrom && userdate <= mydateTo) {
            return item;
          } else {
            return null
          }
        } else {
          return item;
        }
      }, objdate)

  }


  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  // load promotions
  loadPromos(event) {

    this.loadingPromos = true;
    this.dishPromoArray = [];
    const idAlly = event.target.value;

    this.dishesService.getDishesByIdAlly(idAlly).subscribe(res => {
      if (res.length > 0) {
        res.forEach((dish: Dishes) => {
          if (dish.idPromotion != null) {
            for (let item = 0; item < dish.idPromotion.length; item++) {
              let iditem = dish.idPromotion[item];

              this.promoService.getPromotions().subscribe(res => {
                res.forEach((promo: Promotions) => {
                  if (iditem == promo.id) {
                    let yf = promo.endDatePromotion[0]['year'];
                    let mf = promo.endDatePromotion[0]['month'];
                    let df = promo.endDatePromotion[0]['day'];
                    let hf = promo.endDatePromotion[1]['hour'];
                    let minf = promo.endDatePromotion[1]['minute'];

                    let dateF = new Date(`${yf}-${mf}-${df}`).getTime();
                    let datee = new Date(yf, mf, df, hf, minf)
                    let timee = datee.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });


                    let ys = promo.promotionStartDate[0]['year'];
                    let ms = promo.promotionStartDate[0]['month'];
                    let ds = promo.promotionStartDate[0]['day'];
                    let hs = promo.promotionStartDate[1]['hour'];
                    let mins = promo.promotionStartDate[1]['minute'];

                    let dateS = new Date(`${ys}-${ms}-${ds}`).getTime();
                    let datei = new Date(ys, ms, ds, hs, mins)
                    let timei = datei.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                    let diff = dateF - dateS;

                    this.today = new Date()
                    let datetoday = this.today.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
                    let datestart = datei.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
                    let datefinish = datee.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });

                    const obj: any = {};

                    obj.id = promo.id;
                    obj.reference = `${dish.reference}-${item + 1}`;
                    obj.nameDishesCategories = dish.nameDishesCategories;
                    obj.name = dish.name;
                    obj.photo = promo.photo;
                    obj.price = dish.price;
                    obj.namepromo = promo.name;
                    obj.pricepromo = promo.price;
                    obj.daysPromo = diff / (1000 * 60 * 60 * 24);
                    obj.promotionStartDate = promo.promotionStartDate;
                    obj.timestart = timei;
                    obj.endDatePromotion = promo.endDatePromotion;
                    obj.timeend = timee;
                    /* obj.state = promo.state; */


                    if (datetoday >= datestart && datetoday <= datefinish) {
                      /* obj.state = promo.state */
                      let stateDate: any = [{
                        state: "active",
                        check: true
                      }, {
                        state: "inactive",
                        check: false
                      }]
                      obj.state = stateDate
                    } else if (datetoday > datefinish || datetoday < datestart) {
                      let stateDate: any = [{
                        state: "active",
                        check: false
                      }, {
                        state: "inactive",
                        check: true
                      }]
                      obj.state = stateDate
                      obj.selected = false;
                    }

                    if (obj.state[0].check) {

                      this.dishPromoArray.push(obj)
                    }
                    // const promee: Promotions = { reference: `${dish.reference}-${item + 1}`, state: obj.state };
                    // this.promoService.putPromotion(iditem, promee).subscribe(res => { })

                  }
                })
              })
            }
            this.loadingPromos = false;
          }
        })
      } else {
        this.loadingPromos = false;
      }
    })
  }

}
