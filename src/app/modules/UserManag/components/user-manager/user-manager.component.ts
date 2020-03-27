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
import { FormGroup, FormControl, NgModel } from '@angular/forms';



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

  generalsearch: string;

  users = [
    {
      registerDate: '2020-02-01', name: 'Andrea', email: 'john@example.com', phone: '3245672341', birthday: '09/01/1997',
      gender: 'femenino', nameAllie: 'KFC', nameHeadquarter: 'Galerías', usability: 1, purchaseAmount: 12000, selected: false
    },

    {
      registerDate: '2020-02-02', name: 'Kenny', email: 'mary@mail.com', phone: '3125672341', birthday: '19/01/1995',
      gender: 'femenino', nameAllie: 'KFC', nameHeadquarter: 'Centro', usability: 1, purchaseAmount: 12000, selected: false
    },

    {
      registerDate: '2020-02-03', name: 'Ana', email: 'july@greatstuff.com', phone: '3214577223', birthday: '11/05/1945',
      gender: 'femenino', nameAllie: 'Corral', nameHeadquarter: 'Galerías', usability: 1, purchaseAmount: 12000, selected: false
    },

    {
      registerDate: '2020-02-04', name: 'Sofia', email: 'a_r@test.com', phone: '3214577223', birthday: '1999-03-19',
      gender: 'femenino', nameAllie: 'Corral', nameHeadquarter: 'Centro', usability: 1, purchaseAmount: 12000, selected: false
    },

    {
      registerDate: '2019-02-01', name: 'Edwin', email: 'a_r@test.com', phone: '3145332122', birthday: '2013-02-07',
      gender: 'masculino', nameAllie: 'Corral', nameHeadquarter: 'Norte', usability: 0, purchaseAmount: 12000, selected: false
    },

    {
      registerDate: '2018-02-01', name: 'Isabella', email: 'a_r@test.com', phone: '3245672341', birthday: '1992-01-05',
      gender: 'femenino', nameAllie: 'Qbano', nameHeadquarter: 'Galerías', usability: 1, purchaseAmount: 12000, selected: false
    },

    {
      registerDate: '2018-02-05', name: 'kenny', email: 'a_r@test.com', phone: '3245672341', birthday: '1995-06-25',
      gender: 'femenino', nameAllie: 'Qbano', nameHeadquarter: 'Galerías', usability: 1, purchaseAmount: 12000, selected: false
    },

    {
      registerDate: '2018-02-05', name: 'kenny', email: 'a_r@test.com', phone: '3245672341', birthday: '1994-05-15',
      gender: 'femenino', nameAllie: 'kfc', nameHeadquarter: 'Galerías', usability: 1, purchaseAmount: 12000, selected: false
    },

  ]

  usergetting: OrderByUser[] = [];
  //newdateArray: OrderByUser[] = this.users;
  newdateArray = this.usergetting;
  // {
  // date: string, name: string, email: string, cellphone: string, birthday: string, gender: string, establishment: string,
  // headquart: string, usability: string, quantity: string, selected: boolean
  // }[] = this.users;
  // 
  filteredArray: OrderByUser[] = [];
  //  {
  // date: string, name: string, email: string, cellphone: string, birthday: string, gender: string, establishment: string,
  // headquart: string, usability: string, quantity: string, selected: boolean
  // }[] = [];

  userSelected: {}[] = [];

  //variable para formatear los campos de la tabla
  table: FormGroup;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private swal: SwallServicesService,
    private userservice: UsersService, private orderservice: OrdersService) {

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

              this.usergetting.push(obj);
            }
            )

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

  SeachingRange(dateFrom: string, dateTo: string) {

    this.from = dateFrom;
    this.to = dateTo;

    const mydateFrom = new Date(this.from);
    const mydateTo = new Date(this.to);

    if (!this.filteredArray.length) {

      this.newdateArray = [];

      this.usergetting.forEach(user => {

        const userdate = new Date(user.registerDate)

        if (userdate >= mydateFrom && userdate <= mydateTo) {
          this.newdateArray.push(user)
        }
      });

    } else {

      this.newdateArray = [];

      this.filteredArray.forEach(user => {
        const userdate = new Date(user.registerDate)
        if (userdate >= mydateFrom && userdate <= mydateTo) {
          this.newdateArray.push(user);
        }
      });
    }

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

    if (this.fromDate && this.toDate) {

      if (termino) {
        this.filteredArray = [];
        termino = termino.toLowerCase();

        const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
        const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');
        this.SeachingRange(fromdate, todate);

        const aux = this.newdateArray;
        this.newdateArray = [];

        aux.forEach(user => {
          if (user[id].toLowerCase().indexOf(termino) >= 0) {
            this.newdateArray.push(user);
            this.filteredArray.push(user);
          }

        });

      } else {

        const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
        const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');
        this.SeachingRange(fromdate, todate);

      }


    } else {

      if (termino) {

        if (this.filteredArray.length) {

          termino = termino.toLowerCase();

          this.newdateArray = [];

          this.filteredArray.forEach(user => {

            user[id] = user[id].toString();

            if (user[id].toLowerCase().indexOf(termino) >= 0) {
              this.newdateArray.push(user);

            }

          });
        }
        else {
          console.log("no filtered array");


          this.newdateArray = [];

          this.usergetting.forEach(user => {

            user[id] = user[id].toString();

            if (user[id].toLowerCase().indexOf(termino) >= 0) {
              this.newdateArray.push(user);
              this.filteredArray.push(user);

            }

          });

        }


      } else {

        this.table.value[id] = null;

        let count = 0;
        for (var i in this.table.value) {

          if (this.table.value[i] == null || this.table.value[i] == "") {
            count += 1;
          }
        }

        if (count > 9 && !this.generalsearch) {

          this.newdateArray = this.usergetting;
          this.filteredArray = []
          count = 0;

        } else {

          this.newdateArray = this.filteredArray;
          count = 0;
        }
      }
    }
  }


  searchbyterm(termino: string) {

    if (termino) {
      termino = termino.toLowerCase();
      var myRegex = new RegExp('.*' + termino + '.*', 'gi');

      if (this.filteredArray.length) {

        this.newdateArray = this.filteredArray.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
            myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

        });
      } else {

        this.newdateArray = this.usergetting.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
            myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

        });
        this.filteredArray = this.usergetting.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.registerDate) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
            myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.usability.toString()) || myRegex.test(item.purchaseAmount.toString()))

        });

      }

    } else {

      let count = 0;
      for (var i in this.table.value) {
        if (this.table.value[i] == null || this.table.value[i] == "") {
          count += 1;
        }
      }

      if (count > 9 && !this.generalsearch) {

          this.newdateArray = this.usergetting;
          this.filteredArray = []
          count = 0;
          
        } else {

          this.newdateArray = this.filteredArray;
          count = 0;
        }
    }

  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

}
