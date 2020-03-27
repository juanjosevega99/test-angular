import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgModel } from '@angular/forms';
import { Profiles } from 'src/app/models/Profiles';
import { ProfileList } from 'src/app/models/ProfileList';
import { ProfilesService } from 'src/app/services/profiles.service';

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
filteredArray: Profiles[] = [];
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



  constructor(private profilesService:ProfilesService ) { 

    this.table = new FormGroup({
      "reference": new FormControl(),
      "name": new FormControl(),
    })

    //inicialization of profiles
    this.profilesService.getProfiles().subscribe(res =>{
      res.forEach((profile:Profiles)=>{
        if(res.length>0){
          const obj: ProfileList = {};
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
    const n = d.toISOString().split("T")[0];
    return n;
  }

  searchbyterm(termino: string) {

  }


  search(termino?: string, id?: string) {
    
}
}
