import { Directive, Input } from '@angular/core';
import { FileItem } from '../models/loadImages_Firebase/file-item';

@Directive({
  selector: '[appValidationsLoadImages]'
})
export class ValidationsLoadImagesDirective {
  
  @Input() images: FileItem[]=[]

  constructor() { }
  //validations
  private _preventStop( event ){
    event.preventDefault();
    event.stopPropagation();
  }

  private _isImage( typeFile:string):boolean{
    return ( typeFile === '' || typeFile == undefined ) ? false : typeFile.startsWith('image')
  }
}
