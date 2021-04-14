import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login-acc-list',
  templateUrl: './login-acc-list.component.html',
  styleUrls: ['./login-acc-list.component.css']
})
export class LoginAccListComponent implements OnInit {
  columnDefs: any;
  rowData: any;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {

    this.columnDefs = [
      { headerName: 'First Name', field: 'firstname',  width: 160 },
      { headerName: 'Last Name', field: 'lastname',  width: 160 },
      { headerName: 'Role', field: 'role',  width: 160 },
    ],

    this.rowData = [
      { firstname: 'ABC', lastname: 'XYZ' ,role:'Family Head'},
      { firstname: 'PQR', lastname: 'XYZ' ,role:'Member'},
      { firstname: 'UVW', lastname: 'XYZ' ,role:'Member'},
  ];
  
  }

  onRowClicked(event:any){
    console.log(event);
    this.router.navigate(['/dashboard']);

    //getMetadata api call

  }


}
