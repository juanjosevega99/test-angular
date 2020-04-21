import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BannersService } from 'src/app/services/banners.service';
import { Banners } from 'src/app/models/Banners';

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

  constructor( private bannerservice:BannersService ) {

    this.loadBanners();

    this.table = new FormGroup({
      "code": new FormControl(),
      "nameAllies": new FormControl(),
      "general": new FormControl()
    })

  }

  ngOnInit() {
  }

  loadBanners(){
    this.bannerservice.getBanners().subscribe( banners => {

      banners.forEach( (banner:any)=>{
        banner.creationDate = this.convertDate(banner.creationDate);
        banner.expirationDate = this.convertDate(banner.expirationDate);
        this.bannergetting.push(banner);
      })

    } );
  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

  search() {
    // vars to filter table
    let objsearch = {
      code: "",
      nameAllies : ""
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
