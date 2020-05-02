import { Component, OnInit, OnDestroy } from '@angular/core';
import { SectionsService } from "src/app/services/sections.service";
import Swal from 'sweetalert2';
import { FormBuilder, } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { AccompanimentsService } from 'src/app/services/accompaniments.service';
import { Accompaniments } from 'src/app/models/Accompaniments';
import { PromotionsService } from 'src/app/services/promotions.service';
import { Promotions } from 'src/app/models/Promotions';
import { DishesService } from 'src/app/services/dishes.service';
import { Location } from '@angular/common';
import { Dishes } from 'src/app/models/Dishes';


@Component({
  selector: 'app-accompaniments',
  templateUrl: './accompaniments.component.html',
  styleUrls: ['./accompaniments.component.scss']
})
export class AccompanimentsComponent implements OnInit, OnDestroy {

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

  //variables of dish
  identificatorDish: string;
  flagDish: boolean;
  dishSelected: Dishes;

  //variable for the loading
  loading: boolean;

  timetick: any;

  constructor(private sectionService: SectionsService, private promoService: PromotionsService,
    private accompanimentService: AccompanimentsService, private _router: Router, private dishService: DishesService,
    private _activateRoute: ActivatedRoute, private _location: Location) {


    //get Ally's parameter
    this._activateRoute.params.subscribe(params => {
      console.log('Parametro', params['id']);
      if (params['id'] >= 0) {
        this.flagDish = true;
        this.identificatorDish = params['id'];
        this.getDish();
      } else if (params['id'] != "") {
        this.flagDish = false;
        this.idPromo = params['id'];
        this.getPromo();
      }
    });

    //inicialization of accompaniments
    this.accompanimentService.getAllAccompanimentsByAlly(localStorage.getItem("idAlly")).subscribe(res => {
    
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
    //  this.timetick = setInterval(() => this.tick(), 1000);
    this.tick();
  }

  ngOnDestroy() {
    // clearTimeout(this.timetick);
  }

  //method to convert date from type Date to string
  convertDate(date: Date): string {
    let result
    const d = new Date(date);
    result = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    return result
  }

  goBack() {
    this._location.back();
  }

  //==========
  //DISHES
  //=========

  //get accompaniments of dish
  getDish() {
    this.getPromo();
  }

  //======================
  //PROMOTIONS AND DISHES
  //======================

  //get promotion with the param
  getPromo() {
    this.accompanimetsOfPromo = [];
    if (this.identificatorDish) {
      this.dishService.getDishes().subscribe(dishes => {
        this.dishSelected = dishes[this.identificatorDish]
        this.accompanimentService.getAccompaniments().subscribe(res => {
          res.forEach((accomp: Accompaniments) => {
            if (this.dishSelected.idAccompaniments.length) {
              for (let index = 0; index < this.dishSelected.idAccompaniments.length; index++) {
                const element = this.dishSelected.idAccompaniments[index];
                if (accomp.id == element) {

                  this.accompanimetsOfPromo[index] = accomp
                  this.accompanimetsOfPromo[index].creationDate = this.convertDate(accomp.creationDate)
                  this.accompanimetsOfPromo[index].modificationDate = this.convertDate(accomp.modificationDate)

                }
              }
            }
          })
        })
      })
    } else {
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
                  }
                }
              })
            })
          }
        })
      })
    }
  }

  //selected one item for add an accompaniments
  selectedOne(event, pos: number) {
    
    const checked = event.target.checked;
    event.target.checked = checked;

    let section: string;
    if (this.identificatorDish) {
      section = "este plato!";
    } else {
      section = "esta promoción!";
    }

    Swal.fire({
      title: 'Estás seguro?',
      html: "de que deseas añadir este accompañamiento a " + `${section}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, añadir!'
    }).then((result) => {
      if (result.value) {
        let dish = this.personList[pos];
        let id = dish.id
        if (this.identificatorDish) {
          let accompExist = this.dishSelected['idAccompaniments'].indexOf(id); // it's -1 if not exist
          if (accompExist < 0) {
            this.dishSelected['idAccompaniments'].push(id);
            this.dishService.putDishe(this.dishSelected.id, this.dishSelected).subscribe(res => {
              this.swallAdd();
            })
          } else {
            this.swallExist();
          }
        }
        else {
          let accompExist = this.promotion['idAccompaniments'].indexOf(id);
          if (accompExist < 0) {
            this.promotion['idAccompaniments'].push(id)
            this.promoService.putPromotion(this.promotion.id, this.promotion).subscribe(res => {
              this.swallAdd();
            })
          } else {
            this.swallExist();
          }
        }
      }
    })
  }

  swallAdd() {

    let section: string;
    if (this.identificatorDish) {
      section = "este plato!";
    } else {
      section = "esta promoción!";
    }

    Swal.fire({
      title: 'Añadido',
      text: "El acompañamiento ha sido añadido a " + `${section}`,
      icon: 'warning',
      confirmButtonColor: '#542b81',
      confirmButtonText: 'Ok!'
    }).then((result) => {
      if (result.value) {
        this.promoAccompaniments = true
      }
    })
  }

  swallExist() {
    Swal.fire({
      text: "El acompañamiento ya está asociado!",
      icon: 'error',
      confirmButtonColor: '#542b81',
      confirmButtonText: 'Ok!'
    })
  }

  //remove accompaniment of promotion or dish
  removeAccompanimentOfPromo(id) {

    let section: string;
    if (this.identificatorDish) {
      section = "este plato!";
    } else {
      section = "esta promoción!";
    }

    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este accompañamiento de " + `${section}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        let idAccompaniment = this.accompanimetsOfPromo[id].id

        if (this.identificatorDish) {
          let idsAccompanimentDish = this.dishSelected.idAccompaniments;
          for (let index = 0; index < idsAccompanimentDish.length; index++) {
            const element = idsAccompanimentDish[index];
            if (element == idAccompaniment) {
              idsAccompanimentDish.splice(index, 1)
              let newids: any = {
                idAccompaniments: idsAccompanimentDish
              }
              this.dishService.putDishe(this.dishSelected.id, newids).subscribe(res => {
                this.swallDelete();
              })
            }
          }
        } else {
          let idsAccompanimentPromo = this.promotion.idAccompaniments;
          for (let index = 0; index < idsAccompanimentPromo.length; index++) {
            const element = idsAccompanimentPromo[index];
            if (element == idAccompaniment) {
              idsAccompanimentPromo.splice(index, 1)
              let newids: any = {
                idAccompaniments: idsAccompanimentPromo
              }
              this.promoService.putPromotion(this.promotion.id, newids).subscribe(res => {
                this.swallDelete();
              })
            }
          }
        }  
      }
    })
  }

  swallDelete(){

    let section: string;
    if (this.identificatorDish) {
      section = "este plato!";
    } else {
      section = "esta promoción!";
    }

    Swal.fire({
      title: 'Eliminado',
      text: "El acompañamiento ha sido eliminado de " + `${section}`,
      icon: 'warning',
      confirmButtonColor: '#542b81',
      confirmButtonText: 'Ok!'
    }).then((result) => {
      if (result.value) {
        this.promoAccompaniments = true
      }
    })
  }

  //method fot the button "No hay acompañamientos", remove all the accompaniments of the promo or dish
  removeAllAccompanimentOfPromo() {
    if(this.identificatorDish){
      if (!this.dishSelected.idAccompaniments.length) {
        this.swallNoAccomp();
      } else {
        Swal.fire({
          title: 'Estás seguro?',
          text: "de que deseas eliminar TODOS los accompañamientos de este plato!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#542b81',
          cancelButtonColor: '#542b81',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
          if (result.value) {
            let clearids: any = {
              idAccompaniments: this.dishSelected.idAccompaniments = []
            }
            this.dishService.putDishe(this.dishSelected.id, clearids).subscribe(res => {
              this.swalDeleteAll();
            })
          }
        })
      }
    } else {
      if (!this.promotion.idAccompaniments.length) {
        this.swallNoAccomp();
      } else {
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
            this.promoService.putPromotion(this.promotion.id, clearids).subscribe(res => {
              this.swalDeleteAll();
            })
          }
        })
      }
    }
  }

  swalDeleteAll(){

    let section: string;
    if (this.identificatorDish) {
      section = "este plato!";
    } else {
      section = "esta promoción!";
    } 

    Swal.fire({
      title: 'Eliminado',
      text: "Tus acompañamientos han sido eliminados de " + `${section}`,
      icon: 'warning',
      confirmButtonColor: '#542b81',
      confirmButtonText: 'Ok!'
    }).then((result) => {
      if (result.value) {
        this.promoAccompaniments = true
      }
    })
  }

  swallNoAccomp(){

    let section: string;
    if (this.identificatorDish) {
      section = "Este plato!";
    } else {
      section = "Esta promoción!";
    }

    Swal.fire({
      title: 'Error',
      text: `${section}`+ " no tiene acompañamientos!",
      icon: 'error',
      confirmButtonColor: '#542b81',
      confirmButtonText: 'ok!'
    })
  }

  //======================
  //GENERAL ACCOMPANIMENTS
  //======================

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
      if (termino.length >= 1) {
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
          modificationDate: new Date()
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
      }], idAllies: ''
    };
    this.newAccompanimentList.push(obj)
  }

  cancelAdd() {
    this.flag = false
    this.newAccompanimentList = []
  }

  changeValue(id: number, property: string, event: any) {
    console.log(event.target.textContent);
    let editField = event.target.textContent;

    const newtext = editField;

    // if(event.target.textContent){
    // this.personList[id][property] = this.personList[id][property] + editField;
    // }else{

    this.personList[id][property] = newtext;
    editField = '';

    // }

  }

  changeValueSelect1(id: number, property: string, value: string) {
    this.personList[id][property] = value;
  }

  changeValuecheck1(id: number, property: string, event: any) {

    let editField = event.target.checked;
    this.personList[id][property] = editField;

    // if (editField == true) {
    //   this.additionalCost = true
    // } else if (editField == false) {
    //   this.additionalCost = false
    // }

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
    console.log("funtion tick");

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


  //==========================
  //SECTIONS OF ACCOMPANIMENTS
  //==========================

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
