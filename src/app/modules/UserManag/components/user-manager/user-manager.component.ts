import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
 
  from: string;
  to: string;

  users = [
    {
      date: '2020-02-01', name: 'Andrea', email: 'john@example.com', cellphone: '3245672341', birthday: '09/01/1997',
      gender: 'femenino', establishment: 'KFC', headquart: 'Galerías', usability: '1', quantity: '$12.000'
    },

    {
      date: '2020-02-02', name: 'Kenny', email: 'mary@mail.com', cellphone: '3125672341', birthday: '19/01/1995',
      gender: 'femenino', establishment: 'KFC', headquart: 'Centro', usability: '1', quantity: '$12.000'
    },

    {
      date: '2020-02-03', name: 'Ana', email: 'july@greatstuff.com', cellphone: '3214577223', birthday: '11/05/1945',
      gender: 'femenino', establishment: 'Corral', headquart: 'Galerías', usability: '1', quantity: '$12.000'
    },

    {
      date: '2020-02-04', name: 'Sofia', email: 'a_r@test.com', cellphone: '3214577223', birthday: '1999-03-19',
      gender: 'femenino', establishment: 'Corral', headquart: 'Centro', usability: '1', quantity: '$12.000'
    },

    {
      date: '2019-02-01', name: 'Edwin', email: 'a_r@test.com', cellphone: '3145332122', birthday: '2013-02-07',
      gender: 'masculino', establishment: 'Corral', headquart: 'Norte', usability: '0', quantity: '$12.000'
    },

    {
      date: '2018-02-01', name: 'Isabella', email: 'a_r@test.com', cellphone: '3245672341', birthday: '1992-01-05',
      gender: 'femenino', establishment: 'Qbano', headquart: 'Galerías', usability: '1', quantity: '$12.000'
    },

    {
      date: '2018-02-05', name: 'kenny', email: 'a_r@test.com', cellphone: '3245672341', birthday: '1995-06-25',
      gender: 'femenino', establishment: 'Qbano', headquart: 'Galerías', usability: '1', quantity: '$12.000'
    },

    {
      date: '2018-02-05', name: 'kenny', email: 'a_r@test.com', cellphone: '3245672341', birthday: '1994-05-15',
      gender: 'femenino', establishment: 'kfc', headquart: 'Galerías', usability: '1', quantity: '$12.000'
    },

  ]

  newdateArray: {
    date: string, name: string, email: string, cellphone: string, birthday: string, gender: string, establishment: string,
    headquart: string, usability: string, quantity: string
  }[] = this.users;


  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) { }

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

    const mydateFrom = new Date(this.from);
    const mydateTo = new Date(this.to);

      this.newdateArray = [];

      this.users.forEach(user => {

        const userdate = new Date(user.date)

        if (userdate >= mydateFrom && userdate <= mydateTo) {
          this.newdateArray.push(user)
        }
      });
  }


  clear() {
    this.fromDate = null;
    this.toDate = null;
    this.newdateArray = this.users;
  }
  

  search( termino?: string, id?:string ) {

    if (this.fromDate && this.toDate) {

      if (termino) {
        termino = termino.toLowerCase();

        const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
        const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');
        this.SeachingRange(fromdate, todate);

        const aux = this.newdateArray;
        this.newdateArray = [];

        aux.forEach(user => {
          if (user[id].toLowerCase().indexOf(termino) >= 0) {
            this.newdateArray.push(user)
          }

        });

      } else {

        const fromdate = [this.fromDate.year, this.fromDate.month, this.fromDate.day].join('-');
        const todate = [this.toDate.year, this.toDate.month, this.toDate.day].join('-');
        this.SeachingRange(fromdate, todate);

      }


    } else {

      if (termino) {
        termino = termino.toLowerCase();

        this.newdateArray = [];

        this.users.forEach(user => {

          if (user[id].toLowerCase().indexOf(termino) >= 0) {
            this.newdateArray.push(user)
          }

        });

      } else {
        this.newdateArray = this.users;
      }
    }
  }


  searchbyterm(termino:string){
    console.log(termino);
    termino = termino.toLowerCase();

    this.newdateArray = [];

    var myRegex = new RegExp('.*' + termino + '.*','gi'); 

    this.newdateArray = this.users.filter(function(item){
      //We test each element of the object to see if one string matches the regexp.
      return (myRegex.test(item.date) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.cellphone) || myRegex.test(item.birthday) ||myRegex.test(item.gender) ||
      myRegex.test(item.establishment) ||myRegex.test(item.headquart) ||myRegex.test(item.usability) ||myRegex.test(item.quantity) )
  
  });
    
  }

}
