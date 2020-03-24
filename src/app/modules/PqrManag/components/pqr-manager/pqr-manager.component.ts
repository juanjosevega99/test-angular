import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PqrsService } from 'src/app/services/pqrs.service';
import { Pqrs } from 'src/app/models/Pqrs';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/Users';

@Component({
  selector: 'app-pqr-manager',
  templateUrl: './pqr-manager.component.html',
  styleUrls: ['./pqr-manager.component.scss']
})
export class PqrManagerComponent implements OnInit {

  infoUSer: Pqrs = {};
  response: String = '';

  constructor( private activateParams: ActivatedRoute, private pqrservice: PqrsService, private userService : UsersService ) {

    this.activateParams.params.subscribe( res=> {
      
      this.pqrservice.getCPqrsById(res.id).subscribe(
        (pqr: any) => {

          this.userService.getUserById(pqr.idUser).subscribe((user: Users) => {
            this.infoUSer.id = res.id;
            this.infoUSer.nameUser = user.name;
            this.infoUSer.phone = user.phone;
            this.infoUSer.birthday = this.convertDate( user.birthday );
            this.infoUSer.gender = user.gender;
            this.infoUSer.nameAllie = pqr.nameAllie;
            this.infoUSer.nameHeadquarter = pqr.nameHeadquarter;
            this.infoUSer.date = this.convertDate( pqr.date );
            this.infoUSer.state = pqr.state;
            this.response = pqr.reply;
            
          }) 
        
        
      }
      )
      
    })
   }

  ngOnInit() {
  }

  reply( res ){
  
    this.infoUSer['reply'] = this.response.toString();
    this.infoUSer.state = true;
    console.log(this.response, this.infoUSer);
    this.pqrservice.updatePqr( this.infoUSer.id, this.infoUSer ).subscribe(
      res => console.log("se hizo la actualizacion", res)
      
    )

    
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
