import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from "../environments/environment";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { HeaderComponent } from "./header/header.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { AppNavbarComponent } from './shared/app-navbar/app-navbar.component';
import { OptionsComponent } from './modules/options/components/options/options.component'
import { LoginComponent } from './shared/login/login.component';
import { ClockComponent } from './shared/clock/clock.component';
import { LoginFormComponent } from './shared/login-form/login-form.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { LoginForgetComponent } from './shared/login-forget/login-forget.component';
import { ResestPasswordComponent } from './shared/resest-password/resest-password.component';
import { AllyManagerComponent } from './modules/AllyManag/components/ally-manager/ally-manager.component';
import { UserManagerComponent } from './modules/UserManag/components/user-manager/user-manager.component';
import { PromoManagerComponent } from './modules/PromManag/components/promo-manager/promo-manager.component';
import { CuponManagerComponent } from './modules/CupManag/components/cupon-manager/cupon-manager.component';
import { ReportGeneratorComponent } from './modules/ReportGen/components/report-generator/report-generator.component';
import { PqrManagerComponent } from './modules/PqrManag/components/pqr-manager/pqr-manager.component';
import { BannerManagerComponent } from './modules/BannerManag/components/banner-manager/banner-manager.component';
import { TycManagerComponent } from './modules/TycManag/components/tyc-manager/tyc-manager.component';
import { CreateAllyComponent } from './modules/AllyManag/components/create-ally/create-ally.component';
import { MainComponent } from './components/main/main.component';
import { HeadquartersOptionsComponent } from './modules/AllyManag/components/headquarters-options/headquarters-options.component';
import { CreateHeadquarterComponent } from './modules/AllyManag/components/create-headquarter/create-headquarter.component';
import {NgxPrintModule} from 'ngx-print';
import { EditMenuComponent } from './modules/AllyManag/components/edit-menu/edit-menu.component';
import { CreateDishComponent } from './modules/AllyManag/components/create-dish/create-dish.component';
import { AccompanimentsComponent } from './modules/AllyManag/components/accompaniments/accompaniments.component';
import { ProfileComponent } from './modules/AllyManag/components/profile/profile.component';
import { CreateProfileComponent } from './modules/AllyManag/components/create-profile/create-profile.component';
import { UploadImagesService } from "./services/providers/uploadImages.service";
import { LocationServiceService } from './services/location-service.service';
import { PqrListComponent } from './modules/PqrManag/components/pqr-list/pqr-list.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { PrincipalOrdersComponent } from './principal/principal-orders/principal-orders.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { OrderComponent } from './principal/order/order.component';
import { TypeServiceImgDirective } from './directives/type-service-img.directive';
import { CronometerStateDirective } from './directives/cronometer-state.directive';
import { CreateCouponComponent } from './modules/CupManag/create-coupon/create-coupon.component';

// full calendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CreateBannerComponent } from './modules/BannerManag/components/create-banner/create-banner.component';
import { CreateTycComponent } from './modules/TycManag/create-tyc/create-tyc.component';
import { NotificationsOrdersComponent } from './components/notifications-orders/notifications-orders.component';
import { NotificationsPqrsComponent } from './components/notifications-pqrs/notifications-pqrs.component';

// Angular google maps
import { AgmCoreModule } from '@agm/core';
import { FrequentQuestionsManagComponent } from './modules/TycManag/frequent-questions-manag/frequent-questions-manag.component';
import { CreateFrequentQuestionsComponent } from './modules/TycManag/frequent-questions-manag/create-frequent-questions/create-frequent-questions.component';



import { AuthService } from './services/auth.service'

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
    AppNavbarComponent,
    OptionsComponent,
    LoginComponent,
    ClockComponent,
    LoginFormComponent,
    SideBarComponent,
    LoginForgetComponent,
    ResestPasswordComponent,
    AllyManagerComponent,
    UserManagerComponent,
    PromoManagerComponent,
    CuponManagerComponent,
    ReportGeneratorComponent,
    PqrManagerComponent,
    BannerManagerComponent,
    TycManagerComponent,
    CreateAllyComponent,
    MainComponent,
    HeadquartersOptionsComponent,
    CreateHeadquarterComponent,
    EditMenuComponent,
    CreateDishComponent,
    AccompanimentsComponent,
    ProfileComponent,
    CreateProfileComponent,
    PqrListComponent,
    PrincipalOrdersComponent,
    LoadingComponent,
    OrderComponent,
    TypeServiceImgDirective,
    CronometerStateDirective,
    CreateCouponComponent,
    CreateBannerComponent,
    CreateTycComponent,
    NotificationsOrdersComponent,
    NotificationsPqrsComponent,
    FrequentQuestionsManagComponent,
    CreateFrequentQuestionsComponent,

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
    AngularFireStorageModule,
    NgbModule,
    DpDatePickerModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgImageSliderModule,
    ReactiveFormsModule,
    NgxPrintModule,
    TooltipModule,
    FullCalendarModule,
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDj-zGjpPk4Zbic3Uv_CSemyKU3Gsoo28U'
    })
    
    
  ],
  providers: [
    UploadImagesService,
    LocationServiceService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
