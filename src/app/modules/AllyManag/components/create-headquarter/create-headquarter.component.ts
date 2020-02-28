import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-headquarter',
  templateUrl: './create-headquarter.component.html',
  styleUrls: ['./create-headquarter.component.scss']
})
export class CreateHeadquarterComponent implements OnInit {

  servicios: any[] = [{name: 'Parqueadero', img:'assets/icons/parking.png' },{name: 'Barra de tragos', img:'assets/icons/cocktail.png' },{name: 'Wifi', img:'assets/icons/wi-fi-zone.png' },
  {name: 'Mesa exterior', img:'assets/icons/people-table.png' },{name: 'Acceso a discapacitados', img:'assets/icons/discapacity.png' },{name: 'Show en vivo', img:'assets/icons/dance.png' },
  {name: 'Zona de fumadores', img:'assets/icons/no-smoking.png' },{name: 'Carta braile', img:'assets/icons/braille.png' }]

  constructor() { }

  ngOnInit() {
  }

}
