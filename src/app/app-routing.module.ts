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
import { AddMenuComponent } from './add-menu/add-menu.component'
import { AppNavbarComponent } from './shared/app-navbar/app-navbar.component';
import { LoginComponent } from './shared/login/login.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { LoginForgetComponent } from './shared/login-forget/login-forget.component';


const routes: Routes = [
  {path:"log", component:LoginComponent},
  {path:"login", component:LoginPageComponent},
  {path:"navbar", component:AppNavbarComponent},
  {path:"", redirectTo:"/login", pathMatch:'full'},
  {path:"recovery_password", component: PasswordRecoveryComponent},
  {path:"reset_password", component: NewPasswordComponent},
  {path:"principal", component:PrincipalPageComponent},
  {path:"menu", component:MainMenuComponent},
  {path:"aliados", component:ListAliadosComponent},
  {path:"add-aliado", component:AddEstablecimientoComponent},
  {path:"add-sede", component:AddSedeComponent},
  {path:"menu-aliado",component:MenuAliadoComponent },
  {path:"sedes",component:ListSedesComponent },
  {path:"add-menu", component:AddMenuComponent},
  {path:"side-bar", component:SideBarComponent},
  {path:"log/forget", component:LoginForgetComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
