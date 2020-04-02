import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appCronometerState]'
})
export class CronometerStateDirective {

  @Input('appCronometerState') state:string;

  
  constructor() { }

}
