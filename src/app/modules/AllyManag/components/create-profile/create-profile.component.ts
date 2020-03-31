import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfilesService } from 'src/app/services/profiles.service';
import { ProfilesCategoriesService } from "src/app/services/profiles-categories.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Guid } from "guid-typescript";
import { ProfileList } from 'src/app/models/ProfileList';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  /*  profilegetting: Profiles = {
     state: [],
     entryDate:null,
     modificationDate:null,
     numberOfModifications: 0,
     idAllies:null,
     nameAllie: "kfc",
     idHeadquarter:null,
     nameHeadquarter: null,
     idCharge:null,
     nameCharge: null,
     userCode: null,
     permis: null,
     identification: null,
     name: null,
     email: null,
     photo: null
   };
 
   preProfile = this.profilegetting */

  preProfile: Object = {
    state: [],
    /* entryDate:null,
    modificationDate:null, */
    numberOfModifications: 0,
    idAllies: null,
    nameAllie: "kfc",
    idHeadquarter: null,
    nameHeadquarter: null,
    idCharge: null,
    nameCharge: null,
    userCode: null,
    permis: null,
    identification: null,
    name: null,
    email: null,
    photo: null
  }

  editProfile: Object = {
    state: [],
    entryDate: null,
    modificationDate: null,
    numberOfModifications: 0,
    idAllies: null,
    nameAllie: "kfc",
    idHeadquarter: null,
    nameHeadquarter: null,
    idCharge: null,
    nameCharge: null,
    userCode: null,
    permis: null,
    identification: null,
    name: null,
    email: null,
    photo: null
  }



  //variables for receiving the profile that will be edited
  identificatorbyRoot:string;

  //variables for categories
  arrayCategorySelect: boolean = true;
  otherCategoryInput: boolean = false;
  addcategoryButton: boolean = true;
  selectAgainarray: boolean = false;
  newCategory: String;
  Categories: String[] = [];

  //variable for the state
  State: any[] = [];

  //variables for tick
  date: String;
  times: String;
  today: Date;

  //variable for the permission
  permiss: string[] = [];

  //variable for upload images
  fileImagedish: any;
  urlPorfile: Observable<string>;

  //variable for the loading
  loading: boolean;


  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private chargeProfiles: ProfilesService, private profiles: ProfilesService, private storage: AngularFireStorage, private profileCategory: ProfilesCategoriesService) {

    this.loading = true;

    this.State = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]

    this.preProfile['state'] = this.State;

    this.permiss = ["permiso1", "permiso2"];

    //inicialization for charging the data of a profile to edit
    this.activatedRoute.params.subscribe(params => {
      let identificator = params['id']
      if (identificator != -1) {
        this.getProfile(identificator)
      } else if (identificator == -1) {
        this.loading = false
      }
      this.identificatorbyRoot = identificator
    })

    //inicialization service with collections dishes-categories
    this.profileCategory.getProfileCategory().subscribe(profileCat => {
      this.Categories = profileCat;
    })
  }

  ngOnInit() {
    setInterval(() => this.tick(), 1000);
  }

  //charge a profile with the id
  getProfile(id: string) {
    this.loading;
    this.chargeProfiles.getProfiles().subscribe(profiles => {
      let profile: ProfileList = {}
      profile = profiles[id]
      this.editProfile = profile
      this.preProfile = this.editProfile
      this.loading = false;
    })
  }

  //method for delete a profile
  deleteProfile(){
    /* this.chargeProfiles.getProfiles().subscribe(profiles => {
      let profile: ProfileList = {}
      profile = profiles[id]
      let realId = profile.id
      this.swallDelete(realId)
    }) */
    console.log(this.identificatorbyRoot);
    
  }

  //Method for showing new view in the categories field
  handleBoxCategories(): boolean {

    if (this.addcategoryButton) {
      return this.addcategoryButton = false,
        this.otherCategoryInput = true,
        this.selectAgainarray = true,
        this.arrayCategorySelect = false
    } else {
      return this.addcategoryButton = true,
        this.otherCategoryInput = false,
        this.selectAgainarray = false,
        this.arrayCategorySelect = true
    }
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
      text: "de que deseas colocar este estado al perfil!",
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

        this.preProfile['state'] = fullstate

      }
    })

    /* fullstate = [
      { state: valueA, check: checkedA },
      { state: valueB, check: checkedB }]

    this.preProfile['state'] = fullstate */
  }

  //CRD -- Methos of TypeProfile: CREATE ,READ AND DELETE 
  addCategory(name: String) {
    if (name != null) {
      let newitem = name;
      let newCategory: object = {
        name: newitem
      }
      this.swallSaveOtherProfile(newCategory)

      this.handleBoxCategories()
    } else { alert("Ingrese el nuevo perfil") }

  }

  deleteCategory() {
    let categorySelected = this.preProfile['nameCharge']
    this.swallDeleteProfile(categorySelected)
  }


  //Metod for the admission date
  tick(): void {
    this.today = new Date();
    this.times = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    this.date = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
    /* this.preDish['creationDate'] = this.today */
  }

  //Method to generate the user code
  generateCode(event) {
    this.preProfile['userCode'] = this.preProfile['nameAllie'] + event.target.value
  }

  //Method for photo of the dish
  onPhotoSelected($event) {
    let input = $event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        $('#photo')
          .attr('src', e.target.result)
      };
      reader.readAsDataURL(input.files[0]);
    }

    return this.fileImagedish = input.files[0]
  }

  //save new profile
  saveProfile() {
    this.swallSave()
  }

  //sweet alerts
  swallSaveOtherProfile(newCategory: any) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar este nuevo perfil!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.profileCategory.postProfileCategory(newCategory).subscribe(() => {
          this.profileCategory.getProfileCategory().subscribe(profileC => {
            this.Categories = profileC;
          })
        })
        Swal.fire(
          'Guardado!',
          'Tu nuevo perfil ha sido creada',
          'success',
        )
        this._router.navigate(['/main', 'profiles']);
      }
    })
  }

  swallDeleteProfile(categorySelected: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este perfil!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.profileCategory.getProfileCategory().subscribe(profileC => {
          this.Categories = profileC;
          this.Categories.forEach((element: any) => {
            let profile: any = {
              id: element.id,
              name: element.name
            }
            if (profile.name == categorySelected) {
              this.profileCategory.deleteProfileCategory(profile.id).subscribe(() => {
                this.profileCategory.getProfileCategory().subscribe(profiles => {
                  this.Categories = profiles;
                })
              })
            }
          });
        })
        Swal.fire(
          'Eliminado!',
          'success',
        )
      }
    })
  }

  swallSave() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        console.log("Array FINAL: ", this.preProfile);
        const id: Guid = Guid.create();
        const file = this.fileImagedish;
        const filePath = `assets/allies/profiles/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file)
        task.snapshotChanges()
          .pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe(urlImage => {
                this.urlPorfile = urlImage;
                console.log(this.urlPorfile);
                this.preProfile['photo'] = this.urlPorfile
                this.profiles.postProfile(this.preProfile).subscribe(message => { })
              })
            }
            )
          ).subscribe()
        Swal.fire({
          title: 'Guardado',
          text: "Tu nuevo perfil ha sido creado!",
          icon: 'warning',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        }).then((result) => {
          if (result.value) {
            this._router.navigate(['/main', 'profiles']);
          }
        })
      }
    })
  }

  swallDelete(realId){
    Swal.fire({
      title: 'Estás seguro?',
      text: "de que deseas eliminar este perfil!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.chargeProfiles.deleteProfile(realId).subscribe()
      
        Swal.fire(
          'Eliminado!',
          'success',
        )
        this._router.navigate(['/main', 'profiles']);
      }
    })
  }


}
