import { Component, OnInit } from '@angular/core';
import { AccompanimentsService } from 'src/app/services/accompaniments.service';
import { Accompaniments } from 'src/app/models/Accompaniments';

@Component({
  selector: 'app-tyc-manager',
  templateUrl: './tyc-manager.component.html',
  styleUrls: ['./tyc-manager.component.scss'],
})

export class TycManagerComponent {


  editField: string;
  personList: Array<any> = [
   /*  { id: 1, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
    { id: 2, name: 'Guerra Cortez', age: 45, companyName: 'Insectus', country: 'USA', city: 'San Francisco' },
    { id: 3, name: 'Guadalupe House', age: 26, companyName: 'Isotronic', country: 'Germany', city: 'Frankfurt am Main' },
    { id: 4, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
    { id: 5, name: 'Elisa Gallagher', age: 31, companyName: 'Portica', country: 'United Kingdom', city: 'London' }, */
  ];

  awaitingPersonList: Array<any> = [
  
    { id: null, name: 'new', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
    { id: null, name: '', preparationTimeNumber: null, nameTypeSection: '', preparationTimeUnity: '', quantity: '' },
   
    /* { id: 7, name: 'Mike Low', age: 22, companyName: 'Lou', country: 'USA', city: 'Los Angeles' },
    { id: 8, name: 'John Derp', age: 36, companyName: 'Derping', country: 'USA', city: 'Chicago' },
    { id: 9, name: 'Anastasia John', age: 21, companyName: 'Ajo', country: 'Brazil', city: 'Rio' },
    { id: 10, name: 'John Maklowicz', age: 36, companyName: 'Mako', country: 'Poland', city: 'Bialystok' }, */
  ];

  constructor(private accompanimentsService: AccompanimentsService) { 

    //inicialization of accompaniments
    this.accompanimentsService.getAccompaniments().subscribe(res=>{
      res.forEach(accompaniment=>{
        let obj: Accompaniments={}
        obj.id = accompaniment.id
        obj.name = accompaniment.name
        obj.preparationTimeNumber = accompaniment.preparationTimeNumber
        obj.nameTypeSection = accompaniment.nameTypeSection
        obj.preparationTimeUnity = accompaniment.preparationTimeUnity
        obj.quantity = accompaniment.quantity
        this.personList.push(obj)
      })
    })

  }

  ngOnInit() { }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.personList[id][property] = editField;
  }

  remove(id: any) {
    this.awaitingPersonList.push(this.personList[id]);
    this.personList.splice(id, 1);
  }

  add() {
    if (this.awaitingPersonList.length > 0) {
      const person = this.awaitingPersonList[0];
      this.personList.push(person);
      this.awaitingPersonList.splice(0, 1);
    }
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  

}
