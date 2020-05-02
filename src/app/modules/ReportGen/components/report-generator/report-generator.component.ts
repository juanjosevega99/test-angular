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
//export table excel
import * as XLSX from 'xlsx';

import { AlliesService } from 'src/app/services/allies.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { environment } from 'src/environments/environment';
import { DishesService } from 'src/app/services/dishes.service';
import { ReportGenerate } from 'src/app/models/ReportGenerate';
import { ShowContentService } from '../../../../services/providers/show-content.service';
import { profileStorage } from 'src/app/models/ProfileStorage';


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

  // =====================
  // user perfil

  profile: profileStorage;

  reportComplete = false;
  reportSummary = false;


  /*name of the excel-file which will be downloaded. */
  fileName = 'generalReport.xlsx';

  //array for users of service
  usergetting: ReportGenerate[] = [];
  loadingUsers = false;

  //Array for filter
  newdateArray = this.usergetting;
  //variable para formatear los campos de la tabla
  table: FormGroup;



  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private userservice: UsersService, private orderservice: OrdersService, private headquartsservice: HeadquartersService,
    private allyservice: AlliesService, private dishService: DishesService, private showcontent: ShowContentService) {

    this.profile = this.showcontent.showMenus();
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getToday();

    this.loadUserAndOrders();
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
    this.SeachingRange();
  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toISOString().split("T")[0];
    return n;
  }

  convertDateToShow(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' }) + " " +
      d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // const n = date.toLocaleString('en-US', { hour12: true });
    return n;
  }

  loadUserAndOrders() {
    this.loadingUsers = true;

    this.orderservice.getOrdersByAlly(this.profile.idAllies).subscribe((orders: Orders[]) => {

      if (orders.length > 0) {

        orders.forEach((order: Orders, index) => {

          this.headquartsservice.getHeadquarterById(order.idHeadquartes).subscribe((headq: any) => {

            this.userservice.getUserById(order.idUser).subscribe((user: Users) => {

              const obj: ReportGenerate = {};

              if (headq) {

                obj.idHeadquarter = order.idHeadquartes;
                obj.location = headq.ubication;
                obj.codeOrder = order.code;
                obj.client = user.name + " " + user.lastname;
                obj.typeOfService = order.typeOfService['type'];
                obj.purchaseAmount = order.orderValue;
                obj.registerDate = this.convertDateToShow(order.dateAndHourReservation);
                obj.dateAndHourDelivery =  order.dateAndHourDelivey ? this.convertDateToShow(order.dateAndHourDelivey) : "Por confirmar";
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
                this.allyservice.getAlliesById(this.profile.idAllies).subscribe((ally: any) => {
                  obj.ally = ally.name;
                  obj.percent = ally.intermediationPercentage;
                  obj.valueIntermediation = parseFloat((ally.intermediationPercentage * (order.orderValue - obj.costReservationIva) / 100).toFixed());
                  let auxvalue = parseFloat((((order.orderValue - obj.costReservationIva) + ((order.orderValue - obj.costReservationIva) * environment.IVA)) * ally.intermediationPercentage / 100).toFixed());
                  obj.valueIntermediationIva = auxvalue;
                  obj.valueTotalIntRes = (obj.valueIntermediationIva + obj.costReservationIva);
                  obj.valueForAlly = (order.orderValue - (auxvalue + obj.costReservationIva));

                })

                // dish
                let namedsh = [];
                let valueDish = []
                let quanty = []
                order.idDishe.forEach((object: any) => {

                  quanty.push(object.quantity);

                  this.dishService.getDisheById(object.id).subscribe((dish: any) => {
                    if (dish) {

                      namedsh.push(dish.name);
                      valueDish.push(dish.price * object.quantity);
                    }

                  })
                  obj.nameDishe = namedsh;
                  obj.valueDishe = valueDish;
                  obj.quantity = quanty;

                })
              }

              this.usergetting.push(obj);
            })

          })

          if (index === (orders.length-1)) {
            this.loadingUsers = false;
          }

        })
      } else {
        this.loadingUsers = false;
      }
    })
  }

  // ==================================
  // GENERATE pdf
  // ==================================
  // summary cajero
  generatePdf() {

    //'p', 'mm', 'a4'

    let doc = new jsPDF('landscape', 'pt', 'legal');


    let col = ["C. Sede", "Establecimiento", "zona", "Codigo Pedido", "Cliente", "T. Servicio", "Valor Pedido", "F. H. Reserva",
      "F. H Entrega", "Control Pedidos", "cantidad/Plato"];
    let rows = [];
    let auxrow = [];
    let arraytopdf = [];

    this.newdateArray.forEach((obj: ReportGenerate) => {
      let objpdf: any = {};
      let auxnamearray = []

      obj.nameDishe.map((name, i) => {
        let auxname = obj.quantity[i] + "-" + name;
        auxnamearray.push(auxname);
      })

      objpdf.idHeadquarter = obj.idHeadquarter.slice(17, obj.idHeadquarter.length);
      objpdf.ally = obj.ally;
      objpdf.location = obj.location;
      objpdf.codeOrder = obj.codeOrder;
      objpdf.client = obj.client;
      objpdf.typeOfService = obj.typeOfService;
      objpdf.purchaseAmount = obj.purchaseAmount;
      objpdf.registerDate = obj.registerDate;
      objpdf.dateAndHourDelivery = obj.dateAndHourDelivery;
      objpdf.controlOrder = obj.controlOrder ? "SI" : "NO";
      // objpdf.quantity = obj.quantity;
      // objpdf.nameDishe = obj.nameDishe;

      objpdf.nameDishe = auxnamearray;
      // objpdf.valueDishe = obj.valueDishe;
      // objpdf.costReservationIva = obj.costReservationIva;
      // objpdf.valueTotalWithRes = obj.valueTotalWithRes;
      // objpdf.valueTotalWithoutRes = obj.valueTotalWithoutRes;
      // objpdf.costReservation = obj.costReservation;
      // objpdf.percent = obj.percent;
      // objpdf.valueIntermediation = obj.valueIntermediation;
      // objpdf.valueIntermediationIva = obj.valueIntermediationIva;
      // objpdf.valueTotalIntRes = obj.valueTotalIntRes;
      // objpdf.valueForAlly = obj.valueForAlly;

      arraytopdf.push(objpdf);
    })

    arraytopdf.map((user, i) => {
      auxrow = [];
      // auxrow[0] = i + 1;
      for (const key in user) {
        if (user.hasOwnProperty(key)) {

          auxrow.push(user[key]);
        }
      }
      rows.push(auxrow);
    });

    //build the pdf file
    doc.setFontSize(10);
    doc.autoTable(col, rows, {
      // theme: "grid",
      styles: { halign: 'center', columnWidth: 'auto', minCellWidth: 50 }
    });

    let name = "Reporte " + new Date().toLocaleString() + '.pdf'
    doc.save(name);
  }


  generateReportPDVPdf() {

    //'p', 'mm', 'a4'

    let doc = new jsPDF('landscape', 'pt', 'legal');


    let col = ["C. Sede", "Establecimiento", "zona", "Codigo Pedido", "Cliente", "T. Servicio", "Valor Pedido", "F. H. Reserva",
      "F. H Entrega", "Control Pedidos", "cantidad/Plato", "V. unidad", "Costo reserva IVA", "valor T. con-reserva", "valor T. sin-reserva"];
    let rows = [];
    let auxrow = [];
    let arraytopdf = [];

    this.newdateArray.forEach((obj: ReportGenerate) => {
      let objpdf: any = {};
      let auxnamearray = []

      obj.nameDishe.map((name, i) => {
        let auxname = obj.quantity[i] + "-" + name;
        auxnamearray.push(auxname);
      })

      objpdf.idHeadquarter = obj.idHeadquarter.slice(17, obj.idHeadquarter.length);
      objpdf.ally = obj.ally;
      objpdf.location = obj.location;
      objpdf.codeOrder = obj.codeOrder;
      objpdf.client = obj.client;
      objpdf.typeOfService = obj.typeOfService;
      objpdf.purchaseAmount = obj.purchaseAmount;
      objpdf.registerDate = obj.registerDate;
      objpdf.dateAndHourDelivery = obj.dateAndHourDelivery;
      objpdf.controlOrder = obj.controlOrder ? "SI": "NO";
      // objpdf.quantity = obj.quantity;
      // objpdf.nameDishe = obj.nameDishe;

      objpdf.nameDishe = auxnamearray;
      objpdf.valueDishe = obj.valueDishe;
      objpdf.costReservationIva = obj.costReservationIva;
      objpdf.valueTotalWithRes = obj.valueTotalWithRes;
      objpdf.valueTotalWithoutRes = obj.valueTotalWithoutRes;
      // objpdf.costReservation = obj.costReservation;
      // objpdf.percent = obj.percent;
      // objpdf.valueIntermediation = obj.valueIntermediation;
      // objpdf.valueIntermediationIva = obj.valueIntermediationIva;
      // objpdf.valueTotalIntRes = obj.valueTotalIntRes;
      // objpdf.valueForAlly = obj.valueForAlly;

      arraytopdf.push(objpdf);
    })

    arraytopdf.map((user, i) => {
      auxrow = [];
      // auxrow[0] = i + 1;
      for (const key in user) {
        if (user.hasOwnProperty(key)) {

          auxrow.push(user[key]);
        }
      }
      rows.push(auxrow);
    });

    //build the pdf file
    doc.setFontSize(10);
    doc.autoTable(col, rows, {
      // theme: "grid",
      styles: { halign: 'center', columnWidth: 'auto', minCellWidth: 50 }
    });

    let name = "Reporte " + new Date().toLocaleString() + '.pdf'
    doc.save(name);
  }

  // ============================
  // excel

  generateExcel() {

    /* table id is passed over here */
    let element = document.getElementById('excel-table-general');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }


  SeachingRange() {

    this.loadingUsers = true;
    const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
    const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');

    this.from = fromdate;
    this.to = todate;

    const mydateFrom = new Date(this.from);
    const mydateTo = new Date(this.to);

    this.newdateArray = [];

    this.usergetting.forEach((user, index) => {

      let date = user.registerDate.split(" ")[0].split("/").reverse().join("-");

      const userdate = new Date(date)

      if (userdate >= mydateFrom && userdate <= mydateTo) {
        this.newdateArray.push(user)
      }

      if (index == (this.usergetting.length - 1)) {
        this.loadingUsers = false;
      }
    });

  }

  // ==========================
  // function clear data
  // ==========================
  clear() {

    this.newdateArray = [];
    this.newdateArray = this.usergetting;
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getToday();
    this.SeachingRange();

  }

}
