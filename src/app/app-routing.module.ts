import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from 'src/app/screens/sign-up/sign-up.component'
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { HomePageComponent } from './screens/home-page/home-page.component';
import { LandingPageComponent } from './screens/landing-page/landing-page.component';
import { UserProfileComponent } from './screens/user-profile/user-profile.component';
import { OvbsRegistrationComponent } from './screens/ovbs-registration/ovbs-registration.component';
import { AppComponent } from './app.component';
import { EventsComponent } from './screens/events/events.component';
import { EventCreationComponent } from './screens/event-creation/event-creation.component';
import { MyProfileComponent } from './screens/my-profile/my-profile.component';


const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'signin', component: SignInComponent},
  { path: '', component:HomePageComponent},
  { path: 'landingpage', component:LandingPageComponent},
  { path: 'dashboard', component:UserProfileComponent,
  children: [
    { path: 'ovbsregistration', component: OvbsRegistrationComponent },
    { path: 'users',component:LandingPageComponent},
    { path: 'events', component: EventsComponent},
    {path : 'myprofile', component:MyProfileComponent}
    // { path: 'testEvent',component:UserProfileComponent},
  ]
},
  //{ path: 'landingpage/ovbsregistration', component:OvbsRegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents =[OvbsRegistrationComponent,UserProfileComponent]
