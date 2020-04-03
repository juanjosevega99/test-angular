import { Component, OnInit } from '@angular/core';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { Headquarters } from 'src/app/models/Headquarters';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-headquarters-options',
  templateUrl: './headquarters-options.component.html',
  styleUrls: ['./headquarters-options.component.scss']
})
export class HeadquartersOptionsComponent implements OnInit {

  headquartersgetting: Headquarters[] = [];
  headquarters = this.headquartersgetting;

  //variables of idAlly
  idAlly:number;

  constructor(private headquarterService: HeadquartersService,
    private _router: Router,
    private _activateRoute: ActivatedRoute, ) {

      this._activateRoute.params.subscribe(params => {
        console.log('Parametro', params['id']);
        this.idAlly =  params['id']
      });
      
      this.headquarterService.getHeadquarters().subscribe(res => {
    
      res.forEach((headquarters: Headquarters) => {
        const dates: Headquarters = {};
        dates.id = headquarters.id;
        dates.name = headquarters.name
        this.headquartersgetting.push(dates)
        console.log(this.headquartersgetting);

      })

    })
    /*  //inicialization service with collections dishes-categories
    this.dishCategory.getDishCategory().subscribe(dishesCat => {
      this.dishesCategories = dishesCat;
    }) */
  }

  ngOnInit() {
  }
  createHeadquart() {
    this._router.navigate( ['/main','createHeadquarter',this.idAlly] )
  }
  editAlly(){
    this._router.navigate( ['/main','editAlly',this.idAlly] )
  }
  editMenu(){
    this._router.navigate( ['/main','editmenu',this.idAlly] )

  }

}
