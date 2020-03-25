import { Component, OnInit } from '@angular/core';
import { SectionsService } from "src/app/services/sections.service";
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'


@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent implements OnInit {
  addForm: FormGroup;

  rows: FormArray;
  itemForm: FormGroup;


  //Object that saves all the values of the form
  preAccompaniments: Object = {
    quantity: null,
    unitMeasurement: null,
    name: null,
    preparationTime: [],
    numberOfModifications: null,
    state: null,
    typeOfAccompaniment: null,
    accompanimentValue: null,
    idTypeSection: null,
    nameTypeSection: null
  }

  //variables for sections
  sections: any[] = [];
  sectionSelected: String = null;
  sectiontoUpdate={};

  //variable for preparation time
  time: String[] = [];

  constructor(private sectionService: SectionsService, private fb: FormBuilder) {
    //inicialization for the table
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this.fb.array([]);

    //preparation time
    this.time = ['minutos', 'horas']

    //inicialization service with collections dishes-categories
    this.sectionService.getSections().subscribe(section => {
      this.sections = section;
    })

  }

  ngOnInit() {
    this.addForm.get("items").valueChanges.subscribe(val => {
      if (val === true) {
        this.addForm.get("items_value").setValue("yes");

        this.addForm.addControl('rows', this.rows);
      }
      if (val === false) {
        this.addForm.get("items_value").setValue("no");
        this.addForm.removeControl('rows');
      }
    });
  }

  //Method to set the section selected
  seeValue(name: String,id:String) {
    this.sectionSelected = name;
    this.sectiontoUpdate ={name:name,id:id}
    this.preAccompaniments['nameTypeSection'] = this.sectionSelected
  }

  //CRD -- Methos of sections: CREATE ,READ, UPDATE AND DELETE 
  addSection(name: String) {
    let newitem = name;
    let newCategory: object = {
      name: newitem
    }
    this.swallSaveOtherSection(newCategory)
  }

  updateSection(sectionUpdated:String) {
    let itemUpdated = sectionUpdated;
    let sectionEdited: object = {
      name: itemUpdated
    }
    this.swallUpdateSection(this.sectiontoUpdate,sectionEdited)
  }

  deleteSection() {
    this.swallDeleteSection(this.sectionSelected)
  }

  //Methods for the table add, remove and create item
  onAddRow() {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      quantity: null,
      unitMeasurement: null,
      name: null,
      preparationTime: [],
      numberOfModifications: null,
      state: null,
      typeOfAccompaniment: null,
      accompanimentValue: null,
      idTypeSection: null,
      nameTypeSection: null
    });
  }

  //Sweet alert for adding a new section
  swallSaveOtherSection(newCategory: any) {
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
          this.sectionService.getSections().subscribe(section => {
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

  swallUpdateSection(sectionSelected: any, newCategory: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas actualizar el nombre de esta sección!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this.sectionService.putSection(sectionSelected.id,newCategory).subscribe(res=>{
          this.sectionService.getSections().subscribe(section => {
            this.sections = section})
        })
        Swal.fire(
          'Actualizado!',
          'success',
        )
      }
    })
  }


  swallDeleteSection(sectionSelected: String) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar esta sección!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.sectionService.getSections().subscribe(section => {
          this.sections = section;
          this.sections.forEach((element: any) => {
            let sec: any = {
              id: element.id,
              name: element.name,
            }
            if (sec.name == sectionSelected) {
              this.sectionService.deleteSection(sec.id).subscribe(() => {
                this.sectionService.getSections().subscribe(sections => {
                  this.sections = sections;
                })
              })
            }
          })
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }
}
