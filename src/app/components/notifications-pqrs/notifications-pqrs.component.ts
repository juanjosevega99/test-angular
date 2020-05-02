import { Component, OnInit } from '@angular/core';
import { PqrsService } from 'src/app/services/pqrs.service';
import { profileStorage } from 'src/app/models/ProfileStorage';
import { ShowContentService } from 'src/app/services/providers/show-content.service';
import { WebsocketsService } from 'src/app/services/websockets.service';
import { Pqrs } from 'src/app/models/Pqrs';

@Component({
  selector: 'app-notifications-pqrs',
  templateUrl: './notifications-pqrs.component.html',
  styleUrls: ['./notifications-pqrs.component.scss']
})
export class NotificationsPqrsComponent implements OnInit {

  profile: profileStorage;
  pqrNotifications = 0;
  constructor(private pqrlistservice: PqrsService, private showmenu: ShowContentService, private websocket: WebsocketsService) { 
  this.profile = this.showmenu.showMenus();
  this.loadPqrsnotifications();

  }

  ngOnInit() {

    this.websocket.listen('newPqr').subscribe(() => {
      this.loadPqrsnotifications();
    })

    this.websocket.listen('updatepqr').subscribe(() => {
      this.loadPqrsnotifications();
    })

  }

  loadPqrsnotifications(){
    this.pqrlistservice.getPqrsByHead(this.profile.idHeadquarter).subscribe(res => {
      console.log(res);
      
      if (res.length > 0) {

        // pqr.state is not reply
        let pqr = res.filter( (pqr:Pqrs)=> pqr.state == false );
        this.pqrNotifications = pqr.length;
      }
    })
  }

}
