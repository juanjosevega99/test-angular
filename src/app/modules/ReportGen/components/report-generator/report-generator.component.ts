import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { OrdersService } from 'src/app/services/orders.service';
import { Orders } from 'src/app/models/Orders';
import { Users } from 'src/app/models/Users';
//export pdf
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.scss']
})
export class ReportGeneratorComponent implements OnInit {
  calendarinit: NgbCalendar
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  from: string;
  to: string;

  //array for users of service
  usergetting: OrderByUser[] = [];

  //Array for filter
  newdateArray = this.usergetting;
  //variable para formatear los campos de la tabla
  table: FormGroup;


  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
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

        this.orderservice.getChargeByUserId(user.id).subscribe((order: Orders[]) => {
          if (order.length > 0) {

            const obj: OrderByUser = {};

            order.forEach((order: Orders) => {
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
            })
          }
          this.SeachingRange();
        })
      })
    })

    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getToday();

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

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toISOString().split("T")[0];
    return n;
  }

  // ==================================
  // GENERATE pdf
  // ==================================
  generatePdf() {

    //'p', 'mm', 'a4'

    let doc = new jsPDF('landscape');
    let col = ["#", "Fecha", "Nombre", "Correo", "Celular", "F. Nacimiento", "Genero", "Establecimiento",
      "Sede", "Usabilidad", "Monto"];
    let rows = [];
    let auxrow = [];
    this.newdateArray.map((user, i) => {
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

  SeachingRange() {

    const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
    const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');

    this.from = fromdate;
    this.to = todate;

    const mydateFrom = new Date(this.from);
    const mydateTo = new Date(this.to);

    this.newdateArray = [];

    this.usergetting.forEach(user => {

      const userdate = new Date(user.registerDate)

      if (userdate >= mydateFrom && userdate <= mydateTo) {
        this.newdateArray.push(user)
      }
    });
  }

  // ==========================
  // function clear data
  // ==========================
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

    this.newdateArray = [];
    this.newdateArray = this.usergetting;
    this.newdateArray.forEach(item => item.selected = false)
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getToday();
    this.SeachingRange();

  }

}
