import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Profiles } from 'src/app/models/Profiles';
import { async } from '@angular/core/testing';
import { AuthFireServiceService } from 'src/app/services/providers/auth-fire-service.service';
import { AlliesService } from 'src/app/services/allies.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, OnDestroy {
  preProfile: Object = {
    state: [],
    numberOfModifications: 0,
    idAllies: null,
    nameAllie: null,
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

  editProfile: Profiles = {
    state: [],
    ratings: [],
    entryDate: null,
    modificationDate: null,
    numberOfModifications: 0,
    idAllies: null,
    nameAllie: null,
    idHeadquarter: null,
    nameHeadquarter: null,
    idCharge: null,
    nameCharge: null,
    userCode: null,
    permis: null,
    identification: null,
    name: null,
    email: null,
    photo: null,
    idFirebase: null,
  }

  //variables for receiving the profile that will be edited
  identificatorbyRoot: any;
  buttonPut: boolean;
  seeNewPhoto: boolean;

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
  dateEntry: String;
  timesEntry: String;
  today: Date;

  newDate: Date;
  dateModication: String;
  timesModification: String;

  //variable for the permission
  permiss: string[] = [];

  //variable for upload images
  fileImagedish: any;
  urlPorfile: Observable<string>;

  //variable for the loading
  loading: boolean;
  timeTick: any;

  // Variables of alerts
  alertBadExtensionLogo = false;

  constructor(
    private _router: Router, private firebaseservice: AuthFireServiceService,
    private activatedRoute: ActivatedRoute,
    private chargeProfiles: ProfilesService,
    private profiles: ProfilesService,
    private storage: AngularFireStorage,
    private profileCategory: ProfilesCategoriesService,
    private allyService: AlliesService,
    private headquarterService: HeadquartersService,
    private _location: Location) {
    //flags
    this.loading = true;
    this.buttonPut = true;
    this.seeNewPhoto = false;

    this.State = [{
      state: "active",
      check: false
    }, {
      state: "inactive",
      check: false
    }]

    this.preProfile['state'] = this.State;

    this.permiss = ["cajero", "administradorPDV", "GerenteGeneral"];

    //inicialization for charging the data of a profile to edit
    this.activatedRoute.params.subscribe(params => {

      let identificator = params['id'];
      this.identificatorbyRoot = identificator;

      if (identificator != -1) {
        this.getProfile(identificator);
      } else if (identificator == -1) {
        this.loading = false
        this.buttonPut = false
        //Load name of Ally and Headquarter
        if (localStorage.getItem('idAlly') && localStorage.getItem('idHeadquarter')) {

          this.preProfile["idAllies"] = localStorage.getItem('idAlly');
          this.allyService.getAlliesById(localStorage.getItem('idAlly')).subscribe(ally => {
            this.preProfile["nameAllie"] = ally.name;
          })

          this.preProfile["idHeadquarter"] = localStorage.getItem('idHeadquarter');
          this.headquarterService.getHeadquarterById(localStorage.getItem('idHeadquarter')).subscribe(hq => {
            this.preProfile["nameHeadquarter"] = hq.name;
          })

        }
      }
    })

    //inicialization service with collections dishes-categories
    this.profileCategory.getProfileCategory().subscribe(profileCat => {
      this.Categories = profileCat;
    })


  }

  ngOnInit() {
    this.tick();
    this.timeTick = setInterval(() => this.tick(), 20000);
  }

  ngOnDestroy() {
    clearTimeout(this.timeTick);
  }

  goBack() {
    this._location.back();
  }

  //Method to see the id of the category of profile selected
  seeId(selected: any) {
    this.Categories.forEach((element: any) => {
      if (selected == element.name) {
        this.preProfile['idCharge'] = element.id
      }
    })
  }

  //charge a profile with the id
  getProfile(id: any) {
    this.loading;

    if (Number.isInteger(id / 1)) {
      this.chargeProfiles.getAllUsersbyIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(profiles => {
        let profile: Profiles = {}

        profile = profiles[id]

        this.editProfile = profile;
        this.preProfile = this.editProfile;
        this.tick();
        this.loading = false;
      })
    } else {
      this.chargeProfiles.getProfileById(id).subscribe(profile => {
        this.editProfile = profile;
        this.preProfile = this.editProfile;
        this.tick();
        this.loading = false;
      })
    }

  }

  //method for delete a profile
  deleteProfile() {
    if (this.identificatorbyRoot == -1) {
      Swal.fire({
        text: "No puedes eliminar este perfil ya que no ha sido creado!",
        icon: 'error',
        confirmButtonColor: '#542b81',
        confirmButtonText: 'Ok!'
      })
    } else {
      this.chargeProfiles.getAllUsersbyIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(profiles => {
        let profile: ProfileList = {}
        profile = profiles[this.identificatorbyRoot]
        let realId = profile._id
        this.swallDelete(realId)
      })
    }
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
      title: '¿Estás seguro?',
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
      this.today = new Date();
      this.newDate = this.editProfile['entryDate'];
      const d = new Date(this.newDate);
      this.timesEntry = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateEntry = d.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });
      this.timesModification = this.today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      this.dateModication = this.today.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'numeric', year: 'numeric' });

    }
  }

  //Method to generate the user code
  generateCode(event) {
    this.preProfile['userCode'] = this.preProfile['nameAllie'] + event.target.value
  }

  //Method for photo of the dish
  onPhotoSelected($event) {
    let input = $event.target;
    let filePath = input.value;
    let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    if (!allowedExtensions.exec(filePath)) {
      // alert('Por favor solo subir archivos que tengan como extensión .jpeg/.jpg/.png/.gif');
      this.alertBadExtensionLogo = true;
      input.value = '';
      return false;
    } else {
      if (input.files && input.files[0]) {
        this.alertBadExtensionLogo = false;
        this.seeNewPhoto = true;

        var reader = new FileReader();
        reader.onload = function (e: any) {
          $('#photo')
            .attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    return this.fileImagedish = input.files[0]

  }
  //save new profile
  saveProfile() {
    this.swallSave()
  }

  //putProfile
  putProfile() {
    this.chargeProfiles.getAllUsersbyIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(profiles => {
      let profile: Profiles = {};
      profile = profiles[this.identificatorbyRoot];
      let realId = profile._id;
      this.editProfile.state = this.preProfile['state'];
      this.editProfile.entryDate = profile.entryDate;
      this.editProfile.modificationDate = this.today;
      this.editProfile.idAllies = profile.idAllies;
      this.editProfile.nameAllie = profile.nameAllie;
      this.editProfile.idHeadquarter = profile.idHeadquarter;
      this.editProfile.nameHeadquarter = profile.nameHeadquarter;
      this.editProfile.idCharge = this.preProfile['idCharge'];
      this.editProfile.nameCharge = this.preProfile['nameCharge'];
      this.editProfile.userCode = this.preProfile['userCode'];
      this.editProfile.permis = this.preProfile['permis'];
      this.editProfile.identification = this.preProfile['identification'];
      this.editProfile.name = this.preProfile['name'];
      this.editProfile.email = this.preProfile['email'];
      this.swallUpdate(realId)
    })
  }

  //sweet alerts
  swallSaveOtherProfile(newCategory: any) {
    Swal.fire({
      title: '¿Estás seguro?',
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
          'Tu nuevo perfil ha sido creado',
          'success',
        )
        this._router.navigate(['/main', 'profiles', this.identificatorbyRoot]);
      }
    })
  }

  swallDeleteProfile(categorySelected: string) {
    Swal.fire({
      title: '¿Estás seguro?',
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
        Swal.fire({
          title: 'Eliminado',
          icon: 'success',
          confirmButtonColor: '#542b81',
          confirmButtonText: 'Ok!'
        })
      }
    })
  }

  swallSave() {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {

      if (result.value) {
        this.loading = true;
        // console.log("Array FINAL: ", this.preProfile);
        const id: Guid = Guid.create();
        const file = this.fileImagedish;
        const filePath = `assets/allies/profiles/${id}`;
        
        const ref = this.storage.ref(filePath);

        this.firebaseservice.SignUp(this.preProfile['email'], this.preProfile['identification']).then(response => {

          const task = this.storage.upload(filePath, file);
          // console.log(response.user.uid);

          task.snapshotChanges().pipe(

            finalize(() => {

              ref.getDownloadURL().subscribe(urlImage => {

                this.urlPorfile = urlImage;
                // console.log(this.urlPorfile);
                this.preProfile['photo'] = this.urlPorfile;
                this.preProfile['idFirebase'] = response.user.uid;
                this.preProfile['_id'] = response.user.uid;

                this.profiles.postProfile(this.preProfile).subscribe(message => {

                  this.loading = false;
                  Swal.fire({
                    title: 'Guardado',
                    text: "Tu nuevo perfil ha sido creado!",
                    icon: 'success',
                    confirmButtonColor: '#542b81',
                    confirmButtonText: 'Ok!'
                  }).then((result) => {
                    if (result.value) {
                      // console.log("usuario resgistrado", message);                      
                      this._router.navigate(['/main', 'profiles', this.identificatorbyRoot]);
                    }
                  })

                })
              })
            }
            )
          ).subscribe(res => { })

        }).catch(err => {
          //console.log(err);
          this.loading = false;
          Swal.fire({
            text: `TifiAdmin ${err['message']} `,
            icon: 'error',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          })
          /* Swal.fire(
          this.loading = false;
          this.preProfile['email'] = '';

          Swal.fire(
            `TifiAdmin ${err['message']} `,
          ) */
        })
      }
    })
  }

  swallDelete(realId) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas eliminar este perfil!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.chargeProfiles.deleteProfile(realId).subscribe(message => {
          this.loading = false;
          Swal.fire({
            title: 'Eliminado',
            text: "Tu perfil ha sido eliminado!",
            icon: 'success',
            confirmButtonColor: '#542b81',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.value) {
              this._router.navigate(['/main', 'profiles', this.identificatorbyRoot]);
            }
          })
        })
      }
    })
  }


  async swallUpdate(realId) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then(async (result) => {
      if (result.value) {
        //console.log("Array FINAL: ", this.editProfile);
        this.loading = true;
        this.chargeProfiles.getAllUsersbyIdHeadquarter(localStorage.getItem("idHeadquarter")).subscribe(profiles => {
          let profile: Profiles = {};
          profile = profiles[this.identificatorbyRoot];
          this.editProfile.numberOfModifications = this.preProfile['numberOfModifications'] + 1;
          if (this.seeNewPhoto == false) {
            this.editProfile.photo = profile.photo;
            this.chargeProfiles.putProfile(realId, this.editProfile).subscribe(res => {
              this.loading = false;
              Swal.fire({
                title: 'Guardado',
                text: "Tu perfil ha sido actualizado!",
                icon: 'success',
                confirmButtonColor: '#542b81',
                confirmButtonText: 'Ok!'
              }).then((result) => {
                if (result.value) {
                  this._router.navigate(['/main', 'profiles', this.identificatorbyRoot]);
                }
              });
            });
          }
          else if (this.seeNewPhoto == true) {
            const id: Guid = Guid.create();
            const file = this.fileImagedish;
            const filePath = `assets/allies/profiles/${id}`;
            const ref = this.storage.ref(filePath);
            const task = this.storage.upload(filePath, file);
            task.snapshotChanges()
              .pipe(finalize(() => {
                ref.getDownloadURL().subscribe(urlImage => {
                  this.urlPorfile = urlImage;
                  // console.log(this.urlPorfile);
                  this.preProfile['photo'] = this.urlPorfile;
                  this.chargeProfiles.putProfile(realId, this.editProfile).subscribe(res => {
                    Swal.fire({
                      title: 'Guardado',
                      text: "Tu perfil ha sido actualizado!",
                      icon: 'success',
                      confirmButtonColor: '#542b81',
                      confirmButtonText: 'Ok!'
                    }).then((result) => {
                      if (result.value) {
                        this._router.navigate(['/main', 'profiles', this.identificatorbyRoot]);
                      }
                    });
                  });
                });
              })).subscribe();
          }
        })
      }
    })
  }


}
