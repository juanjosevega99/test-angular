import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AlliesService } from 'src/app/services/allies.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Banners } from '../../../../models/Banners';
import { UploadImagesService } from 'src/app/services/providers/uploadImages.service';
import { BannersService } from 'src/app/services/banners.service';
import Swal from 'sweetalert2';
import { Guid } from "guid-typescript";


@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.scss']
})
export class CreateBannerComponent implements OnInit {

  expirationDate: NgbDateStruct;
  codeBanner :Guid;
  today = '';
  allies = [];
  heads = [];

  // alerts
  showimgalert = false;
  showinfocontent = false;

  formulary: FormGroup;

  constructor(private allyservice: AlliesService, private headService: HeadquartersService, private uploadimg: UploadImagesService,
    private bannerService: BannersService) {
    this.loadAllies();
    this.loadHeads();
    this.creationDate();
    this.codeBanner =  Guid.create();

    this.formulary = new FormGroup({
      'code': new FormControl(this.codeBanner, [Validators.required]),
      'state': new FormControl('', Validators.required),
      'creationDate': new FormControl(this.today, [Validators.required, Validators.maxLength(10)]),
      'expirationDate': new FormControl('', [Validators.required]),
      'idAllies': new FormControl('', Validators.required),
      'idHeadquarters': new FormControl('', Validators.required),
      'description': new FormControl('', [Validators.maxLength(100)]),
      'name': new FormControl('', Validators.required),
      'imageBanner': new FormControl('', Validators.required)
    })
  }

  //  `${this.expirationDate.day}-${this.expirationDate.month}-${this.expirationDate.year} `
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
    const expirationdate = this.formulary.value.expirationDate;
    const date = expirationdate['day'] + "-"+ expirationdate['month']+ "-"+ expirationdate['year'];
    console.log(this.formulary.value.expirationDate, date);
    
    if (this.formulary.valid) {

      let Banner = this.createBanenr();

      this.uploadimg.uploadImages(Banner.imageBanner, "allies", "banners").then((result: string) => {
        Banner.imageBanner = result;
        this.bannerService.postBanner(Banner).subscribe(banner => {
          console.log(banner);

          Swal.fire(
            "Banner Guardado Exitosamente"
          )

        })
      })

      console.log(Banner);
      this.showinfocontent = false;

    } else {
      this.showinfocontent = true;
    }

  }


  createBanenr(): Banners {

    const expirationdate = this.formulary.value.expirationDate;
    let Banner: Banners = new Banners;
    Banner.logo = this.allies.find(ally => ally.id == this.formulary.value.idAllies)['logo'];
    Banner.state = this.formulary.value.state;
    Banner.creationDate = this.formulary.value.creationDate;
    Banner.expirationDate = this.formulary.value.expirationDate;
    Banner.idAllies = this.formulary.value.idAllies;
    Banner.nameAllies = this.allies.find(banner => banner.id == this.formulary.value.idAllies)['nameAllies'];
    Banner.idHeadquarters = this.formulary.value.idHeadquarters;
    Banner.nameHeadquarters = this.heads.find(banner => banner.id == this.formulary.value.idHeadquarters)['nameHeadquarters'];
    Banner.description = this.formulary.value.description;
    Banner.name = this.formulary.value.name;
    Banner.imageBanner = this.formulary.value.imageBanner;
    Banner.code = this.formulary.value.code;
    Banner.typeOfBanner = '';

    return Banner;
  }

  changeState() {
    this.formulary.value.state = !this.formulary.value.state;
    console.log("new value", this.formulary.value.state);
    
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

      this.formulary.value.imageBanner = input.files[0];
      this.showimgalert = false;

    } else {
      this.showimgalert = true;
    }
  }

}
