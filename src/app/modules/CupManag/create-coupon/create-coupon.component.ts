import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//services
import Swal from 'sweetalert2';
import { CouponsService } from "src/app/services/coupons.service";
import { TypeCouponService } from "src/app/services/typeCoupons.service";
//models
import { Coupons } from 'src/app/models/Coupons';
import { TypeCoupon } from "src/app/models/typeCoupons";
import { CouponList } from 'src/app/models/CouponList';
//import for images 
import { Guid } from "guid-typescript";
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  preCoupon: Object = {
    name: null,
    createDate: null,
    expirationDate: null,
    numberOfModifications: 0,
    nameAllies: null,
    nameHeadquarters: null,
    idtypeOfCoupon: null,
    nameTypeOfCoupon: null,
    description: null,
    imageCoupon: null,
    state: [],
    codeToRedeem: null,
    termsAndConditions: null,
    transferable: null,
    cumulative: null,
    idAllies: null,
    idHeadquarters: null,
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

  //variables for typeCoupon
  arrayTypeCouponSelect: boolean = true;
  otherTypeCouponInput: boolean = false;
  addTypeCouponButton: boolean = true;
  selectAgainarray: boolean = false;
  newTypeCoupon: String;
  typeCoupon: String[] = [];


  //variable for the state
  State: any[] = [];

  //variables for tick
  dateEntry: String;
  timesEntry: String;
  today: Date;

  newDate: Date;
  dateModication: String;
  timesModification: String;

  //variable for upload images
  fileImagedish: any;

  //variables for receiving the profile that will be edited
  identificatorbyRoot: any;
  // buttonPut: boolean;
  seeNewPhoto: boolean;
  //variable for the loading
  loading: boolean;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute, 
    private typeCouponService: TypeCouponService,
    private couponsServices: CouponsService) {
    //flags
    // this.loading = true;
    // this.buttonPut = true;
    this.seeNewPhoto = false;
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
    //inicialization service with collections typeCoupons
    this.typeCouponService.getTypeCoupon().subscribe( typeCoupon => {
      this.typeCoupon = typeCoupon;
      console.log(this.typeCoupon)
    })
  }

  ngOnInit() {
    setInterval(() => this.tick(), 1000);
  }
  goBackProfiles() {
    this._router.navigate(['/main', 'couponManager'])
  }
  
  seeIdTypeCoupon(selected: any) {
    
    this.typeCoupon.forEach((element: any) => {
      if (selected == element.name) {
        this.preCoupon['idtypeOfCoupon'] = element.id
      }
    })
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
  //Method for showing new view in the typeCoupon field
  handleBoxTypeCoupons(): boolean {

    if (this.addTypeCouponButton) {
      return this.addTypeCouponButton = false,
        this.otherTypeCouponInput = true,
        this.selectAgainarray = true,
        this.arrayTypeCouponSelect = false
    } else {
      return this.addTypeCouponButton = true,
        this.otherTypeCouponInput = false,
        this.selectAgainarray = false,
        this.arrayTypeCouponSelect = true
    }
  }
  //CRD -- Methos of TypeProfile: CREATE ,READ AND DELETE 
  addTypeCoupon(name: String) {
    if (name != null) {
      let newitem = name;
      let newTypeCoupon: object = {
        name: newitem
      }
      this.swallSaveTypeCoupon(newTypeCoupon)

      this.handleBoxTypeCoupons()
    } else { alert("Ingrese el nuevo cupon") }

  }

  deleteTypeCoupon() {
    let typeCouponSelected = this.preCoupon['idtypeOfCoupon']
    this.swallDeleteTypeCoupon(typeCouponSelected)
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
  //Method for photo of the dish
  onPhotoSelected($event) {
    let input = $event.target;
    if (input.files && input.files[0]) {
      this.seeNewPhoto = true;
      console.log(this.seeNewPhoto);

      var reader = new FileReader();
      reader.onload = function (e: any) {
        $('#photo')
          .attr('src', e.target.result)
      };
      reader.readAsDataURL(input.files[0]);
    }
    return this.fileImagedish = input.files[0]
  }
  // //save new profile
  // saveProfile() {
  //   // this.swallSave()
  // }
  //sweet alerts
  swallSaveTypeCoupon(newTypeCoupon: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar este nuevo cupon!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.typeCouponService.postTypeCoupon(newTypeCoupon).subscribe(() => {
          this.typeCouponService.getTypeCoupon().subscribe(typeCoupon => {
            this.typeCoupon = typeCoupon;
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nuevo cupon ha sido creado',
          'success',
        )
      }
    })
  }
  swallDeleteTypeCoupon(typeCouponSelected: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este cupon!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
      this.typeCouponService.deleteTypeCoupon(typeCouponSelected).subscribe(()=>{
        this.typeCouponService.getTypeCoupon().subscribe( typeCoupon => {
          this.typeCoupon = typeCoupon;
          console.log(this.typeCoupon)
        })
      })
        // this.typeCouponService.getTypeCoupon().subscribe(typeCoupon => {
        //   this.typeCoupon = typeCoupon;
        //   this.typeCoupon.forEach((element: any) => {
        //     let coupon: any = {
        //       id: element.id,
        //       name: element.name
        //     }
        //     if (coupon.name == typeCouponSelected) {
        //       this.typeCouponService.deleteTypeCoupon(coupon.id).subscribe(() => {
        //         this.typeCouponService.getTypeCoupon().subscribe(coupons => {
        //           this.typeCoupon = coupons;
        //         })
        //       })
        //     }
        //   });
        // })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }

}
