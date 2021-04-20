import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from "@angular/router";
import { uiCommonUtils } from "../../common/uiCommonUtils"

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor( public router: Router, private uiCommonUtils:uiCommonUtils) { }

  ngOnInit(): void {

    let userMetaData =  this.uiCommonUtils.getUserMetaDataJson()

    if(userMetaData.isApproved == false) 
        this.uiCommonUtils.showSnackBar("Your account has not been approved yet!",'error', 4000)
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
