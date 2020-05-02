import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[appTypeServiceImg]'
})
export class TypeServiceImgDirective {

  @HostBinding('src') imagesource: string;

  @Input("appTypeServiceImg") typeservice: string;

  constructor() { }


  ngOnChanges(){

    this.selectImg();

  }

  selectImg() {

    if (this.typeservice){
      
    let pretype = this.typeservice.split(" ");
    let type = '';

    if (pretype.length > 0) {
      // is a reservalo service
      type = pretype[0]

    } else {

      type = this.typeservice;
    }

    switch (type) {
      case 'pidelo':
        this.imagesource = "assets/icons/pidelo.png";
        break;

      case 'llevalo':
        this.imagesource = "assets/icons/llevalo.png";
        break;

      case 'reservalo':
        this.imagesource = "assets/icons/reservalo.png";
        break;
    }
  }
  }

}
