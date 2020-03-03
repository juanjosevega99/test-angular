import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-headquarters-options',
  templateUrl: './headquarters-options.component.html',
  styleUrls: ['./headquarters-options.component.scss']
})
export class HeadquartersOptionsComponent implements OnInit {

  Headquarters: String[] = [];

  constructor() { 
    this.Headquarters= ['Galerías','Centro','Sur','Plaza']

  }

  ngOnInit() {
  }

}
