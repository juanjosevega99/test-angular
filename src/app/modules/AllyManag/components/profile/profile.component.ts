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

  //variables for sections

  /*  selectedA : boolean = false;
   selectedD : boolean = false;
   
 
   Profiles = [
     {
       nameCharge: 'Cajero', idCharge: '1015452638', name: 'Andrés Mauricio Reyes', photo: '../../../../../assets/img/kfc-logo.png', nameHeadquarter: 'KFC-Galerías',
       entryDate: null, modificationDate: null, numberOfModifications: 2, state: false
     },
     {
       nameCharge: 'Admin. PDV', idCharge: '10015416', name: 'Yesid Alfonso Pintor', photo: '../../../../../assets/img/kfc-logo.png', nameHeadquarter: 'KFC-Galerías',
       entryDate: null, modificationDate: null, numberOfModifications: 1, state: false
     },
     {
       nameCharge: 'Gerente', idCharge: '10015427', name: 'Juan Sebastian Hoyos', photo: '../../../../../assets/img/kfc-logo.png', nameHeadquarter: 'KFC-Galerías',
       entryDate: null, modificationDate: null, numberOfModifications: 1, state: false
     },
   ] */
  /* 
    newArray: {
      nameCharge: string, idCharge: string, name: string, photo: string, nameHeadquarter: string,
      entryDate: Date, modificationDate: Date, numberOfModifications: number, state: boolean
    }[] = this.Profiles;
  
    filteredArray: {
      nameCharge: string, idCharge: string, name: string, photo: string, nameHeadquarter: string,
      entryDate: Date, modificationDate: Date, numberOfModifications: number, state: boolean
    }[] = []; */



  constructor(private profilesService: ProfilesService) {

    this.table = new FormGroup({
      "reference": new FormControl(),
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


  search(termino?: string, id?: string) {

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
