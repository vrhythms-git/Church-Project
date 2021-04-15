import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor( public router: Router) { }

  ngOnInit(): void {
  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    //  alert('Back Button Pressed....')
    localStorage.setItem('chUserToken', '');
    localStorage.setItem('chUserFbId', '');
    localStorage.setItem('chUserMetaData', '');
    //this.router.navigate(['/']);

  }

}
