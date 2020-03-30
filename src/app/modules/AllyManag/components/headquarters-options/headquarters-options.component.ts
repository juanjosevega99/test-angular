import { Component, OnInit } from '@angular/core';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { Headquarters } from 'src/app/models/Headquarters';

@Component({
  selector: 'app-headquarters-options',
  templateUrl: './headquarters-options.component.html',
  styleUrls: ['./headquarters-options.component.scss']
})
export class HeadquartersOptionsComponent implements OnInit {

  headquartersgetting : Headquarters[]=[];
  headquarters= this.headquartersgetting;

  constructor(private headquarterService:HeadquartersService) { 

    this.headquarterService.getHeadquarters().subscribe(res =>{
      res.forEach((headquarters:Headquarters)=>{
        const dates:Headquarters ={};
        dates.id = headquarters.id;
        dates.name = headquarters.name
        this.headquartersgetting.push(dates)
      })
     
    })
    /*  //inicialization service with collections dishes-categories
    this.dishCategory.getDishCategory().subscribe(dishesCat => {
      this.dishesCategories = dishesCat;
    }) */
  }

  ngOnInit() {
  }

}
