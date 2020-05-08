import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PqrsService } from 'src/app/services/pqrs.service';
import { Pqrs } from 'src/app/models/Pqrs';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/Users';

import * as jsPDF from 'jspdf';
import { Location } from '@angular/common';
import { ShowContentService } from 'src/app/services/providers/show-content.service';
import { HeadquartersService } from 'src/app/services/headquarters.service';
import { profileStorage } from 'src/app/models/ProfileStorage';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { SendmailService } from 'src/app/services/providers/sendmail.service';
import { sendmail } from 'src/app/models/senmailinterface';

@Component({
  selector: 'app-pqr-manager',
  templateUrl: './pqr-manager.component.html',
  styleUrls: ['./pqr-manager.component.scss']
})
export class PqrManagerComponent implements OnInit {

  infoUSer: Pqrs = {};
  response: string = '';
  alertEmpty = false;

  location = "bogota";

  profile: profileStorage = new profileStorage();
  dateCreatePqr = ''; //this is for save the real date of pqr, iss nescesaary to updae pqr
  toPdf = {}

  constructor(private activateParams: ActivatedRoute, private pqrservice: PqrsService, private userService: UsersService,
    private _location: Location, private profileService: ShowContentService, private headService: HeadquartersService, private spinner: NgxSpinnerService,
    private sendmail: SendmailService) {

    this.activateParams.params.subscribe(res => {

      this.loadPRQ(res);

    })

    this.profile = this.profileService.showMenus();
  }

  ngOnInit() {
  }

  back() {
    this._location.back();
  }


  loadPRQ(res:any){

    this.spinner.show();

    this.pqrservice.getCPqrsById(res.id).subscribe(
      (pqr: any) => {

        this.headService.getHeadquarterById( pqr.idHeadquarter ).subscribe( head=>{
          this.infoUSer.nameHeadquarter = head.name;
          this.infoUSer.nameAllie = head.nameAllies;
          this.location = head.ubication;
        })

        this.userService.getUserById(pqr.idUser).subscribe((user: Users) => {

          this.infoUSer.id = res.id;
          this.infoUSer.nameUser = user.name;
          this.infoUSer.phone = user.phone;
          this.infoUSer.birthday = this.convertDateborn(user.birthday);
          this.infoUSer.gender = user.gender;
          this.infoUSer.date = this.convertDate(pqr.date);
          this.dateCreatePqr = pqr.date;
          this.infoUSer.state = pqr.state;
          this.infoUSer.email = user.email;
          this.infoUSer.description = pqr.description;
          this.infoUSer.typeOfService = pqr.typeOfService;
          this.response = pqr.reply;

          this.spinner.hide();

        })

      }
    )
  }

  // =================
  // response
  // =================
  reply(res) {

    if (this.response) {

      this.spinner.show();

      this.infoUSer['reply'] = this.response.toString();
      this.infoUSer['emailReply'] = this.profile.email;
      this.infoUSer.date = this.dateCreatePqr;
      this.infoUSer.state = true;
      
      let infotoemail: sendmail = {
        username: this.infoUSer.nameUser,
        email: this.infoUSer.email,
        question: this.infoUSer.description,
        reply: this.response,

      }
      
      this.sendmail.sendmail(infotoemail).subscribe(res => {
        
        this.pqrservice.updatePqr(this.infoUSer.id, this.infoUSer).subscribe(res => {
          
          this.alertEmpty = false;
          this.spinner.hide();
          Swal.fire({
            title: "La solicitud fue atendida",
            icon: "success"
          })

        }, err => {

          this.spinner.hide();
          Swal.fire({
            title: "ocurio un error enviando la respuesta",
            icon: "error"
          })
          this.infoUSer.state = false;
        })

      }, err => {

        this.spinner.hide();
        Swal.fire({
          title: "ocurio un error enviando el email con la respuesta",
          icon: "error"
        })
        this.infoUSer.state = false;
      })

    } else {
      this.alertEmpty = true;
    }
  }

  // ========================
  // preparing data
  dataforPdf() {
    this.toPdf = {
      id: this.infoUSer.id,
      de: this.profile.email,
      para: this.infoUSer.email,
      location: this.location,
      ally: this.infoUSer.nameAllie,
      service: this.infoUSer.typeOfService,
      pqr: this.infoUSer.description,
      reply: this.response,
      date: this.infoUSer.date,
    }

    this.generatePdf()

  }

  // ========================
  // generate pdf
  generatePdf() {

    //'p', 'mm', 'a4'
    let doc = new jsPDF('landscape');

    let col = ["Radicado", "De", "para", "zona", "aliado", "Servicio", "Petición",
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


  convertDateborn(date: Date): string {
    let n: string;
    try {

      const d = new Date(date);
      n = d.toISOString().split("T")[0];
    } catch{
      console.log(date);

    }
    return n;
  }

  convertDate(date: Date): string {
    const d = new Date(date);
    const n = d.toLocaleString('es-ES', { day: '2-digit', month: 'numeric', year: 'numeric' }) + " " +
      d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // const n = date.toLocaleString('en-US', { hour12: true });
    return n;
  }
}
