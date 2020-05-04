import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//services
import Swal from 'sweetalert2';
import { SaveLocalStorageService } from "src/app/services/save-local-storage.service";
import { TermsAndConditionsService } from "src/app/services/terms-and-conditions.service"
import { TypeTermsAndConditionsService } from "src/app/services/type-terms-and-conditions.service";
@Component({
  selector: 'app-create-tyc',
  templateUrl: './create-tyc.component.html',
  styleUrls: ['./create-tyc.component.scss']
})
export class CreateTycComponent implements OnInit, OnDestroy {

  preTyc: Object = {
    name: null,
    idTypeTyc: null,
    nameTypeTyc: null,
    description: null
  }
  //variables for typeTyC
  newtypeTyC: String;
  typeTyC: any[] = [];

  //variables for receiving the coupon that will be edited
  identificatorbyRoot: any;
  idParams: number;
  buttonPut: boolean;

  //variable for the loading
  loading: boolean;

  constructor(private _router: Router,
    private activatedRoute: ActivatedRoute,
    private saveLocalStorageService: SaveLocalStorageService,
    private tycManagerService: TermsAndConditionsService,
    private typeTycService: TypeTermsAndConditionsService) {
    //flags
    this.loading = true;
    this.buttonPut = true;
    // obtain params for identification between create and edit
    this.activatedRoute.params.subscribe(params => {
      let idTyc = this.saveLocalStorageService.getLocalStorageIdTyc();
      let identificator = params['id']
      if (identificator != -1) {
        this.getTyc(idTyc)
      } else if (identificator == -1) {
        this.loading = false
        this.buttonPut = false
      }
      this.idParams = identificator
      this.identificatorbyRoot = idTyc
    })
    //inicialization service with collections typeTermsAndConditions
    this.typeTycService.getTypeTermsAndConditions().subscribe(typeTyC => {
      this.typeTyC = typeTyC;
      if (this.preTyc['idTypeTyc']) {
        var type = this.typeTyC.find(element => element.id === this.preTyc['idTypeTyc'])
        this.preTyc['idTypeTyc'] = type.id
      }
    })
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    localStorage.removeItem('idTyc');
  }
  goBackTycManger() {
    this._router.navigate(['/main', 'tycManager'])
  }

  seeNametypeTyC(selected: any) {

    this.typeTyC.forEach(element => {
      if (selected == element.id) {
        this.preTyc['nameTypeTyc'] = element.name

      }
    })
  }
 
  getTyc(idTyc: string) {
    this.loading
    this.tycManagerService.getTermAndConditionById(idTyc).subscribe(tyc => {
      this.preTyc = tyc
      this.loading = false;
    })
  }
  //save new Tyc
  saveTyc() {
    this.swallSaveTyc()
  }
  //sweet alerts for save and delete typeTyc
  swallSaveTypeTyc(newTypeTyc: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar este nuevo término y condición",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.typeTycService.postTypeTermsAndConditions(newTypeTyc).subscribe(() => {
          this.typeTycService.getTypeTermsAndConditions().subscribe(tyC => {
            this.typeTyC = tyC;
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nuevo término y condición ha sido creado',
          'success',
        )
      }
    })
  }
  swallDeleteTypeTyc(typeTycSelected: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas eliminar este término y condición!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.typeTycService.deleteTypeTermsAndConditions(typeTycSelected).subscribe(() => {
          this.typeTycService.getTypeTermsAndConditions().subscribe(tyC => {
            this.typeTyC = tyC;
          })
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }
  swallSaveTyc() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.tycManagerService.postTermAndCondition(this.preTyc).subscribe()

        Swal.fire({
          title: 'Guardado',
          text: "Tus nuevos términos y condiciones han sido creados!",
          icon: 'success',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/main', 'tycManager',]);
          }
        })
      }
    })
  }

  //swall for update collection tyc
  swallUpdateTyc() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        let objTyc: any = this.preTyc
        objTyc.id = this.identificatorbyRoot
        this.tycManagerService.putTermAndCondition(objTyc).subscribe()
        Swal.fire({
          title: 'Actualizado',
          text: "Tus nuevos términos y condiciones han sido actualizados!",
          icon: 'success',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/main', 'tycManager',]);
          }
        })

      }

    })

  }

}
