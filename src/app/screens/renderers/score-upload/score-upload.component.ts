import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-upload',
  templateUrl: './score-upload.component.html',
  styleUrls: ['./score-upload.component.css']
})
export class ScoreUploadComponent implements OnInit {

  constructor() { }

  data: any;
  params: any;
  rowData : any;
  userRecords : any;

  agInit(params:  any) {
    this.params = params;
    this.data = params.value;
  }

  
  ngOnInit(): void {
  }

}
