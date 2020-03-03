import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class SwallServicesService {

  constructor() { }

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
}
