import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-sede',
  templateUrl: './add-sede.component.html',
  styleUrls: ['./add-sede.component.scss']
})
export class AddSedeComponent implements OnInit {

  sede:Object = new Object();

  constructor() { }

  ngOnInit() {
  }

}
