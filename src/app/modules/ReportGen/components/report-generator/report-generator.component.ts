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
import { AlliesService } from 'src/app/services/allies.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { environment } from 'src/environments/environment';
import { DishesService } from 'src/app/services/dishes.service';
import { ReportGenerate } from 'src/app/models/ReportGenerate';


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
  usergetting: ReportGenerate[] = [];

  //Array for filter
  newdateArray = this.usergetting;
  //variable para formatear los campos de la tabla
  table: FormGroup;


  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private userservice: UsersService, private orderservice: OrdersService, private headquartsservice: HeadquartersService,
    private allyservice: AlliesService, private dishService: DishesService) {

    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getToday();


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

            order.forEach((order: Orders) => {
              const obj: ReportGenerate = {};

              // in this place get headquarts by id
              this.headquartsservice.getHeadquarterById(order.idHeadquartes).subscribe(
                (headq: any) => {

                  obj.idHeadquarter = order.idHeadquartes;
                  obj.location = headq.ubication;
                  obj.codeOrder = order.code;
                  obj.client = user.name;
                  obj.typeOfService = order.typeOfService;
                  obj.purchaseAmount = order.orderValue;
                  obj.registerDate = this.convertDate(order.dateAndHourReservation);
                  obj.dateAndHourDelivery = this.convertDate(order.dateAndHourDelivey);
                  obj.controlOrder = order.deliveryStatus;
                  obj.valueTotalWithRes = order.orderValue;
                  
                  headq.costPerService.map(service => {
                    if (service.id == order.typeOfService) {
                      obj.costReservation = parseFloat((parseInt(service.value) - (parseInt(service.value) * environment.IVA)).toFixed());
                      obj.costReservationIva = parseFloat(service.value);
                      obj.valueTotalWithoutRes = (order.orderValue - service.value); 
                    }
                  })

                  // ally
                  this.allyservice.getAlliesById(order.idAllies).subscribe((ally: any) => {
                    obj.ally = ally.name;
                    obj.percent = ally.intermediationPercentage;
                    obj.valueIntermediation = parseFloat((ally.intermediationPercentage * (order.orderValue - obj.costReservationIva) / 100).toFixed());
                    let auxvalue = parseFloat((((order.orderValue - obj.costReservationIva) + ((order.orderValue - obj.costReservationIva) * environment.IVA)) * ally.intermediationPercentage / 100).toFixed());
                    obj.valueIntermediationIva = auxvalue;
                    obj.valueTotalIntRes = (obj.valueIntermediationIva + obj.costReservationIva);
                    obj.valueForAlly = (order.orderValue - ( auxvalue + obj.costReservationIva ));
                  })

                  // dish
                  let namedsh = [];
                  let valueDish = []
                  let quanty = []
                  order.idDishe.forEach((object: any) => {

                    quanty.push(object.quantity);
                    
                    this.dishService.getDisheById(object.id).subscribe((dish: any) => {
                      namedsh.push(dish.name);

                      valueDish.push(dish.price * object.quantity );
                    })
                    obj.nameDishe = namedsh;
                    obj.valueDishe = valueDish;
                    obj.quantity = quanty;

                  })

                }
              )

              this.usergetting.push(obj);
            })
            console.log("buscando");

            this.SeachingRange();
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

    let col = ["#","C. Sede", "Establecimiento", "zona", "C. Pedido", "Cliente", "T. servicio", "Valor Pedido", "F. H. Reserva",
      "F. H Entrega", "Control Pedidos", "Cantidad/Plato", "V. unidad", "Costo reserva IVA", "valor T. con-reserva", "valor T. sin-reserva", 
      "Costo reserva sin IVA", "% Intermediación", "Valor Intermediación sin IVA", "Valor Intermediación IVA", "Valor T. Intermediación y Reserva", "Valor a pagar-Aliado",];
    let rows = [];
    let auxrow = [];
    
    this.newdateArray.map((user, i) => {
      auxrow = [];
      auxrow[0] = i + 1;
      for (const key in user) {
        if (user.hasOwnProperty(key)) {

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
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getToday();
    this.SeachingRange();

  }

}
