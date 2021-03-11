import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  userMetaData:any;
  ngOnInit(): void {

    this.userMetaData = JSON.parse(localStorage.getItem('chUserMetaData') || '{}');
    console.log('userMetaData is :' + JSON.stringify(this.userMetaData))
  }

}
