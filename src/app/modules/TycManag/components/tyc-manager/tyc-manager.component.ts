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

  

  constructor() { }

  ngOnInit() { }

}
