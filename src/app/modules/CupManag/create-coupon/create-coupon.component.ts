import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfilesService } from 'src/app/services/profiles.service';
import { ProfilesCategoriesService } from "src/app/services/profiles-categories.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Guid } from "guid-typescript";
import { ProfileList } from 'src/app/models/ProfileList';
import { Profiles } from 'src/app/models/Profiles';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  preCoupon: Object = {
    name: null,
    description: null,
    imageCoupon: null,
    typeOfCoupon: null,
    nameTypeOfCoupon: null,
    state: [],
    createDate: null,
    expirationDate: null,
    codeToRedeem: null,
    termsAndConditions: null,
    transferable: null,
    cumulative: null,
    idAllies: null,
    nameAllies: null,
    idHeadquarters: null,
    nameHeadquarters: null,
    idDishes: null,
    nameDishes: null,
    numberOfUnits: null,
    discountRate: null,
    creationTime: null,
    expirationTime: null,
    code: null,    // numberOfModifications: 0,
    // idAllies: null,
    // nameAllie: "kfc",
    // idHeadquarter: null,
    // nameHeadquarter: null,
    // idCharge: null,
    // nameCharge: null,
    // userCode: null,
    // permis: null,
    // identification: null,
    // email: null,
  }

  // editCoupon: Profiles = {
  //   state: [],
  //   entryDate: null,
  //   modificationDate: null,
  //   numberOfModifications: 0,
  //   idAllies: null,
  //   nameAllie: "kfc",
  //   idHeadquarter: null,
  //   nameHeadquarter: null,
  //   idCharge: null,
  //   nameCharge: null,
  //   userCode: null,
  //   permis: null,
  //   identification: null,
  //   name: null,
  //   email: null,
  //   photo: null
  // }
  //variable for the state
  State: any[] = [];

  //variables for tick
  dateEntry: String;
  timesEntry: String;
  today: Date;

  newDate: Date;
  dateModication: String;
  timesModification: String;

  //variables for receiving the profile that will be edited
  identificatorbyRoot: any;
  // buttonPut: boolean;
  // seeNewPhoto: boolean;
  //variable for the loading
  loading: boolean;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute, ) {
    //flags
    // this.loading = true;
    // this.buttonPut = true;
    // this.seeNewPhoto = false;
    this.State = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]

    this.preCoupon['state'] = this.State;

    this.activatedRoute.params.subscribe(params => {
      let identificator = params['id']
      if (identificator != -1) {
        // this.getProfile(identificator)
      } else if (identificator == -1) {
        // this.loading = false
        // this.buttonPut = false
      }
      this.identificatorbyRoot = identificator
    })
  }

  ngOnInit() {
  }
  goBackProfiles() {
    this._router.navigate(['/main', 'couponManager'])
  }
  //Method for selecting the state
  selectedState(valueA, checkedA, valueB, checkedB) {
    let fullstate: any = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }];

    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas colocar este estado al cupon!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.value) {
        fullstate = [
          { state: valueA, check: checkedA },
          { state: valueB, check: checkedB }]
        this.preCoupon['state'] = fullstate
      }
    })
  }
  //method for delete a profile
  deleteProfile() {
    if (this.identificatorbyRoot == -1) {
      Swal.fire('No puedes eliminar este perfil ya que no ha sido creado!!')
    } else {
      // this.chargeProfiles.getProfiles().subscribe(profiles => {
      //   let profile: ProfileList = {}
      //   profile = profiles[this.identificatorbyRoot]
      //   let realId = profile.id
      //   this.swallDelete(realId)
      // })
    }
  }
  //Metod for the admission and modification date
  tick(): void {
    if (this.identificatorbyRoot == -1) {
      this.today = new Date();
      this.timesEntry = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateEntry = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
      this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    }
    else {
      // this.today = new Date();
      // this.newDate = this.editProfile['entryDate']
      // const d = new Date(this.newDate);
      // this.timesEntry = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      // this.dateEntry = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
      // this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      // this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });

    }
  }
  //save new profile
  saveProfile() {
    // this.swallSave()
  }

}
