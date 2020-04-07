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


  //variables for receiving the profile that will be edited
  identificatorbyRoot: any;
  // buttonPut: boolean;
  // seeNewPhoto: boolean;
  //variable for the loading
  // loading: boolean;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute, ) {
    //flags
    // this.loading = true;
    // this.buttonPut = true;
    // this.seeNewPhoto = false;
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
  //save new profile
  saveProfile() {
    // this.swallSave()
  }

}
