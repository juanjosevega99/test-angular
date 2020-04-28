import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BannersService } from 'src/app/services/banners.service';
import { Banners } from 'src/app/models/Banners';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-banner-manager',
  templateUrl: './banner-manager.component.html',
  styleUrls: ['./banner-manager.component.scss']
})
export class BannerManagerComponent implements OnInit {
  //object that saves the values of the table
  table: FormGroup;

  //variables for general search
  generalsearch: string = "";

  bannergetting = [];
  bannerArray = this.bannergetting;
  loadingBanners = false;

  constructor(private bannerservice: BannersService, private spinner: NgxSpinnerService) {

    this.loadBanners();

    this.table = new FormGroup({
      "code": new FormControl(),
      "nameAllies": new FormControl(),
      "general": new FormControl()
    })

  }

  ngOnInit() {
  }

  loadBanners() {
    this.loadingBanners = true;
    this.bannerservice.getBanners().subscribe((banners: Banners[]) => {
      banners.forEach((banner, index) => {
        this.bannergetting.push(banner);
        if(index === (banners.length -1)){
          this.loadingBanners = false;
        }
      })
    });
  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  UpdateBanner(banner: Banners) {

    Swal.fire({
      title: '¿Actualizar Banner?',
      // text: "de que deseas guardar los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#542b81',
      cancelButtonColor: '#542b81',
      confirmButtonText: 'Si, guardar!'
    }).then(res => {
      if (res) {
        this.saveEditBanner(banner);
      }
    })
  }

  saveEditBanner(Banner) {
    this.spinner.show();
    this.bannerservice.putBanner(Banner).subscribe(banner => {
      this.spinner.hide();
      Swal.fire(
        "Cambios Guardados Exitosamente"
      )
    })
  }

  changestate(idcupon: string) {
    let Banner = this.bannerArray.find(banner => banner.id === idcupon);
    Banner.state = !Banner.state;
    this.UpdateBanner(Banner);
  }

  search() {
    // vars to filter table
    let objsearch = {
      code: "",
      nameAllies: ""
    };

    for (var i in this.table.value) {
      // search full fields
      if (this.table.value[i] !== null && this.table.value[i] !== "") {

        objsearch[i] = this.table.value[i];
      }
    }

    var myRegex = new RegExp('.*' + this.generalsearch.toLowerCase() + '.*', 'gi');

    this.bannerArray = this.bannergetting.
      filter(function (dish) {
        if (dish["code"].toLowerCase().indexOf(this.code) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (dish) {
        if (dish["nameAllies"].toLowerCase().indexOf(this.nameAllies) >= 0) {
          return dish;
        }
      }, objsearch).
      filter(function (item) {
        //We test each element of the object to see if one string matches the regexp.
        return (myRegex.test(item.code) || myRegex.test(item.name) || myRegex.test(item.nameHeadquarters) ||
          myRegex.test(item.description) || myRegex.test(item.typeOfBanner) || myRegex.test(item.creationDate) || myRegex.test(item.expirationDate))
      })
  }

}
