import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { NewPasswordComponent } from './password-recovery/new-password/new-password.component';
import { PrincipalPageComponent } from './principal/principal-page/principal-page.component';
import { MainMenuComponent } from './menu/main-menu/main-menu.component';
import { ListAliadosComponent } from './aliados/list-aliados/list-aliados/list-aliados.component';
import { AddEstablecimientoComponent } from './aliados/add-establecimiento/add-establecimiento.component';
import { AddSedeComponent } from './aliados/add-sede/add-sede.component';
import { MenuAliadoComponent } from './aliados/menu-aliado/menu-aliado.component';
import { ListSedesComponent } from './list-sedes/list-sedes.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { AppNavbarComponent } from './shared/app-navbar/app-navbar.component';
import { OptionsComponent } from './modules/options/components/options/options.component';
import { LoginComponent } from './shared/login/login.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { LoginForgetComponent } from './shared/login-forget/login-forget.component';
import { AllyManagerComponent } from './modules/AllyManag/components/ally-manager/ally-manager.component';
import { UserManagerComponent } from './modules/UserManag/components/user-manager/user-manager.component';
import { PromoManagerComponent } from './modules/PromManag/components/promo-manager/promo-manager.component';
import { CuponManagerComponent } from './modules/CupManag/components/cupon-manager/cupon-manager.component';
import { ReportGeneratorComponent } from './modules/ReportGen/components/report-generator/report-generator.component';
import { PqrManagerComponent } from './modules/PqrManag/components/pqr-manager/pqr-manager.component';
import { BannerManagerComponent } from './modules/BannerManag/components/banner-manager/banner-manager.component';
import { TycManagerComponent } from './modules/TycManag/components/tyc-manager/tyc-manager.component';
import { LoginFormComponent } from './shared/login-form/login-form.component';
import { ResestPasswordComponent } from './shared/resest-password/resest-password.component';
import { MainComponent } from './components/main/main.component';
import { HeadquartersOptionsComponent } from './modules/AllyManag/components/headquarters-options/headquarters-options.component';
import { CreateHeadquarterComponent } from './modules/AllyManag/components/create-headquarter/create-headquarter.component';
import { CreateAllyComponent } from './modules/AllyManag/components/create-ally/create-ally.component';
import { EditMenuComponent } from './modules/AllyManag/components/edit-menu/edit-menu.component';
import { CreateDishComponent } from './modules/AllyManag/components/create-dish/create-dish.component';
import { AccompanimentsComponent } from './modules/AllyManag/components/accompaniments/accompaniments.component';
import { ProfileComponent } from './modules/AllyManag/components/profile/profile.component';
import { CreateProfileComponent } from './modules/AllyManag/components/create-profile/create-profile.component';
import { PqrListComponent } from './modules/PqrManag/components/pqr-list/pqr-list.component';
import { PrincipalOrdersComponent } from './principal/principal-orders/principal-orders.component';


const routes: Routes = [
  {
    path: "log",
    component: LoginComponent,
    children: [

      // { path: "recovery_password", component: PasswordRecoveryComponent },
      { path: "reset_password", component: ResestPasswordComponent },
      { path: "forget", component: LoginForgetComponent },
      { path: "loginForm", component: LoginFormComponent },

      { path: "**", redirectTo: "loginForm", pathMatch: 'full' },

    ]
  },

  {
    path: "main",
    component: MainComponent,
    children: [

      { path: "principal", component: PrincipalPageComponent },
      { path: "principal-orders", component: PrincipalOrdersComponent },
      { path: "options", component: OptionsComponent },
      { path: "userManager", component: UserManagerComponent },
      { path: "allyManager", component: AllyManagerComponent },
      { path: "createAlly", component: CreateAllyComponent },
      { path: "editAlly/:id", component: CreateAllyComponent },
      { path: "promoManager", component: PromoManagerComponent },
      { path: "cuponManager", component: CuponManagerComponent },
      { path: "reportGenerator", component: ReportGeneratorComponent },
      { path: "pqrList", component: PqrListComponent },
      { path: "pqrManager/:id", component: PqrManagerComponent },
      { path: "bannerManager", component: BannerManagerComponent },
      { path: "tycManager", component: TycManagerComponent },
      { path: "add-sede", component: AddSedeComponent },
      { path: "createHeadquarter", component: CreateHeadquarterComponent },
      { path: "editmenu", component: EditMenuComponent },
      { path: "createDish", component: CreateDishComponent },
      { path : "accompaniments", component: AccompanimentsComponent},
      { path : "profiles", component: ProfileComponent},
      { path : "createProfile/:id", component: CreateProfileComponent},
      { path: "headquarts", component: HeadquartersOptionsComponent },
      
      { path: "**", redirectTo: "options", pathMatch: 'full' },

    ]
    
  },
  { path: "navbar", component: AppNavbarComponent },
  { path: "menu", component: MainMenuComponent },
  { path: "aliados", component: ListAliadosComponent },
  { path: "add-aliado", component: AddEstablecimientoComponent },
  { path: "menu-aliado", component: MenuAliadoComponent },
  { path: "sedes", component: ListSedesComponent },
  { path: "add-menu", component: AddMenuComponent },
  { path: "side-bar", component: SideBarComponent },
  { path: "headquarts", component: HeadquartersOptionsComponent },
  { path: "**", redirectTo: "log", pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
