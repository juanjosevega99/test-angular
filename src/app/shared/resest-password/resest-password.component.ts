import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms"

@Component({
  selector: 'app-resest-password',
  templateUrl: './resest-password.component.html',
  styleUrls: ['./resest-password.component.scss', '../login/login.component.scss']
})
export class ResestPasswordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  send(forma:NgForm ){

    console.log(forma);
  }

}
