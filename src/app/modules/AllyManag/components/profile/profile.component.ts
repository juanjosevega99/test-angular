import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { Profiles } from 'src/app/models/Profiles';
import { ProfileList } from 'src/app/models/ProfileList';
import { ProfilesService } from 'src/app/services/profiles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  //object that saves the values of the table
  table: FormGroup;
  //variables for general search
  generalsearch: string;
  //varibales to obtain data
  profilesgetting: ProfileList[] = [];
  newArray = this.profilesgetting;
  newArrarSearch: Profiles[] = [];
  filteredArray: ProfileList[] = [];

  constructor(private profilesService: ProfilesService) {

    this.table = new FormGroup({
      "identification": new FormControl(),
      "name": new FormControl(),
    })

    //inicialization of profiles
    this.profilesService.getProfiles().subscribe(res => {
      res.forEach((profile: Profiles) => {
        if (res.length > 0) {
          const obj: ProfileList = {};
          obj.id = profile.id;
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
        }
      })
    })
  }

  ngOnInit() {
  }

  //method to convert the modification date
  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  //method for updating the state to active
  changeStateA(idProfile) {
    let newstate: object ={
      state : [{
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
    let newstate: object ={
      state : [{
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
    let count = 0;
    let termsearch = '';
    let idsearch = '';

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        count += 1;
        termsearch = this.table.value[i];
        idsearch = i;
      }
    }

    console.log("campos llenos: ", count);

    if (count > 0 && count < 2 && !this.generalsearch) {

      //  un campo lleno
      this.newArray = this.profilesgetting.filter(function (profile: ProfileList) {
        //We test each element of the object to see if one string matches the regexp.
        if (profile[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
          return profile;
        }
      });

      this.filteredArray = this.newArray;

    } else if (count == 2 && this.generalsearch) {

      let aux = this.newArray;

      this.newArray = aux.filter(function (profile: ProfileList) {
        //We test each element of the object to see if one string matches the regexp.
        if (profile[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
          return profile;
        }
      });

    }
    else {

      if (this.generalsearch) {
      }
      if (count == 0) {
        // campos vacios
        // existe general search?
        this.newArray = this.profilesgetting;

        if (this.generalsearch) {
          console.log("buscando general searhc");
          this.searchbyterm(this.generalsearch);
        }
      } else {

        // campos llenos
        // existe general search?

        this.newArray = this.filteredArray.filter(function (profile: ProfileList) {
          //We test each element of the object to see if one string matches the regexp.
          if (profile[idsearch].toLowerCase().indexOf(termsearch) >= 0) {
            return profile;
          }
        });

        if (this.generalsearch) {
          console.log("buscando general searhc");
          this.searchbyterm(this.generalsearch);
        }
      }
    }
  }

  //method for a general search.
  searchbyterm(termino: string) {
    if (termino) {
      termino = termino.toLowerCase();
      var myRegex = new RegExp('.*' + termino + '.*', 'gi');

      if (this.filteredArray.length) {
        this.newArray = this.filteredArray.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.nameCharge) || myRegex.test(item.identification) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.entryDate) || myRegex.test(item.modificationDate) ||
            myRegex.test(item.numberOfModifications.toString()))
        });
      } else {
        this.newArray = this.profilesgetting.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.nameCharge) || myRegex.test(item.identification) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.entryDate) || myRegex.test(item.modificationDate) ||
            myRegex.test(item.numberOfModifications.toString()))
        });
        this.filteredArray = this.profilesgetting.filter(function (item) {
          //We test each element of the object to see if one string matches the regexp.
          return (myRegex.test(item.nameCharge) || myRegex.test(item.identification) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.entryDate) || myRegex.test(item.modificationDate) ||
            myRegex.test(item.numberOfModifications.toString()))
        });
      }
    } else {

      let count = 0;
      for (var i in this.table.value) {
        if (this.table.value[i] == null || this.table.value[i] == "") {
          count += 1;
        }
      }

      if (count > 1 && !this.generalsearch) {

        this.newArray = this.profilesgetting;
        this.filteredArray = []
        count = 0;

      } else {

        this.newArray = this.filteredArray;
        count = 0;
      }
    }
  }

  //sweets alerts
  swallUpdateState(idProfile, newState) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas actualizar el estado de este perfil!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this.profilesService.putProfile(idProfile, newState).subscribe(res => {
          this.profilesService.getProfiles().subscribe(profile => {
            this.profilesgetting = profile
          })
        })
        Swal.fire(
          'Actualizado!',
          'success',
        )
      }
    })
  }
}
