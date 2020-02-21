import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-login-forget',
  templateUrl: './login-forget.component.html',
  styleUrls: ['./login-forget.component.scss', '../login/login.component.scss']
})
export class LoginForgetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  send(forma:NgForm ){

    console.log(forma);

  }

}
