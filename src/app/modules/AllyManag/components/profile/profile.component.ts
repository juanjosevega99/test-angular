import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { Profiles } from 'src/app/models/Profiles';
import { ProfileList } from 'src/app/models/ProfileList';
import { ProfilesService } from 'src/app/services/profiles.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  users:any = []

  //object that saves the values of the table
  table: FormGroup;

  //variables for general search
  generalsearch: string = "";

  //varibales to obtain data
  profilesgetting: ProfileList[] = [];
  newArray = this.profilesgetting;
  newArrarSearch: Profiles[] = [];
  filteredArray: ProfileList[] = [];
  headquarterId: string

  //variables of allyId
  allyId: number;

  //flag loading
  loading= false;
  noProfiles: boolean;
  noResults: boolean;

  constructor(private profilesService: ProfilesService,
    private _router: Router,
    private _activateRoute: ActivatedRoute) {

    this.headquarterId = localStorage.getItem('headquarterId')

    this.table = new FormGroup({
      "identification": new FormControl(),
      "name": new FormControl(),
      "general": new FormControl()
    })
    //get Ally's parameter
    this._activateRoute.params.subscribe(params => {
      //console.log('Parametro', params['id']);
      this.allyId = params['id']
    });

    
    this.noProfiles = false;
    this.noResults = false;
    this.loadProfiles();

  }

  ngOnInit() {
    this.getUsers()
  }

  async getUsers() {
    const users = await this.profilesService.getUsersByHeadQuarterId(this.headquarterId).toPromise()
    console.log('users', users)
    this.users = users
  }

  loadProfiles() {
    this.loading = true;
    this.profilesgetting = [];
    this.newArray = this.profilesgetting;

    //inicialization of profiles
    this.profilesService.getAllUsersbyIdHeadquarter(localStorage.getItem("headquarterId")).subscribe(res => {
      if (Object.keys(res).length) {
        for (let x in res) {
          let profile: Profiles

          profile = res[x]

          const obj: ProfileList = {};
          obj._id = profile._id;
          obj.nameCharge = profile.nameCharge;
          obj.identification = profile.identification;
          obj.name = profile.name;
          obj.photo = profile.photo;
          obj.nameHeadquarter = profile.nameHeadquarter;
          obj.entryDate = this.convertDate(profile.entryDate);
          obj.modificationDate = this.convertDate(profile.modificationDate);
          obj.numberOfModifications = profile.numberOfModifications;
          obj.state = profile.state

          this.profilesgetting.push(obj)
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.noProfiles = true;
      }
    })
  }


  goBackHeadquarterOptions() {
    this._router.navigate(['/main', 'headquarts', this.allyId])
  }
  //method to convert the modification date
  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  //method for updating the state to active
  changeStateA(idProfile) {
    let newstate: object = {
      state: [{
        state: "active",
        check: true
      }, {
        state: "inactive",
        check: false
      }]
    }
    this.swallUpdateState(idProfile, newstate)
  }

  //method for updating the state to inactive
  changeStateI(idProfile) {
    let newstate: object = {
      state: [{
        state: "active",
        check: false
      }, {
        state: "inactive",
        check: true
      }]
    }
    this.swallUpdateState(idProfile, newstate)
  }

  //method for a specific search
  search(termino?: string, id?: string) {

    let objsearch = {
      identification: "",
      name: ""
    };


    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        objsearch[i] = this.table.value[i];
      } else {
        this.noResults = true;
      }
    }

    // let for general searhch
    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    this.newArray = this.profilesgetting.
      filter(function (dish) {
        if (dish["name"].toLowerCase().indexOf(this.name) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["identification"].toLowerCase().indexOf(this.identification) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.nameCharge) || myRegex.test(item.identification) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.entryDate) || myRegex.test(item.modificationDate) ||
          myRegex.test(item.numberOfModifications.toString()))
      })

  }


  //sweets alerts
  swallUpdateState(idProfile, newState) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas actualizar el estado de este perfil!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this.loading = true
        this.profilesService.putProfile(idProfile, newState).subscribe(res => {
          this.loadProfiles()
        })
        Swal.fire({
          text: "Estado actualizado!!",
          icon: 'success',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      } else {
        this.loading = true;
        this.loadProfiles();
      }
    })
  }
}
