import { Component, OnInit } from '@angular/core';
import { WebsocketsService } from 'src/app/services/websockets.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private wesocket: WebsocketsService) { }

  ngOnInit() {
    // listen websocket
    this.wesocket.listen('connection').subscribe(res => {
      console.log(res);
    })
  }

}
