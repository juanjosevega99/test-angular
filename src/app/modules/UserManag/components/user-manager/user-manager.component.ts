import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
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

import { SaveLocalStorageService } from "src/app/services/save-local-storage.service";
import Swal from 'sweetalert2';
import { PromotionsService } from 'src/app/services/promotions.service';
import { Promotions } from 'src/app/models/Promotions';
import { User } from 'firebase';



@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {

  /*name of the excel-file which will be downloaded. */
  fileName = 'ExcelSheet.xlsx';

  //var to know if pdf or excel
  typepdf = true;

  //vars to date filter
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  from: string;
  to: string;

  generalsearch: string = '';


  usergetting: OrderByUser[] = [];
  //newdateArray: OrderByUser[] = this.users;
  newdateArray = this.usergetting;

  filteredArray: OrderByUser[] = [];

  userSelected: {}[] = [];

  //variable para formatear los campos de la tabla
  table: FormGroup;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private swal: SwallServicesService,
    private userservice: UsersService, private orderservice: OrdersService, private _saveLocalStorageService: SaveLocalStorageService, private promotionService: PromotionsService) {

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


    this.userservice.getUsers().subscribe(res => {

      res.forEach((user: Users) => {

        this.orderservice.getChargeByUserId(user.id).subscribe(res => {
          if (res.length > 0) {

            const obj: OrderByUser = {};

            res.forEach((order: Orders) => {
              obj.id = user.id;
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
            }
            )
            this.usergetting.push(obj);

          }
        })

      })
    })

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
    this.userSelected = []
    this.newdateArray.forEach(user => user.selected ? this.userSelected.push(user) : this.userSelected);
  }

  sendCupons() {
    this.selectforsend();
  }

  // ==========================
  // Send promos
  // ==========================
  sendPromos() {
    if (localStorage.getItem('idPromotion')) {
      this.promotionService.getPromotionById(localStorage.getItem('idPromotion')).subscribe(promo => {
        let name = promo.name

        Swal.fire({
          html:
            '¿Estás seguro de que deseas<br>' +
            ' <b>aplicar la promocion </b>' +
            `<b>${name}</b><br>` +
            'a los usuarios filtrados por<br>',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Si, enviar!'
        }).then((result) => {
          if (result.value) {
            let idPromo = localStorage.getItem('idPromotion')
            let nameuser:string[]=[]
            this.userSelected.forEach((user: Users, i) => {
              let idUser = user.id
               
              this.userservice.getUserById(idUser).subscribe((res: Users) => {
                let idsP = res.idsPromos
                idsP.forEach((id, index) => {
                  if (id == idPromo) {
                    this.userSelected[i] = this.userSelected[i]
                    nameuser.push(user.name)
                    
                    
                   
                  } else {
                    user.idsPromos.push(idPromo)
                    this.userservice.putUsers(idUser, this.userSelected[i]).subscribe(res => {
                      Swal.fire({
                        title: 'Enviado',
                        text: "La promoción ha sido aplicada a los usuarios filtrados!",
                        icon: 'success',
                        confirmButtonColor: '#542b81',
                        confirmButtonText: 'Ok!'
                      }).then((result) => {
                        if (result.value) {
                          /* this._router.navigate(['/main', 'createDish', this.identificatorbyRoot]); */
                        }
                      })
                    })
                  }
                })
              })
              
            })
            Swal.fire(JSON.stringify(nameuser))
           /*  Swal.fire({
              html: '<b>El usuario: </b>' +
              `<ul><li *ngFor="let nameu of nameuser"> {{nameu}} </li></ul>`
              +
                  
                '<b>ya tiene la promoción asociada</b>',
              icon: 'error',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            }) */
            /* console.log(nameuser); */
            
            
          }
        })
      })
    } else {
      console.log(this.userSelected);
    }
    this.selectforsend();
    // console.log("users", this.usergetting);
    // console.log(this.table);
  }

  //get data to export
  datafor_Excel() {
    this.typepdf = false;
    this.selectforsend();
  }
  datafor_pdf() {
    this.typepdf = true;
    this.selectforsend();
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


  // searchbyterm(termino: string) {

  //   termino = termino.toLowerCase();
  //   var myRegex = new RegExp('.*' + termino + '.*', 'gi');

  //   if (this.newdateArray.length == this.usergetting.length) {

  //     this.newdateArray = this.usergetting.filter(function (item) {
  //       return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
  //         myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

  //     });

  //   } else {

  //     let aux = this.newdateArray;
  //     this.newdateArray = aux.filter(function (item) {
  //       return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
  //         myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

  //     });

  //   }

  //   // if (termino) {
  //   //   termino = termino.toLowerCase();
  //   //   var myRegex = new RegExp('.*' + termino + '.*', 'gi');

  //   //   if (this.filteredArray.length) {

  //   //     this.newdateArray = this.filteredArray.filter(function (item) {
  //   //       //We test each element of the object to see if one string matches the regexp.
  //   //       return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
  //   //         myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

  //   //     });
  //   //   } else {

  //   //     this.newdateArray = this.usergetting.filter(function (item) {
  //   //       //We test each element of the object to see if one string matches the regexp.
  //   //       return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
  //   //         myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

  //   //     });
  //   //     this.filteredArray = this.usergetting.filter(function (item) {
  //   //       //We test each element of the object to see if one string matches the regexp.
  //   //       return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
  //   //         myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

  //   //     });

  //   //   }

  //   // } else {

  //   //   let count = 0;
  //   //   for (var i in this.table.value) {
  //   //     if (this.table.value[i] == null || this.table.value[i] == "") {
  //   //       count += 1;
  //   //     }
  //   //   }

  //   //   if (count > 9 && !this.generalsearch) {

  //   //     this.newdateArray = this.usergetting;
  //   //     this.filteredArray = []
  //   //     count = 0;

  //   //   } else {

  //   //     this.newdateArray = this.filteredArray;
  //   //     count = 0;
  //   //   }
  //   // }

  // }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

}
