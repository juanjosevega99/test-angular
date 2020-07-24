import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-accompaniment',
  templateUrl: './accompaniment.component.html',
  styleUrls: ['./accompaniment.component.scss']
})
export class AccompanimentComponent implements OnInit {
  @Input() groupName:string = ''
  @Input() multipleOption:boolean = false
  @Output() AddAcompaniment = new EventEmitter<any>()

  dataSource = new MatTableDataSource<any>()

  nameAccompaniment:string = ''
  priceAccompaniment:number = 0

  displayedColumns: string[] = ['name', 'price', 'action'];
  elementsTable = []

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  addAcompanimentSubmit() {
    const data = this.dataSource.data
    data.push({ name: this.nameAccompaniment, price: this.priceAccompaniment })
    this.dataSource.data = data
    this.AddAcompaniment.emit(data)

    this.nameAccompaniment = ''
    this.priceAccompaniment = 0
  }
}
