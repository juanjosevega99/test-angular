import { Component, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core'
import { FormGroup, FormControl, NgModel } from '@angular/forms'
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common';

import { AccompanimentComponent } from '../../../../components/accompaniment/accompaniment.component'
import { DynamicAccompanimentDirective } from '../../../../directives/dynamic-accompaniment.directive'

import { AccompanimentsService } from '../../../../services/accompaniments.service'


@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent implements OnInit {
  dishId: any = null
  accompanimentsGlobal:Array<any> = []
  groupName:string
  groupNameTosend:string = ''
  indexArrayGroup:number = null
  multiple:boolean = false

  @ViewChild(DynamicAccompanimentDirective, { static: false }) public dynamicAccompaniment:DynamicAccompanimentDirective

  constructor(private route: ActivatedRoute, 
    public componentFactoryResolver:ComponentFactoryResolver, 
    public accompanimentsService: AccompanimentsService,
    private _location: Location) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dishId = params.id
      this.getExistingByDishId(this.dishId)
    })
  }

  goBack() {
    this._location.back()
  }

  addGroup() {
    this.indexArrayGroup = 0

    const dataToGroupAccompaniment = {
      groupName: this.groupName,
      multiple:  this.multiple,
      indexArrayGroup: 0,
      status: 'ACTIVE',
      detail: []
    }

    console.log('dataToGroupAccompaniment', dataToGroupAccompaniment)

    this.accompanimentsGlobal.push(dataToGroupAccompaniment)

    dataToGroupAccompaniment.indexArrayGroup = this.accompanimentsGlobal.length - 1

    this.createComponentAccompaniment(dataToGroupAccompaniment)

    this.groupName = ''
    this.multiple = false
  }

  updateInfo(data) {
    console.log('data', data)
    this.receiveInfo(data)
    console.log('this.accompanimentsGlobal', this.accompanimentsGlobal)
    this.accompanimentsGlobal[data.indexArrayGroup].detail = data.data
    console.log('DATA GLOBAl', this.accompanimentsGlobal)
  }

  receiveInfo(data) {
    console.log('data', data)
  }

  createComponentAccompaniment(data) {
    console.log('data', data)

    const component = this.componentFactoryResolver.resolveComponentFactory(AccompanimentComponent)
    const componentRef = this.dynamicAccompaniment.viewContainerRef.createComponent(component)

    componentRef.instance.groupName = data.groupName
    componentRef.instance.multiple = data.multiple
    componentRef.instance.indexArrayGroup = data.indexArrayGroup
    componentRef.instance.detail = data.detail

    componentRef.instance.AddAcompanimentEmmiter.subscribe(data => {
      this.updateInfo(data)
    })

    componentRef.instance.deleteGroupEmmiter.subscribe( data => {
      this.accompanimentsGlobal[data].status = 'INACTIVE'
      componentRef.destroy()
    })
  }

  saveAll() {
    Swal.fire({
      title: "Desea guardar todos los cambios",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, Guardar',
      cancelButtonText: "No"

    }).then( async res => {
      if (res.value) {
        console.log('toSave', this.accompanimentsGlobal)
        try {
          const response = await this.accompanimentsService.createAccompaniments(this.dishId, this.accompanimentsGlobal).toPromise()

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Guardado correctamente!!',
            showConfirmButton: false,
            timer: 1500
          })

        } catch (error) {
          Swal.fire(
            'Error!',
            error.message,
            'error'
          )
        }
      }
    })
  }

  async getExistingByDishId (dishId) {
    // consume service
    try {
      const accompaniments:any = await this.accompanimentsService.getByDishId(dishId).toPromise()

      for (const accompaniment of accompaniments) {
        this.indexArrayGroup = 0

        const dataToGroupAccompaniment = {
          groupName: accompaniment.groupName,
          multiple:  accompaniment.multiple,
          indexArrayGroup: 0,
          status: 'ACTIVE',
          detail: accompaniment.detail
        }
    
        this.accompanimentsGlobal.push(dataToGroupAccompaniment)
    
        dataToGroupAccompaniment.indexArrayGroup = this.accompanimentsGlobal.length - 1
    
        this.createComponentAccompaniment(dataToGroupAccompaniment)
      }
    } catch (error) {
      alert('Error al consumir el servicio' + error )
    }
  }
}