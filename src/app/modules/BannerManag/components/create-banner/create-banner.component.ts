import { Component, OnInit } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { AlliesService } from 'src/app/services/allies.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.scss']
})
export class CreateBannerComponent implements OnInit {

  expirationDate:NgbDateStruct;
  today = '';
  allies = [];
  heads = [];
  
  formulary: FormGroup;

  constructor(private allyservice:AlliesService, private headService:HeadquartersService) {
    this.loadAllies();
    this.loadHeads();
    this.creationDate();

    this.formulary = new FormGroup({
      'state':new FormControl(false),
      'stcreationDateate':new FormControl(false),
      'expirationDate':new FormControl(),
      'nameAllies':new FormControl(),
      'nameHeadquarters':new FormControl(),
      'description':new FormControl(),
      'name':new FormControl()
    })
   }

  //  `${this.expirationDate.day}-${this.expirationDate.month}-${this.expirationDate.year} `s
  ngOnInit() {
  }

  loadAllies(){
    this.allyservice.getAllies().subscribe( allies=> this.allies = allies);
  }

  loadHeads(){
    this.headService.getHeadquarters().subscribe( heads => this.heads = heads );
  }

  creationDate(){
    this.today = this.convertDate( new Date() );
  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' });
    return n;
  }

}
