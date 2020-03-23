import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PqrsService } from 'src/app/services/pqrs.service';
import { Pqrs } from 'src/app/models/Pqrs';

@Component({
  selector: 'app-pqr-manager',
  templateUrl: './pqr-manager.component.html',
  styleUrls: ['./pqr-manager.component.scss']
})
export class PqrManagerComponent implements OnInit {

  infoUSer: Pqrs = {};

  constructor( private activateParams: ActivatedRoute, private pqrservice: PqrsService ) {

    this.activateParams.params.subscribe( res=> {
      
      this.pqrservice.getCPqrsById(res.id).subscribe(
        (res: any) => {
        
        this.infoUSer.nameUser = res.nameUser;
        this.infoUSer.phone = res.phone;
        this.infoUSer.birthday = this.convertDate( res.birthday );
        this.infoUSer.gender = res.gender;
        this.infoUSer.nameAllie = res.nameAllie;
        this.infoUSer.nameHeadquarter = res.nameHeadquarter;
        this.infoUSer.date = this.convertDate( res.date );
        console.log(this.infoUSer);
        
      }
      )
      
    })
   }

  ngOnInit() {
  }

  convertDate(date: Date): string {
    let n:string;
    try{
  
      const d = new Date(date);
      n = d.toISOString().split("T")[0];
    }catch{
      console.log(date);
      
    }
    return n;
  }
}
