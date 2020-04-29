import { Component, OnInit } from '@angular/core';
import { SectionsService } from "src/app/services/sections.service";
import Swal from 'sweetalert2';
import { FormBuilder, } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { AccompanimentsService } from 'src/app/services/accompaniments.service';
import { Accompaniments } from 'src/app/models/Accompaniments';
import { PromotionsService } from 'src/app/services/promotions.service';
import { Promotions } from 'src/app/models/Promotions';


@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent implements OnInit {

  withCost: boolean;
  idSec: string;


  //variables for the table
  editField: string;
  dishgetting: Array<any> = []
  personList = this.dishgetting;
  newAccompanimentList: Array<any> = []
  flag: boolean
  additionalCost: boolean
  acti: boolean
  inacti: boolean
  /* 
  dishgetting: DishPromotion[] = [];
  dishPromoArray = this.dishgetting; */

  //variables for the filter
  generalsearch: string;
  terminoaux = '';
  newArrarSearch: Accompaniments[] = [];
  filteredArray: Accompaniments[] = []

  //variables for sections
  sections: any[] = [];
  sectionSelected: String = null;
  sectionId: String = null;
  sectiontoUpdate = {};

  //variable for preparation time
  time: String[] = [];

  //variables for tick
  date: string;
  times: string;
  today: Date;

  //variables of Promo
  idPromo: string;
  promotion: Promotions;
  accgetting: any[] = [];
  accompanimetsOfPromo = this.accgetting
  promoAccompaniments: boolean;

  constructor(private sectionService: SectionsService, private promoService: PromotionsService,
    private accompanimentService: AccompanimentsService, private _router: Router,
    private _activateRoute: ActivatedRoute) {

    //get Ally's parameter
    this._activateRoute.params.subscribe(params => {
      console.log('Parametro', params['id']);
      this.idPromo = params['id']
      this.getPromo()
    });

    //inicialization of accompaniments
    this.accompanimentService.getAllAccompanimentsByAlly(localStorage.getItem("idAlly")).subscribe(res => {
      console.log("rta:",res);
      
      for (let x in res) {
        let accompaniment;
        if (res != []) {
          accompaniment = res[x]
      /* res.forEach(accompaniment => { */
        let obj: any = {}

        obj.id = accompaniment._id
        obj.quantity = accompaniment.quantity
        obj.unitMeasurement = accompaniment.unitMeasurement
        obj.name = accompaniment.name
        obj.nameTypeSection = accompaniment.nameTypeSection
        obj.typeOfAccompaniment = accompaniment.typeOfAccompaniment
        obj.preparationTimeNumber = accompaniment.preparationTimeNumber
        obj.preparationTimeUnity = accompaniment.preparationTimeUnity
        obj.accompanimentValue = accompaniment.accompanimentValue
        obj.numberOfModifications = accompaniment.numberOfModifications
        obj.creationDate = this.convertDate(accompaniment.creationDate);
        obj.modificationDate = this.convertDate(accompaniment.modificationDate)
        obj.state = accompaniment.state

        this.personList.push(obj)
      }
    }
    })

    this.flag = false
    this.additionalCost = false
    this.acti = false
    this.inacti = false
    this.promoAccompaniments = true

    //preparation time
    this.time = ['minutos', 'horas']

    //inicialization service with collections dishes-categories
    this.sectionService.getSections().subscribe(section => {
      this.sections = section;
    })
  }

  ngOnInit() {
    setInterval(() => this.tick(), 1000);
  }

  //method to convert date from type Date to string
  convertDate(date: Date): string {
    let result
    const d = new Date(date);
    result = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    return result
  }

  goBackCreateDish() {
    this._router.navigate(['/main', 'createDish', this.idPromo])
  }

  //get promotion with the param
  getPromo() {
    this.promoService.getPromotions().subscribe(res => {
      res.forEach((promo: Promotions) => {
        if (this.idPromo == promo.reference) {
          this.promotion = promo
          this.accompanimentService.getAccompaniments().subscribe(res => {
            res.forEach((accomp: Accompaniments) => {
              for (let index = 0; index < promo.idAccompaniments.length; index++) {
                const element = promo.idAccompaniments[index];
                if (accomp.id == element) {
                  this.accompanimetsOfPromo[index] = accomp
                  this.accompanimetsOfPromo[index].creationDate = this.convertDate(accomp.creationDate)
                  this.accompanimetsOfPromo[index].modificationDate = this.convertDate(accomp.modificationDate)
                  console.log(this.accompanimetsOfPromo);
                }
              }
            })
          })
        }
      })
    })
  }

  //selected one item for add an accompaniments
  selectedOne(event, pos: number) {
    console.log(pos);
    
    const checked = event.target.checked;
    event.target.checked = checked;
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas añadir este accompañamiento a esta promoción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, añadir!'
    }).then((result) => {
      if (result.value) {
        let dish = this.personList[pos];
        let id = dish.id
        this.promotion['idAccompaniments'].push(id)
        this.promoService.putPromotion(this.promotion.id, this.promotion).subscribe(res => {
          Swal.fire({
            title: 'Añadido',
            text: "Tu acompañamiento ha sido añadido a la promoción!",
            icon: 'warning',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.value) {
              this.promoAccompaniments = true
            }
          })
        })
      }
    })
  }

  //remove accompaniment of promotion
  removeAccompanimentOfPromo(id) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este accompañamiento de esta promoción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        let idAccompaniment = this.accompanimetsOfPromo[id].id
        let idsAccompanimentPromo = this.promotion.idAccompaniments
        for (let index = 0; index < idsAccompanimentPromo.length; index++) {
          const element = idsAccompanimentPromo[index];
          if (element == idAccompaniment) {
            idsAccompanimentPromo.splice(index, 1)
            let newids: any = {
              idAccompaniments: idsAccompanimentPromo
            }
            this.promoService.putPromotion(this.promotion.id, newids).subscribe(res => {
              Swal.fire({
                title: 'Eliminado',
                text: "Tu acompañamiento ha sido eliminado de la promoción!",
                icon: 'warning',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              }).then((result) => {
                if (result.value) {
                  this.promoAccompaniments = true
                }
              })
            })
          }
        }
      }
    })
  }

  //method fot the button "No hay acompañamientos", remove all the accompaniments of the promo
  removeAllAccompanimentOfPromo() {
    if(!this.promotion.idAccompaniments.length){
      Swal.fire({
        title: 'Error',
        text: "Esta promoción no tiene acompañamientos!",
        icon: 'warning',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'ok!'
      })
    }else{
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar TODOS los accompañamientos de esta promoción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        let clearids: any = {
          idAccompaniments: this.promotion.idAccompaniments = []
        }
        this.promoService.putPromotion(this.promotion.id,clearids).subscribe(res=>{
          Swal.fire({
            title: 'Eliminado',
            text: "Tus acompañamientos han sido eliminados de la promoción!",
            icon: 'warning',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.value) {
              this.promoAccompaniments = true
            }
          })
        })
      }
    })
  } 
  }

  //see accompaniments of the promotion
  back() {
    this.promoAccompaniments = true
  }
  //see the general list of accompaniments
  seeList() {
    this.promoAccompaniments = false
  }

  //method for general searching 
  searchbyterm(termino: string) {
    termino = termino.toLowerCase();
    var myRegex = new RegExp('.*' + termino + '.*', 'gi');
    if (this.promoAccompaniments == true) {
      if (termino.length > 1) {
        this.accompanimetsOfPromo = this.accgetting.filter(function (item) {
          return myRegex.test(item.name)
        });
        this.filteredArray = this.accompanimetsOfPromo;
      } else {
        this.filteredArray = this.accgetting;
        this.accompanimetsOfPromo = this.filteredArray
      }
    } else {
      if (termino.length > 1) {
        this.personList = this.dishgetting.filter(function (item) {
          return myRegex.test(item.name)
        });
        this.filteredArray = this.personList;
      } else {
        this.filteredArray = this.dishgetting;
        this.personList = this.filteredArray
      }
    }
  }

  //CRUD ACCOMPANIMENTS

  remove(id: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este accompañamiento!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        let dish = this.personList[id];
        this.accompanimentService.deleteAccompaniment(dish.id).subscribe(res => {
          this.personList.splice(id, 1);
          Swal.fire(
            'Eliminado!',
            'success',
          )
        })
      }
    })
  }

  update(id: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas actualizar este accompañamiento!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        let dish = this.personList[id];
        let accompaniment = {
          quantity: dish.quantity,
          unitMeasurement: dish.unitMeasurement,
          name: dish.name,
          state: dish.state,
          nameTypeSection: dish.nameTypeSection,
          typeOfAccompaniment: dish.typeOfAccompaniment,
          preparationTimeNumber: dish.preparationTimeNumber,
          preparationTimeUnity: dish.preparationTimeUnity,
          accompanimentValue: dish.accompanimentValue,
          numberOfModifications: dish.numberOfModifications + 1,
          modificationDate: this.today
        }
        this.accompanimentService.putAccompaniment(dish.id, accompaniment).subscribe(res =>
          Swal.fire({
            title: 'Actualizado',
            text: "Tu nuevo acompañamiento ha sido actualizado!",
            icon: 'warning',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.value) {
              this.flag = false
            }
          })
        )
      }
    })

  }

  addNewAcc() {
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
        console.log(this.newAccompanimentList);
        this.newAccompanimentList.forEach(res => {
          res.idAllies = localStorage.getItem("idAlly")
          this.accompanimentService.postAccompaniment(res).subscribe((accomp: any) => {
            accomp.creationDate = this.convertDate(accomp.creationDate)
            accomp.modificationDate = this.convertDate(accomp.modificationDate)
            this.personList.push(accomp)
            this.flag = false
            Swal.fire({
              title: 'Guardado',
              text: "Tu(s) nuevo(s) acompañamiento(s) ha(n) sido creado(s)!",
              icon: 'warning',
              confirmButtonColor: '#542b81',
              confirmButtonText: 'Ok!'
            })
            this.newAccompanimentList = []
          })
        })
      }
    })
  }

  //Methods for accompaniments
  add() {
    this.flag = true
    const obj = {
      id: '', quantity: '', unitMeasurement: '', name: '', nameTypeSection: 'Bebida', typeOfAccompaniment: false, preparationTimeNumber: "tiempo", numberOfModifications: 0,
      preparationTimeUnity: 'minutos', accompanimentValue: 0, state: [{
        state: "active",
        check: false
      }], idAllies:''
    };
    this.newAccompanimentList.push(obj)
  }

  cancelAdd() {
    this.flag = false
    this.newAccompanimentList = []
  }

  changeValue(id: number, property: string, event: any) {
    let editField = event.target.textContent;
    this.personList[id][property] = editField;
  }

  changeValueSelect1(id: number, property: string, value: string) {
    console.log(value);
    this.personList[id][property] = value;
  }

  changeValuecheck1(id: number, property: string, event: any) {
    let editField = event.target.checked;
    this.personList[id][property] = editField;
    if (editField == true) {
      this.additionalCost = true
    } else if (editField == false) {
      this.additionalCost = false
    }
  }

  changeValue2(id: number, property: string, event: any) {
    let editField = event.target.textContent;
    this.newAccompanimentList[id][property] = editField;
  }

  changeValueSelect(id: number, property: string, value: string) {
    console.log(value);
    this.newAccompanimentList[id][property] = value;
  }

  changeValuecheck(id: number, property: string, event: any) {
    let editField = event.target.checked;
    this.newAccompanimentList[id][property] = editField;
    if (editField == true) {
      this.additionalCost = true
    } else if (editField == false) {
      this.additionalCost = false
    }
  }

  changeStateA(id: number, property: string, event) {
    this.newAccompanimentList[id][property][0]["check"] = !this.newAccompanimentList[id][property][0]["check"];
  }

  changeStateI(id: number, property: string, event) {
    this.personList[id][property][0]["check"] = !this.personList[id][property][0]["check"];
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
