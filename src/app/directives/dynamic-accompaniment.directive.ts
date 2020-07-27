import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicAccompaniment]'
})
export class DynamicAccompanimentDirective {

  constructor(public viewContainerRef:ViewContainerRef) { }

}
