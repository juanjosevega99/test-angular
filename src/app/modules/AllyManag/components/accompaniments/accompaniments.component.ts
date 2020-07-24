import { Component } from '@angular/core'
import { FormGroup, FormControl, NgModel } from '@angular/forms'
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router'


@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent {
  groupName:string
  dataToGroupAccompaniment: {}
  groupNameTosend:string = ''
  multipleOption:boolean = false

  constructor() {}

  goBack() {}

  addGroup() {
    this.dataToGroupAccompaniment = {
      groupName: this.groupName,
      multipleOption:  this.multipleOption
    }

    this.groupName = ''
    this.multipleOption = ''

  }

  updateInfo(data) {
    console.log('DATA', data)
  }
}