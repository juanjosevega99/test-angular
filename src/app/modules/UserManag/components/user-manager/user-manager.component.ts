import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormsModule } from '@angular/forms';

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
  searchdate =true;

  // data = [
  //   { date: string, name: string, email: string, cellphone: string, bornDate: string, gender: string, establishment: string,
  //     headquart: string, usability: string, quantity: string }
  // ]

  dataOrigi =[
    { date:'2020-02-01', name :'Andrea', email: 'john@example.com', cellphone:'3245672341', bornDate:'09/01/1997',
    gender:'femenino', establishment:'KFC', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2020-02-02', name :'Kenny', email: 'mary@mail.com', cellphone:'3125672341', bornDate:'19/01/1995',
    gender:'femenino', establishment:'KFC', headquart:'Centro', usability:'1', quantity:'$12.000' },

    { date:'2020-02-03', name :'Ana', email: 'july@greatstuff.com', cellphone:'3214577223', bornDate:'11/05/1945',
    gender:'femenino', establishment:'Corral', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2020-02-04', name :'Sofia', email: 'a_r@test.com', cellphone:'3214577223', bornDate:'3105672341',
    gender:'femenino', establishment:'Corral', headquart:'Centro', usability:'1', quantity:'$12.000' },

    { date:'2020-02-05', name :'Edwin', email: 'a_r@test.com', cellphone:'3145332122', bornDate:'3105672341',
    gender:'masculino', establishment:'Corral', headquart:'Norte', usability:'0', quantity:'$12.000' },

    { date:'2020-02-06', name :'Isabella', email: 'a_r@test.com', cellphone:'3245672341', bornDate:'3105672341',
    gender:'femenino', establishment:'Qbano', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2018-02-05', name :'kenny', email: 'a_r@test.com', cellphone:'3245672341', bornDate:'3105672341',
    gender:'femenino', establishment:'Qbano', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2018-02-05', name :'kenny', email: 'a_r@test.com', cellphone:'3245672341', bornDate:'3105672341',
    gender:'femenino', establishment:'kfc', headquart:'Galerías', usability:'1', quantity:'$12.000' },

  ]

  users = [
    { date:'2020-02-01', name :'Andrea', email: 'john@example.com', cellphone:'3245672341', bornDate:'09/01/1997',
    gender:'femenino', establishment:'KFC', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2020-02-02', name :'Kenny', email: 'mary@mail.com', cellphone:'3125672341', bornDate:'19/01/1995',
    gender:'femenino', establishment:'KFC', headquart:'Centro', usability:'1', quantity:'$12.000' },

    { date:'2020-02-03', name :'Ana', email: 'july@greatstuff.com', cellphone:'3214577223', bornDate:'11/05/1945',
    gender:'femenino', establishment:'Corral', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2020-02-04', name :'Sofia', email: 'a_r@test.com', cellphone:'3214577223', bornDate:'3105672341',
    gender:'femenino', establishment:'Corral', headquart:'Centro', usability:'1', quantity:'$12.000' },

    { date:'2019-02-01', name :'Edwin', email: 'a_r@test.com', cellphone:'3145332122', bornDate:'3105672341',
    gender:'masculino', establishment:'Corral', headquart:'Norte', usability:'0', quantity:'$12.000' },

    { date:'2018-02-01', name :'Isabella', email: 'a_r@test.com', cellphone:'3245672341', bornDate:'3105672341',
    gender:'femenino', establishment:'Qbano', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2018-02-05', name :'kenny', email: 'a_r@test.com', cellphone:'3245672341', bornDate:'3105672341',
    gender:'femenino', establishment:'Qbano', headquart:'Galerías', usability:'1', quantity:'$12.000' },

    { date:'2018-02-05', name :'kenny', email: 'a_r@test.com', cellphone:'3245672341', bornDate:'3105672341',
    gender:'femenino', establishment:'kfc', headquart:'Galerías', usability:'1', quantity:'$12.000' },

  ]

  newdateArray: { date: string, name: string, email: string, cellphone: string, bornDate: string, gender:string,
  establishment:string, headquart: string , usability: string , quantity: string }[] = [];

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

  SeachingRange(dateFrom: string, dateTo: string, tablefilter:any) { 
    // this.searchdate = false;

    this.from = dateFrom;
    this.to = dateTo;

    const mydateFrom = new Date(this.from);
    const mydateTo = new Date(this.to);

    /// comparando

    for (let i = 0; i < this.users.length; i++) {
      const date = new Date(this.users[i].date);
      if (date >= mydateFrom && date <= mydateTo) {
        this.newdateArray.push(this.users[i]);
        // console.log(date.toDateString(), " esta en el rago");
      }
      else{

        //  console.log(date.toDateString(), "no esta en el rango");
      }
    }

    this.users = this.newdateArray;
    
    // console.log(this.fromDate);
    // console.log(this.toDate );
    // console.log(this.newdateArray.length );
    // console.log(this.users.length );
    
    this.newdateArray = [];
    // console.log(this.newdateArray.length );
    console.log(tablefilter);
    
  
  }

  clear(){
    this.searchdate = !this.searchdate;
    this.users = this.dataOrigi ;
    this.newdateArray = [];

  }

}
