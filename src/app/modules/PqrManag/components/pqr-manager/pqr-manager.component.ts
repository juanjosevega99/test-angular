import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PqrsService } from 'src/app/services/pqrs.service';
import { Pqrs } from 'src/app/models/Pqrs';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/Users';

import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-pqr-manager',
  templateUrl: './pqr-manager.component.html',
  styleUrls: ['./pqr-manager.component.scss']
})
export class PqrManagerComponent implements OnInit {

  infoUSer: Pqrs = {};
  response: String = '';

  operator: Users = {
    email : "email@example.com",
    location: "bogota"
  }

  toPdf = { }

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
            this.infoUSer.email = user.email;
            this.infoUSer.description = pqr.description;
            this.infoUSer.typeOfService = pqr.typeOfService;
            this.response = pqr.reply;
            
          }) 
        
        
      }
      )
      
    })
   }

  ngOnInit() {
  }

  // =================
  // response
  // =================
  reply( res ){
  
    this.infoUSer['reply'] = this.response.toString();
    this.infoUSer['emailReply'] = this.operator.email;
    this.infoUSer.state = true;
    console.log(this.response, this.infoUSer);
    this.pqrservice.updatePqr( this.infoUSer.id, this.infoUSer ).subscribe(
      res => console.log("se hizo la actualizacion", res)
      
    )
  }

  // ========================
  // preparing data
  dataforPdf(){
    this.toPdf = {
      id: this.infoUSer.id,
      de: this.operator.email,
      para:this.infoUSer.email,
      location: this.operator.location,
      ally : this.infoUSer.nameAllie,
      service: this.infoUSer.typeOfService,
      pqr: this.infoUSer.description,
      reply: this.response,
      date: this.infoUSer.date,
    }

    console.log(this.toPdf);
    

    this.generatePdf()

  }

  // ========================
  // generate pdf
  generatePdf() {
    
    //'p', 'mm', 'a4'
    let doc = new jsPDF('landscape');

    let col = ["Radicado", "De", "para",  "zona", "aliado" ,"Servicio", "Petición",  
    "Respuesta", "Fecha"];

    let rows = [];
    let auxrow = [];
      for (const key in this.toPdf) {

        if (this.toPdf.hasOwnProperty(key)) {
          // Mostrando en pantalla la clave junto a su valor
          
          auxrow.push(this.toPdf[key]);
        }
      }
      rows.push(auxrow);

    //build the pdf file
    doc.autoTable(col, rows);
    doc.save('Pqr-' + this.infoUSer.id + " -" + this.infoUSer.nameUser + ".pdf");
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
