import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShowContentService } from 'src/app/services/providers/show-content.service';
import { profileStorage } from 'src/app/models/ProfileStorage';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit, OnDestroy {

  date:String;
  time:String;
  today:Date;
  profile : profileStorage = new profileStorage();
  timeTick :any;

  constructor( private showcontentservice: ShowContentService) { 
    this.profile =  this.showcontentservice.showMenus();
  }

  ngOnInit() {
    this.tick();
    this.timeTick = setInterval( ()=>this.tick(), 20000 );
  }

  ngOnDestroy(){
    clearTimeout(this.timeTick);
  }

  tick(): void{
    this.today = new Date();
    this.time = this.today.toLocaleString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
    this.date = this.today.toLocaleString('es-ES',{weekday:'short',day:'2-digit',month:'long',year:'numeric'});
  }

}

