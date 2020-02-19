import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from "../environments/environment";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { HeaderComponent } from "./header/header.component";
import { FormsModule } from "@angular/forms";
import { PasswordRecoveryComponent } from "./password-recovery/password-recovery.component";
import { NewPasswordComponent } from "./password-recovery/new-password/new-password.component";
import { ShowHidePasswordModule } from "ngx-show-hide-password";
import { NgxSpinnerModule } from "ngx-spinner";
import { PrincipalPageComponent } from "./principal/principal-page/principal-page.component";
import { ProgressBarModule } from "angular-progress-bar";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DpDatePickerModule } from "ng2-date-picker";
import { HttpClientModule } from "@angular/common/http";
import { MainMenuComponent } from './menu/main-menu/main-menu.component';
import { ListAliadosComponent } from './aliados/list-aliados/list-aliados/list-aliados.component';
import { AddEstablecimientoComponent } from './aliados/add-establecimiento/add-establecimiento.component';
import { AddSedeComponent } from './aliados/add-sede/add-sede.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material';
import { MenuAliadoComponent } from './aliados/menu-aliado/menu-aliado.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ListSedesComponent } from './list-sedes/list-sedes.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HeaderComponent,
    PasswordRecoveryComponent,
    NewPasswordComponent,
    PrincipalPageComponent,
    MainMenuComponent,
    ListAliadosComponent,
    AddEstablecimientoComponent,
    AddSedeComponent,
    MenuAliadoComponent,
    ListSedesComponent,
    AddMenuComponent,
  ],
  imports: [
    HttpClientModule,
    NgbModule,
    MatRadioModule,
    MatCheckboxModule,
    ProgressBarModule,
    ShowHidePasswordModule,
    FormsModule,
    NgxSpinnerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    NgbModule,
    DpDatePickerModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgImageSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
