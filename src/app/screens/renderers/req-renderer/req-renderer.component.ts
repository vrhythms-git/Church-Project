import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-req-renderer',
  templateUrl: './req-renderer.component.html',
  styleUrls: ['./req-renderer.component.css']
})
export class ReqRendererComponent implements OnInit {

  data: any;
  params: any;
  rowData : any;
  userRecords : any;
  
  constructor(private apiService : ApiService, private router : Router) { }

  agInit(params:  any) {
    this.params = params;
    this.data = params.value;
  }
  ngOnInit(): void {
  }

}
