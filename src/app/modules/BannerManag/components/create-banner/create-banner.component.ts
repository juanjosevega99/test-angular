import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AlliesService } from 'src/app/services/allies.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Banners } from '../../../../models/Banners';
import { UploadImagesService } from 'src/app/services/providers/uploadImages.service';
import { BannersService } from 'src/app/services/banners.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.scss']
})
export class CreateBannerComponent implements OnInit {

  expirationDate: NgbDateStruct;
  codeBanner = '';
  today = '';
  allies = [];
  heads = [];
  state = false;
  photo: any = '';

  // alerts
  showimgalert = false;
  showinfocontent = false;

  // item To edit
  editBanner: Banners = {};

  formulary: FormGroup;

  constructor(private allyservice: AlliesService, private headService: HeadquartersService, private uploadimg: UploadImagesService,
    private bannerService: BannersService, private spinner: NgxSpinnerService, private router: Router, private activate: ActivatedRoute) {

    this.loadAllies();
    this.loadHeads();

    if (this.activate.params['_value'].id) {
      this.bannerService.getBannerById(this.activate.params['_value'].id).subscribe((banner: Banners) => {
        this.editBanner = banner;
        this.setDataEdit();

      });

    } else {
      this.creationDate();
      this.codeBanner = Math.random().toString(36).substring(7);
    }

    this.formulary = new FormGroup({
      'code': new FormControl(this.codeBanner, [Validators.required]),
      'state': new FormControl(this.state, Validators.required),
      'creationDate': new FormControl(this.today, [Validators.required, Validators.maxLength(11)]),
      'expirationDate': new FormControl('', [Validators.required]),
      'idAllies': new FormControl('', Validators.required),
      'idHeadquarters': new FormControl('', Validators.required),
      'description': new FormControl('', [Validators.maxLength(100)]),
      'name': new FormControl('', Validators.required),
      'imageBanner': new FormControl('')
    })

  }

  ngOnInit() {
  }

  loadAllies() {
    this.allyservice.getAllies().subscribe(allies => this.allies = allies);
  }

  loadHeads() {
    this.headService.getHeadquarters().subscribe(heads => this.heads = heads);
  }

  creationDate() {
    this.today = this.convertDate(new Date());
  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  saveBanner() {

    let Banner = this.createBanenr();

    if (this.formulary.valid && this.photo) {
      this.spinner.show();
      this.uploadimg.uploadImages(this.photo, "allies", "banners").then((result: string) => {
        Banner.imageBanner = result;

        if (this.editBanner.id) {
          Banner.id = this.editBanner.id;
          this.saveEditBanner(Banner);
        } else {
          this.saveNewBanner(Banner);
        }

      }).catch(err => {
        this.spinner.hide();
        console.log(err);
        Swal.fire(
          "Problemas con tu connexión a internet"
        )
      })

      this.showinfocontent = false;

    } else if (this.formulary.valid && !this.photo) {
      this.spinner.show();
      if (this.editBanner.id) {
        Banner.id = this.editBanner.id;
        this.saveEditBanner(Banner);
      } else {
        this.spinner.hide();
        this.showinfocontent = true;
      }

    }
    else {
      this.showinfocontent = true;
    }

  }

  saveNewBanner(Banner) {
    this.bannerService.postBanner(Banner).subscribe(banner => {

      this.spinner.hide();
      Swal.fire(
        "Banner Guardado Exitosamente"
      ).then(res => {

        if (res) {
          this.router.navigate(["/main", 'bannerManager']);
        }
      })

    })

  }

  saveEditBanner(Banner) {

    this.bannerService.putBanner(Banner).subscribe(banner => {
      this.spinner.hide();
      Swal.fire(
        "Banner Guardado Exitosamente"
      ).then(res => {
        if (res) {
          this.router.navigate(["/main", 'bannerManager']);
        }
      })
    })
  }


  createBanenr(): Banners {

    const expirationdate = this.formulary.value.expirationDate;
    const date = expirationdate['year'] + "/" + (expirationdate['month'] < 10 ? '0' + expirationdate['month'] : expirationdate['month']) + "/" + expirationdate['day'];
    let creationDate = this.formulary.value.creationDate;
    creationDate = creationDate.split("/");

    let Banner: Banners = new Banners;
    Banner.logo = this.allies.find(ally => ally.id == this.formulary.value.idAllies)['logo'];
    Banner.state = this.state;
    Banner.creationDate = new Date(creationDate[2], creationDate[1] - 1, creationDate[0]);
    Banner.expirationDate = new Date(date);
    Banner.idAllies = this.formulary.value.idAllies;
    Banner.nameAllies = this.allies.find(ally => ally.id == this.formulary.value.idAllies)['name'];
    Banner.idHeadquarters = this.formulary.value.idHeadquarters;
    Banner.nameHeadquarters = this.heads.find(headquartes => headquartes.id == this.formulary.value.idHeadquarters)['name'];
    Banner.description = this.formulary.value.description;
    Banner.name = this.formulary.value.name;
    Banner.imageBanner = this.formulary.value.imageBanner;
    Banner.code = this.formulary.value.code;
    Banner.typeOfBanner = '';

    return Banner;
  }

  changeState() {
    this.state = !this.state;
    this.formulary.value.state = this.state;
  }

  photoSelected(event) {

    let input = event.target;
    const typefile = event.target.files[0].type;

    if (typefile.startsWith('image')) {

      let reader = new FileReader();
      reader.onload = function (e: any) {
        $('#photo').attr('src', e.target.result)
      };
      reader.readAsDataURL(input.files[0]);

      this.showimgalert = false;
      this.photo = input.files[0];

    } else {
      this.showimgalert = true;
      this.photo = '';
    }
  }

  setDataEdit() {

    let date = new Date(this.editBanner.expirationDate);
    this.expirationDate = { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
    this.formulary.setValue({
      'code': this.editBanner.code,
      'state': this.editBanner.state,
      'creationDate': this.convertDate(this.editBanner.creationDate),
      'expirationDate': this.expirationDate,
      'idAllies': this.editBanner.idAllies,
      'idHeadquarters': this.editBanner.idHeadquarters,
      'description': this.editBanner.description,
      'name': this.editBanner.name,
      'imageBanner': this.editBanner.imageBanner
    })
  }

  swallDeleteCoupon() {
    Swal.fire({
      title: '¿Eliminar Banner?',
      // text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Eliminar'
    }).then(res => {
      if (res) {
        this.spinner.show();
        let urlImg = 'assets/allies/banners/' + this.editBanner.imageBanner.split("%")[3].split("?")[0].slice(2);

        this.uploadimg.DeleteImage(urlImg).then(res => {

          this.bannerService.deleteBanner(this.editBanner.id).subscribe(response => {
            this.spinner.hide();
            Swal.fire(
              "Banner Eliminado Exitosamente"
            ).then(res => {
              if (res) {
                this.router.navigate(["/main", 'bannerManager']);
              }
            })
          })

        }).catch(err =>{
          this.spinner.hide();
          console.log(err);
          
        })

      }
    })
  }

}
