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
 /*  generalsearch: string = ''; */
  
  //varibales to obtain data
  profilesgetting: ProfileList[] = [];
  newArray = this.profilesgetting;
  newArrarSearch: Profiles[] = [];
  filteredArray: ProfileList[] = [];



  constructor(private profilesService: ProfilesService) {
    this.table = new FormGroup({
      "identification": new FormControl(),
      "name": new FormControl(),
      "general":new FormControl()
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
    
    // vars to filter table
    let objsearch = {
      identification: "",
      name: ""
    }

    

    let gener ={
      general:""
    }

    gener.general = this.table.controls['general'].value
     

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {
        objsearch[i] = this.table.value[i];
      }
    }

     // let for general search
     var myRegex = new RegExp('.*' + gener.general.toLowerCase() + '.*', 'gi');

     this.newArray = this.profilesgetting.
      filter(function (profile) {
        if (profile["identification"].toLowerCase().indexOf(this.identification) >= 0) {
          return profile;
        }
      }, objsearch).
      filter(function (profile) {
        if (profile["name"].toLowerCase().indexOf(this.name) >= 0) {
          return profile;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.nameCharge) || myRegex.test(item.identification) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarter) || myRegex.test(item.entryDate) || myRegex.test(item.modificationDate) ||
          myRegex.test(item.numberOfModifications.toString()) )

      })
  }
  searchg(value){
    console.log( this.table.controls['general'].value);
    
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
