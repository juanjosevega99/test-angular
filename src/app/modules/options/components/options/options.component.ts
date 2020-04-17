import { Component } from '@angular/core';
import { ShowContentService } from 'src/app/services/providers/show-content.service';
import { profileStorage } from 'src/app/models/ProfileStorage';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  profile: profileStorage = new profileStorage;

  constructor( private showmenu: ShowContentService ) {

    this.profile = this.showmenu.showMenus();

   }

}
