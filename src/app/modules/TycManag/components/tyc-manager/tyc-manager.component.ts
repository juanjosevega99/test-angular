import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tyc-manager',
  templateUrl: './tyc-manager.component.html',
  styleUrls: ['./tyc-manager.component.scss'],
})

export class TycManagerComponent implements OnInit {

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  from: string;
  to: string;
  datos: any[] = [{ date: '2020-02-01' }, { date: '2020-02-02' }, { date: '2020-02-03' }, { date: '2020-02-04' }]
  newdateArray: { date: string }[] = [];

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
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

  SeachingRange(dateFrom: string, dateTo: string) {

    this.from = dateFrom;
    this.to = dateTo;

    console.log(this.from);
    console.log(this.to);

    const mydateFrom = new Date(this.from);
    const mydateTo = new Date(this.to);

    console.log(mydateFrom);
    console.log(typeof (mydateFrom));

    console.log(" from ", mydateFrom.toDateString());
    console.log(" to ", mydateTo.toDateString());

    /// comparando

    for (let i = 0; i < this.datos.length; i++) {
      const date = new Date(this.datos[i].date);
      if (date >= mydateFrom && date <= mydateTo) {
        this.newdateArray.push(this.datos[i]);
        console.log(date.toDateString(), " esta en el rago");
      }
      else{

        console.log(date.toDateString(), "no esta en el rango");
      }
    }
    this.datos = this.newdateArray;
    console.log(this.datos.length);
    this.newdateArray = [];

  }

}
