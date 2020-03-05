import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AlliesCategoriesService } from "./allies-categories.service";

@Injectable({
  providedIn: 'root'
})

export class SwallServicesService {

  constructor(private alliesCatServices : AlliesCategoriesService) {

   }

  saveChanges(){
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Guardado!',
          'Tu nueva sede ha sido creada',
          'success',
        )
      }
    })
  }

  cancel(){
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas cancelar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Cancelado!',
          'success',
        )
      }
    })
  }
  deleteAllyCategory(id:string){
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Cancelado!',
          'success',
        )
        this.alliesCatServices.deleteAllieCategorie(id).subscribe(message => {
            alert('allies categories delete')
          })
      }
    })
  }
}

  
