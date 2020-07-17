import { Injectable } from '@angular/core';
import { profileStorage } from '../../models/ProfileStorage';

@Injectable({
  providedIn: 'root'
})
export class ShowContentService {

  constructor() { }


  showMenus(): profileStorage {
    let profile: profileStorage = new profileStorage();

    let profilest = JSON.parse(localStorage.getItem('tifi_user'))

    profile.nameAllie = 'test';
    profile.nameHeadquarter = profilest.headquarter.name;
    profile.idHeadquarter = profilest.headquarter._id;
    profile.id = profilest.id;
    profile.nameCharge = profilest.role.name;
    profile.idAllies = profilest.headquarter.idAllies;
    profile.photo = 'default.png';
    profile.email = profilest.email;
    profile.name = profilest.name;

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

    switch (profilest.role.name) {

      case 'cajero':
      case 'GerenteGeneral':
        showContent.principal = true;
        break;
      case 'asesor':
        showContent.pqrs = true;
        break;
      case 'contador':
        showContent.reports = true;
        break;
      case 'Administrator':
        showContent.options = true;
        break;

      case 'administradorPDV':
        showContent.pqrs = true;
        showContent.principal = true;
        break;
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
