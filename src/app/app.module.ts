import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule,routingComponents } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SignUpComponent } from './screens/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import {MatIconModule} from '@angular/material/icon';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { NgxFlagPickerModule } from 'ngx-flag-picker';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { FooterComponent } from './screens/footer/footer.component';
import { NavigationComponent } from './screens/navigation/navigation.component';
import { HomePageComponent } from './screens/home-page/home-page.component';
import { LandingPageComponent } from './screens/landing-page/landing-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { UserProfileComponent } from './screens/user-profile/user-profile.component';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment.prod';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Auth service
import { AuthService } from "./services/auth.service";

import { MatButtonModule} from '@angular/material/button';
import { NavbarModule, WavesModule, ButtonsModule } from 'ng-uikit-pro-standard';
//import { OvbsRegistrationComponent } from './screens/ovbs-registration/ovbs-registration.component';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';



@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    FooterComponent,
    NavigationComponent,
    HomePageComponent,
    LandingPageComponent,
    routingComponents
    //UserProfileComponent,
    //OvbsRegistrationComponent
  ],
  imports: [

    //imports for firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    Ng2TelInputModule,
    NgxFlagPickerModule ,
    FlexLayoutModule,
    MatSnackBarModule,
    HttpClientModule,   
    MatButtonModule,
    NavbarModule, 
    WavesModule, 
    ButtonsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
