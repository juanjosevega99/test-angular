import { Component, OnInit } from '@angular/core';
import { SectionsService } from "src/app/services/sections.service";
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { AccompanimentsService } from 'src/app/services/accompaniments.service';
import { Accompaniments } from 'src/app/models/Accompaniments';


@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent implements OnInit {

  //variables for the form
 /*  addForm: FormGroup;
  rows: FormArray; */ //Object that saves all the values of the form
 /*  itemForm: FormGroup;*/
  withCost: boolean;
  idSec: string; 

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

  //variables for the table
  editField: string;
  personList: Array<any> = []
  awaitingPersonList: Array<any> = [
    { id: null, name: 'new', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },]

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
   /*  this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });

    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows); */

     //inicialization of accompaniments created
    /*  this.accompanimentService.getAccompaniments().subscribe(accompaniments=>{
      accompaniments.forEach(items =>{
       let obj:any=[]
      obj.quantity= items.quantity,
      obj.unitMeasurement= items.unitMeasurement,
      obj.name= items.name,
      obj.preparationTimeNumber = items.preparationTimeNumber,
      obj.preparationTimeUnity= items.preparationTimeUnity,
      obj.numberOfModifications= items.numberOfModifications,
      obj.state= items.state,
      obj.typeOfAccompaniment= items.typeOfAccompaniment,
      obj.accompanimentValue= items.accompanimentValue,
      obj.idTypeSection= items.idTypeSection,
      obj.nameTypeSection = items.nameTypeSection

      this.rows = this.fb.array(obj);
      this.addForm.addControl('rows', this.rows);
      })
   }) */

     //inicialization of accompaniments
     this.accompanimentService.getAccompaniments().subscribe(res=>{
      res.forEach(accompaniment=>{
        let obj: any={}

        obj.id = accompaniment.id
        obj.quantity = accompaniment.quantity
        obj.unitMeasurement = accompaniment.unitMeasurement
        obj.name = accompaniment.name
        obj.nameTypeSection = accompaniment.nameTypeSection
        obj.typeOfAccompaniment = accompaniment.typeOfAccompaniment
        obj.preparationTimeNumber = accompaniment.preparationTimeNumber
        obj.preparationTimeUnity = accompaniment.preparationTimeUnity
        obj.accompanimentValue = accompaniment.accompanimentValue

        let cd = accompaniment.creationDate
        const d = new Date(cd);
        obj.creationDate = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });

        let md = accompaniment.modificationDate
        const m = new Date(md);
        obj.modificationDate = m.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });

        obj.state = accompaniment.state

        this.personList.push(obj)
      })
    })


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

  updateList(id: number, property: string, event: any) {
    /* let editField = event.target.textContent;
    this.personList[id][property] = editField;
    editField = null;
    console.log(event.target.textContent); */
    
  }

  remove(id: any) {
    this.awaitingPersonList.push(this.personList[id]);
    this.personList.splice(id, 1);
  }

  add() {
    const obj =  { id: null, quantity: '',unitMeasurement:'', name: '', nameTypeSection: '',typeOfAccompaniment:'', preparationTimeNumber: null,
    preparationTimeUnity: '',accompanimentValue:'', creationDate:'', modificationDate:'', state:'' };
    this.personList.push(obj);
    /* if (this.awaitingPersonList.length > 0) {
      const person = this.awaitingPersonList[0];
      this.personList.push(person);
      this.awaitingPersonList.splice(0, 1);
    } */
  }

  changeValue(id: number, property: string, event: any) {
    let editField = event.target.textContent;
    this.personList[id][property] = '';
    this.personList[id][property] = editField;

   /*  this.editField = event.target.textContent;
    console.log(this.editField); */
    
  }


  //Method to remove the rows
  /* removeRows() {
    this.addForm.removeControl('rows');
  } */

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

  seeid(id) {
    this.sectionService.getSections().subscribe(res => {
      res.forEach(section => {
        if (id == section.name) {
          this.idSec = section.id
        }
      })
    })
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
/*   onAddRow() {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      quantity: ['', Validators.required],
      unitMeasurement: null,
      name: null,
      preparationTimeNumber: null,
      preparationTimeUnity: 'minutos',
      numberOfModifications: 0,
      state: [],
      typeOfAccompaniment: false,
      accompanimentValue: null,
      idTypeSection: null,
      nameTypeSection: null
    });
  } */

  //sweet alerts
  /* saveAccompaniments() {
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
            
            Swal.fire({
              title: 'Guardado',
              text: "Tu(s) nuevo(s) acompañamiento(s) ha(n) sido creado(s)!",
              icon: 'warning',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            }
            )
          })
        })
      }


    })
  } */
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
