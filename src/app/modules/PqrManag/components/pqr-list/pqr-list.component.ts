import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
//export table excel
import * as XLSX from 'xlsx';
//export pdf
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { PqrsService } from 'src/app/services/pqrs.service';
import { Pqrs } from 'src/app/models/Pqrs';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/Users';
import { WebsocketsService } from 'src/app/services/websockets.service';
import { profileStorage } from '../../../../models/ProfileStorage';
import { ShowContentService } from 'src/app/services/providers/show-content.service';

@Component({
  selector: 'app-pqr-list',
  templateUrl: './pqr-list.component.html',
  styleUrls: ['./pqr-list.component.scss']
})
export class PqrListComponent implements OnInit {

  // ==========
  // only styles
  servicepidelo = false;
  servicellevalo = false;
  servicereservalo = false;

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

  usergetting = [];
  newdateArray = this.usergetting;
  filteredArray = [];
  userSelected: {}[] = [];
  generalsearch: string = '';
  table: FormGroup;

  loadingPqrs = false;
  // profile
  profile: profileStorage;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private pqrlistservice: PqrsService,
    private userService: UsersService, private websocket: WebsocketsService, private showmenu: ShowContentService) {

    this.profile = this.showmenu.showMenus();

    this.table = new FormGroup({
      "date": new FormControl(),
      "nameUser": new FormControl(),
      "email": new FormControl(),
      "phone": new FormControl(),
      "birthday": new FormControl(),
      "gender": new FormControl(),
      "nameAllie": new FormControl(),
      "nameHeadquarter": new FormControl(),

    })

    this.loadingPqrs = true;

    if (this.profile.nameCharge.toLocaleLowerCase() == "administradortifi") {
      this.pqrlistservice.getPqrsByHead(this.profile.idHeadquarter).subscribe(res => {

        if (res.length > 0) {

          res.forEach((order: any, index) => {

            if (order.idUser) {
              this.formaterPqr(order);
            }
            
            if (index === (res.length-1)) {
              this.loadingPqrs = false;
            }

          })
        }else{
          this.loadingPqrs=false;
        }
      })
    } else {

      this.pqrlistservice.getPqrs().subscribe(res => {

        if (res.length > 0) {

          res.forEach((order: any, index) => {

            if (order.idUser) {
              this.formaterPqr(order);
            }

            if (index === (res.length-1)) {
              this.loadingPqrs = false;
            }
          })
        } else {
          this.loadingPqrs = false;
        }
      })
    }

  }

  ngOnInit() {
    this.websocket.listen('newPqr').subscribe((pqr: Pqrs) => {
      if (pqr.idHeadquarter == this.profile.idHeadquarter) {
        this.formaterPqr(pqr);
      }
    })
  }

  // =====================================
  // date
  // =====================================

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

  // =====================================================
  // funtion documetns and pdf
  // =====================================================

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
    this.newdateArray = this.usergetting;
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
    let col = ["Radicado", "Fecha", "Nombre", "Correo", "Celular", "F. Nacimiento", "Genero", "Establecimiento",
      "Sede"];
    let rows = [];
    let auxrow = [];
    this.usergetting.map((user, i) => {
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


  // ============================
  // formaterpqr

  formaterPqr(order: any) {

    this.userService.getUserById(order.idUser).subscribe((user: Users) => {
      const obj: Pqrs = {};

      obj.id = order.id,
        obj.date = this.convertDate(order.date);
      obj.nameUser = user.name;
      obj.email = user.email;
      obj.phone = user.phone;
      obj.birthday = this.convertDate(user.birthday);
      obj.gender = user.gender;
      obj.nameAllie = order.nameAllie;
      obj.nameHeadquarter = order.nameHeadquarter;
      obj.typeOfService = order.typeOfService;
      obj.state = order.state;

      this.usergetting.push(obj)
    })

  }

  // ================================
  // filters
  // ================================

  clear() {

    this.table.reset({
      date: null,
      nameUser: null,
      email: null,
      phone: null,
      birthday: null,
      gender: null,
      nameAllie: null,
      nameHeadquarter: null,

    });

    this.fromDate = null;
    this.toDate = null;
    this.filteredArray = [];
    this.newdateArray = [];
    this.newdateArray = this.usergetting;
    this.newdateArray.forEach(item => item.selected = false)
    this.generalsearch = '';

    this.servicepidelo = false;
    this.servicellevalo = false;
    this.servicereservalo = false;
  }


  search(termino?: string, id?: string) {

    // vars to filter table
    let objsearch = {
      nameUser: "",
      email: "",
      phone: "",
      birthday: "",
      gender: "",
      nameAllie: "",
      nameHeadquarter: ""
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
      }
    }

    // let for general searhch
    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    this.newdateArray = this.usergetting.
      filter(function (dish) {
        if (dish["nameUser"].toLowerCase().indexOf(this.nameUser) >= 0) {
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
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.date) || myRegex.test(item.nameUser) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
          myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.typeOfService) || myRegex.test(item.id) )

      }).
      filter(function (item) {

        if (this.fromdate != '' && this.todate != '') {

          const mydateFrom = new Date(this.fromdate);
          const mydateTo = new Date(this.todate);

          let datetransform = item.date.split("/");
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

    // if (this.fromDate && this.toDate) {

    //   if (termino) {
    //     this.filteredArray = [];
    //     termino = termino.toLowerCase();

    //     const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
    //     const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');
    //     this.SeachingRange(fromdate, todate);

    //     const aux = this.newdateArray;
    //     this.newdateArray = [];

    //     aux.forEach(user => {
    //       if (user[id].toLowerCase().indexOf(termino) >= 0) {
    //         this.newdateArray.push(user);
    //         this.filteredArray.push(user);
    //       }

    //     });

    //   } else {

    //     const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
    //     const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');
    //     this.SeachingRange(fromdate, todate);

    //   }


    // } else {

    //   if (termino) {

    //     if (this.filteredArray.length) {

    //       termino = termino.toLowerCase();

    //       this.newdateArray = [];

    //       this.filteredArray.forEach(user => {

    //         user[id] = user[id].toString();

    //         if (user[id].toLowerCase().indexOf(termino) >= 0) {
    //           this.newdateArray.push(user);

    //         }

    //       });
    //     }
    //     else {
    //       console.log("no filtered array");
    //       console.log(id);


    //       this.newdateArray = [];

    //       this.usergetting.forEach(user => {

    //         user[id] = user[id].toString();

    //         if (user[id].toLowerCase().indexOf(termino) >= 0) {
    //           this.newdateArray.push(user);
    //           this.filteredArray.push(user);

    //         }

    //       });

    //     }


    //   } else {

    //     this.table.value[id] = null;

    //     let count = 0;
    //     for (var i in this.table.value) {

    //       if (this.table.value[i] == null || this.table.value[i] == "") {
    //         count += 1;
    //       }
    //     }

    //     if (count > 7 && !this.generalsearch) {

    //       this.newdateArray = this.usergetting;
    //       this.filteredArray = []
    //       count = 0;

    //     } else {

    //       this.newdateArray = this.filteredArray;
    //       count = 0;
    //     }
    //   }
    // }
  }


  // ============================
  // type service filter
  // ===========================
  searchService(service: string, tag: string) {

    switch (service) {

      case 'pidelo':
        this.servicepidelo = !this.servicepidelo;
        this.servicellevalo = false;
        this.servicereservalo = false;
        service = this.servicepidelo ? service : "";
        break;
      case 'llevalo':
        this.servicellevalo = !this.servicellevalo;
        this.servicepidelo = false;
        this.servicereservalo = false;
        service = this.servicellevalo ? service : "";
        break;
      case 'reservalo':
        this.servicereservalo = !this.servicereservalo;
        this.servicepidelo = false;
        this.servicellevalo = false;
        service = this.servicereservalo ? service : "";
        break;
    }

    // this.searchbyterm(service);
    this.generalsearch = service;
    this.search();

  }



  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }


}


