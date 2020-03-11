import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  selectedA : boolean = false;
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
  ]

  newArray: {
    nameCharge: string, idCharge: string, name: string, photo: string, nameHeadquarter: string,
    entryDate: Date, modificationDate: Date, numberOfModifications: number, state: boolean
  }[] = this.Profiles;

  filteredArray: {
    nameCharge: string, idCharge: string, name: string, photo: string, nameHeadquarter: string,
    entryDate: Date, modificationDate: Date, numberOfModifications: number, state: boolean
  }[] = [];



  constructor() { }

  ngOnInit() {
  }

  searchbyterm(termino: string) {

    termino = termino.toLowerCase();

    const aux = this.newArray

    var myRegex = new RegExp('.*' + termino + '.*', 'gi');

    this.newArray = aux.filter(function (item) {
      //We test each element of the object to see if one string matches the regexp.
      return (myRegex.test(item.nameCharge) || myRegex.test(item.idCharge) || myRegex.test(item.name) || myRegex.test(item.photo) || myRegex.test(item.nameHeadquarter) )
    });
  }


  search(termino?: string, id?: string) {
    console.log(id);
    
 
    if (termino) {
      termino = termino.toLowerCase();

      this.newArray = [];
      this.filteredArray = [];

      this.Profiles.forEach(prof => {

        if (prof[id].toLowerCase().indexOf(termino) >= 0) {
          this.newArray.push(prof);
          this.filteredArray.push(prof);
        }

      });

    } else {
      this.newArray = this.Profiles;
      this.filteredArray = [];
    } 
}

}
