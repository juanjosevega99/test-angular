import { Injectable } from '@angular/core';
import { profileStorage } from '../../models/ProfileStorage';

@Injectable({
  providedIn: 'root'
})
export class ShowContentService {

  constructor() { }


  showMenus(): profileStorage {
    let profile: profileStorage = new profileStorage();

    let profilest = JSON.parse(localStorage.getItem('profile'));

      profile.nameAllie = profilest.nameAllie;
      profile.nameHeadquarter = profilest['nameHeadquarter'];
      profile.idHeadquarter = profilest['idHeadquarter'];
      profile.id = profilest['id'];
      profile.nameCharge = profilest.nameCharge;
      profile.idAllies = profilest.idAllies;
      profile.photo = profilest.photo;
      profile.email = profilest.email;

      let showContent = {
        options: false,
        principal: false,
        reports: false,
        pqrs: false
      }

      let reportsPermis = {

        reportComplete: false,
        reportadminpdv: false,
        reportsummary: false,

      }

      switch (profilest['nameCharge']) {

        case 'cajero':
        case 'administradorPDV':
        case 'GerenteGeneral':
          showContent.principal = true;
          break;
        case 'asesor':
          showContent.pqrs = true;
          break;
        case 'contador':
          showContent.reports = true;
          break;
        case 'administradorTIFI':
          showContent.options = true;
      }

      // ================================
      // Reports Permis

      switch (profilest['permis']) {

        case 'cajero':
          reportsPermis.reportsummary = true;
          break;
        case 'administradorPDV':
          reportsPermis.reportadminpdv = true;
          break;
        case 'GerenteGeneral':
          reportsPermis.reportComplete = true;
          break;
      }

      profile.reportPermissions = reportsPermis;
      profile.showContent = showContent;

      return profile;

  }

}
