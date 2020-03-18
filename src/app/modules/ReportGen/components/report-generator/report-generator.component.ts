import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { OrderByUser } from 'src/app/models/OrderByUser';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { OrdersService } from 'src/app/services/orders.service';
import { Orders } from 'src/app/models/Orders';
import { Users } from 'src/app/models/Users';


@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.scss']
})
export class ReportGeneratorComponent implements OnInit {
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

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

        this.orderservice.getChargeByUserId(user.id).subscribe((order:Orders[]) => {
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
          }})
      })
    })
    // this.orderservice.getChargeById("5e71213d87554272c6efd980").subscribe(res =>console.log(res))
    

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

}
