import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-accompaniment',
  templateUrl: './accompaniment.component.html',
  styleUrls: ['./accompaniment.component.scss']
})
export class AccompanimentComponent implements OnInit {
  @Input() groupName:string
  @Input() multiple:boolean
  @Input() detail:[] = []
  @Input() indexArrayGroup:number
  @Output() AddAcompanimentEmmiter = new EventEmitter<any>()
  @Output() deleteGroupEmmiter = new EventEmitter<any>()

  dataSource = new MatTableDataSource<any>()

  nameAccompaniment:string = ''
  priceAccompaniment:number = 0

  displayedColumns: string[] = ['name', 'price', 'action'];
  elementsTable = []

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('this.detail', this.detail)
    this.dataSource.data = this.detail
  }

  addAcompanimentSubmit() {
    const data = this.dataSource.data
    data.push({ name: this.nameAccompaniment, price: this.priceAccompaniment })
    this.dataSource.data = data

    const toEmit = { indexArrayGroup: this.indexArrayGroup, data }
    this.AddAcompanimentEmmiter.emit(toEmit)

    this.nameAccompaniment = ''
    this.priceAccompaniment = 0
  }

  removeProduct(index) {
    const data = this.dataSource.data
    data.splice(index, 1)
    this.dataSource.data = data

    const toEmit = { indexArrayGroup: this.indexArrayGroup, data }
    this.AddAcompanimentEmmiter.emit(toEmit)
  } 

  deleteGroup() {
    this.deleteGroupEmmiter.emit(this.indexArrayGroup)
  }
}
