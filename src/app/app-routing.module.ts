import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from 'src/app/screens/sign-up/sign-up.component'
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { HomePageComponent } from './screens/home-page/home-page.component';
import { LandingPageComponent } from './screens/landing-page/landing-page.component';
import { UserProfileComponent } from './screens/user-profile/user-profile.component';


const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'signin', component: SignInComponent},
  { path: '', component:HomePageComponent},
  { path: 'landingpage', component:LandingPageComponent},
  { path: 'userprofile', component:UserProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
