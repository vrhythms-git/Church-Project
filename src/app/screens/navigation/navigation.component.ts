import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'
import { uiCommonUtils } from '../../common/uiCommonUtils'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private uiCommonUtils: uiCommonUtils, private router: Router, private ApiService: ApiService) { }
  opened = true;
  userMetaData: any;
  numberOfMenusElements: any;
  datetimeString: any;
  lastLoggedInDateTime:any;
  ngOnInit(): void {

    this.userMetaData = JSON.parse(localStorage.getItem('chUserMetaData') || '{}');
    console.log('userMetaData is :' + JSON.stringify(this.userMetaData))

    console.log("Timestamp data is : "+this.userMetaData.lastLoggedIn.toString(''));
    this.lastLoggedInDateTime = this.userMetaData.lastLoggedIn;
    var date = new Date(this.userMetaData.lastLoggedIn).toLocaleDateString("en-us");
    //var time = new Date(this.userMetaData.lastLoggedIn).toLocaleTimeString("en-us");
    //this.datetimeString = new Date(this.lastLoggedInDateTime).toLocaleString("en-us");
    this.datetimeString = new Date(this.lastLoggedInDateTime).toLocaleDateString("en-us");
    console.log("date : " + date);
    //console.log("time : " + time);
    //console.log("string : " + this.datetimeString);

    if (this.userMetaData.menus) {
      this.numberOfMenusElements = this.userMetaData.menus.length;
    } else
      this.numberOfMenusElements = 0;
    // console.log(' available User menu are : ' + JSON.stringify(this.userMetaData.menus[0]));
    // console.log(' available User menu are : ' + JSON.stringify(this.userMetaData.menus[1]));

    // console.log(' available Menu length is : ' + this.numberOfMenusElements);



  }

  onmyProfileclick() {
    this.router.navigate(['/dashboard/myprofile']);
  }

  handleLogoutBtnClick() {

    let loggedInUser = this.uiCommonUtils.getUserMetaDataJson().userId;
    this.ApiService.callGetService(`logout?user=${loggedInUser}`).subscribe((data) => {
      localStorage.setItem('chUserToken', '');
      localStorage.setItem('chUserFbId', '');
      localStorage.setItem('chUserMetaData', '');
      this.router.navigate(['/signin']);
    });
  }
}
