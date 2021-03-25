import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.css']
})
export class ButtonRendererComponent implements OnInit {

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

  // getUserData(){
  //   this.apiService.getUsersData({ data: this.userRecords }).subscribe((res) =>{
  //     console.log('These are users from database : ');
  //     console.log(res);
  //     this.rowData = res;
  // });
  // }

  // editUserData(){
  //   let rowData = this.params;
  //   let selectedUserData = this.params.data;
  //   console.log(selectedUserData);
  //   let i = rowData.rowIndex;
  //   // localStorage.setItem('curId', String(this.params.data.EMP_ID));
  //   // this.router.navigate(["/userprofile"]);
  //   this.getUserData();
  // }

}

// onClick($event) {
//   if (this.params.onClick instanceof Function) {
//     // put anything into params u want pass into parents component
//     const params = {
//       event: $event,
//       id:$event.currentTarget.id,
//       rowData: this.params.node.data
//     }
//     this.params.onClick(params);
//   }
// }
