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

@Component({
  selector: 'app-pqr-list',
  templateUrl: './pqr-list.component.html',
  styleUrls: ['./pqr-list.component.scss']
})
export class PqrListComponent implements OnInit {
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
  generalsearch: string;
  table: FormGroup;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private pqrlistservice: PqrsService) {

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

   this.pqrlistservice.getPqrs().subscribe(res=>{
     console.log(res);
     if (res.length > 0) {

      const obj: Pqrs = {};

      res.forEach((order: any) => {
        obj.id = order.id,
        obj.date = this.convertDate( order.date );
        obj.nameUser = order.nameUser;
        obj.email = order.email;
        obj.phone = order.phone;
        obj.birthday = this.convertDate( order.birthday);
        obj.gender = order.gender;
        obj.nameAllie = order.nameAllie;
        obj.nameHeadquarter = order.nameHeadquarter;

      },
      this.usergetting.push(obj)
      )

    }
     
   })
    
   }

  ngOnInit() {
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


// ================================
// filters
// ================================

SeachingRange(dateFrom: string, dateTo: string) {

  this.from = dateFrom;
  this.to = dateTo;

  const mydateFrom = new Date(this.from);
  const mydateTo = new Date(this.to);

  if (!this.filteredArray.length) {

    this.newdateArray = [];

    this.usergetting.forEach(user => {

      const userdate = new Date(user.date)

      if (userdate >= mydateFrom && userdate <= mydateTo) {
        this.newdateArray.push(user)
      }
    });

  } else {

    this.newdateArray = [];

    this.filteredArray.forEach(user => {
      const userdate = new Date(user.date)
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
        console.log(id);
        

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
        return (myRegex.test(item.date) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
          myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter))

      });
    } else {

      this.newdateArray = this.usergetting.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.date) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
          myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter))

      });
      this.filteredArray = this.usergetting.filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.date) || myRegex.test(item.name) || myRegex.test(item.email) || myRegex.test(item.phone) || myRegex.test(item.birthday) || myRegex.test(item.gender) ||
          myRegex.test(item.nameAllie) || myRegex.test(item.nameHeadquarter))

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


// ===========================
// convert date
// ===========================


convertDate(date: Date): string {
  let n:string;
  try{

    const d = new Date(date);
    n = d.toISOString().split("T")[0];
  }catch{
    console.log(date);
    
  }
  return n;
}


}

  
