import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from 'src/app/screens/sign-up/sign-up.component'
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { HomePageComponent } from './screens/home-page/home-page.component';
import { LandingPageComponent } from './screens/landing-page/landing-page.component';
import { UserProfileComponent } from './screens/user-profile/user-profile.component';
import { OvbsRegistrationComponent } from './screens/ovbs-registration/ovbs-registration.component';


const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'signin', component: SignInComponent},
  { path: '', component:HomePageComponent},
  { path: 'landingpage', component:LandingPageComponent,
  children: [
    { path: 'ovbsregistration', component: OvbsRegistrationComponent },
    { path: 'users',component:SignInComponent},
    { path: 'testEvent',component:UserProfileComponent},
  ]
  },
  { path: 'userprofile', component:UserProfileComponent},
  //{ path: 'landingpage/ovbsregistration', component:OvbsRegistrationComponent},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents =[OvbsRegistrationComponent,UserProfileComponent]
