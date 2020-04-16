import { Component, OnInit } from '@angular/core';
import { SectionsService } from "src/app/services/sections.service";
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { AccompanimentsService } from 'src/app/services/accompaniments.service';


@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent implements OnInit {

  //variables for the form
  addForm: FormGroup;
  rows: FormArray; //Object that saves all the values of the form
  itemForm: FormGroup;
  withCost: boolean;
  preparationTimeArray1: any[] = [];
  preparationTimeArray2: {
    number: '',
    unity: 'minutos'
  };

  //arrays to save the states
  stateA: any[] = [];
  stateI: any[] = [];

  //Object that saves all the values of the form
  /* preAccompaniments: Object = {A
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
  } */

  //variables for sections
  sections: any[] = [];
  sectionSelected: String = null;
  sectionId: String = null;
  sectiontoUpdate = {};

  //variables for personalize the name of section
  /* arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;
  personalizeSections : any[] = []; */

  //variable for preparation time
  time: String[] = [];

  //variables for tick
  date: string;
  times: string;
  today: Date;
  //variables of idAlly
  idAlly: number;

  constructor(private sectionService: SectionsService,
    private accompanimentService: AccompanimentsService,
    private fb: FormBuilder, private _router: Router,
    private _activateRoute: ActivatedRoute) {
    //get Ally's parameter
    this._activateRoute.params.subscribe(params => {
      console.log('Parametro', params['id']);
      this.idAlly = params['id']
    });
    //inicialization for the table
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);

    //preparation time
    this.time = ['minutos', 'horas']

    //inicialization service with collections dishes-categories
    this.sectionService.getSections().subscribe(section => {
      this.sections = section;
    })

    //inicialization of states
    this.stateA = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]
    this.stateI = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]

    //inialization of preparation time
    this.preparationTimeArray1 = [{
      number: null,
      unity: 'minutos'
    }]

    this.preparationTimeArray2 = {
      number: '',
      unity: 'minutos'
    }
  }

  ngOnInit() {
    setInterval(() => this.tick(), 1000);
    /* this.addForm.get("items").valueChanges.subscribe(val => {
      if (val === true) {
        this.addForm.get("items_value").setValue("yes");

        this.addForm.addControl('rows', this.rows);
      }
      if (val === false) {
        this.addForm.get("items_value").setValue("no");
        this.addForm.removeControl('rows');
      }
    }); */
  }

  goBackCreateDish() {
    this._router.navigate(['/main', 'createDish', this.idAlly])
  }

  //Method to remove the rows
  removeRows() {
    this.addForm.removeControl('rows');
  }

  //Method to set the section selected
  seeValue(name: String, id: String) {
    this.sectionSelected = name;
    console.log(id);

    this.sectiontoUpdate = { name: name, id: id }
  }

  //Method for see the id of the section selected
  seeIdSection(sectionSelected) {
    this.sectionService.getSections().subscribe(section => {
      this.sections = section;
      this.sections.forEach((element: any) => {
        let sec: any = {
          id: element.id,
          name: element.name,
        }
        if (sec.name == sectionSelected) {
          this.sectionId = element.id
        }
      })
    })
  }

  //Method for saving the state of the type of cost
  check(event) {
    this.withCost = event.target.checked;
  }

  //Method for saving the active state
  checkActive(event, value: String) {
    const check = event.target.checked;
    const active = {
      state: value,
      check: check
    }
    this.stateA[0] = active
  }

  //Method for saving the inactive state
  checkInactive(event, value: String) {
    const check = event.target.checked;
    const inactive = {
      name: value,
      state: check
    }
    this.stateI[1] = inactive
  }

  //Method to save the values of preparation time
  seeunity(number) {
    let numbe = [{
      number: number,
      unity: 'minutos'
    }]
    console.log(numbe);
    this.preparationTimeArray1 = numbe
    console.log(this.preparationTimeArray1);
    /* this.fb['preparationTime'] = numbe */
  }

  preparationTime(num, unity) {
    let preparationTimeArray = {
      number: num,
      unity: unity
    }
    this.preparationTimeArray2.number = preparationTimeArray.number
    this.preparationTimeArray2.unity = preparationTimeArray.unity
    /* this.rows.value['preparationTime'] = this.preparationTimeArray2 */
    console.log(this.preparationTimeArray2);
  }

  //Method for the admission date
  tick(): void {
    this.today = new Date();
    this.times = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    this.date = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    /* this.preDish['creationDate'] = this.date.concat("-",this.times) */
  }


  //Method for showing new view in the field of personalize section name
  /* handleBoxOther(): boolean {
    if (this.addcategoryButton) {
      return this.addcategoryButton = false,
        this.otherCategoryInput = true,
        this.selectAgainarray = true,
        this.arrayCategorySelect = false
    } else {
      return this.addcategoryButton = true,
        this.otherCategoryInput = false,
        this.selectAgainarray = false,
        this.arrayCategorySelect = true
    }
  } */

  //CRD -- Methos of sections: CREATE ,READ, UPDATE AND DELETE 
  addSection(name: String) {
    let newitem = name;
    let newCategory: object = {
      name: newitem
    }
    this.swallSaveOtherSection(newCategory)
  }

  updateSection(sectionUpdated: String) {
    let itemUpdated = sectionUpdated;
    let sectionEdited: object = {
      name: itemUpdated
    }
    this.swallUpdateSection(this.sectiontoUpdate, sectionEdited)
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
      preparationTimeNumber: null,
      preparationTimeUnity: null,
      numberOfModifications: 0,
      state: [],
      typeOfAccompaniment: false,
      accompanimentValue: null,
      idTypeSection: null,
      nameTypeSection: null
    });
  }

  //sweet alerts
  saveAccompaniments() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar estos nuevos acompañamientos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        console.log(this.rows.value);
        this.rows.value.forEach(res => {
          this.accompanimentService.postAccompaniment(res).subscribe(res => {
            Swal.fire(
              'Guardado!',
              'Tu(s) acompañamiento(s) ha(n) sido creado(s)',
              'success',
            )
          })
        })
      }


    })
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
        this.sectionService.putSection(sectionSelected.id, newCategory).subscribe(res => {
          this.sectionService.getSections().subscribe(section => {
            this.sections = section
          })
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
