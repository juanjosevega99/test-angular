import { Component, OnInit } from '@angular/core';
import { SectionsService  } from "src/app/services/sections.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent implements OnInit {

  //variables for sections
  sections: any[] = [];



  constructor(private sectionService: SectionsService) {
    
     //inicialization service with collections dishes-categories
     this.sectionService.getSections().subscribe(section=>{
       this.sections = section;
     })
    }

  ngOnInit() {
  }

  //Method for add new section
  addSection(name: String){
    let newitem = name;
    let newCategory: object = {
      name: newitem
    }
    this.swallSaveOtherSection(newCategory)
  }

  //Sweet alert for adding a new section
  swallSaveOtherSection(newCategory:any){
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar esta nueva sección!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.sectionService.postSection(newCategory).subscribe(() => {
          this.sectionService.getSections().subscribe(section=>{
            this.sections = section;
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nueva sección ha sido creada',
          'success',
        )
      }
    })
  }

}
