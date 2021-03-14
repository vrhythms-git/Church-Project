import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// import { ButtonRendererComponent } from '../button-renderer/button-renderer.component';
import { GridOptions, GridApi } from "ag-grid-community";
declare let $: any;


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  gridOptions: any;
  userRecords: any;
  columnDefs!: any[];
  rowData: any;
  term: any;
  private GridApi: any;
  node: any;
  data: any;
  params: any;
  updateuserinfo:any;
  rolefields:any;

  constructor(private apiService: ApiService,
    private http: HttpClient, private formBuilder:FormBuilder) { }
  // this.gridOptions = <GridOptions>{};

  agInit(params: any) {
    this.params = params;
    this.data = params.value;
  }
  ngOnInit(): void {
    this.updateuserinfo = this.formBuilder.group({
      firstName : new FormControl('', Validators.required),
      middleName : new FormControl('', Validators.required),
      lastName : new FormControl('', Validators.required),
      dateofBirth : new FormControl('', [Validators.required]), 
      mobilenumber: new FormControl('', [Validators.required]),
      emailAddress : new FormControl(''),
      addressLine1 : new FormControl('', Validators.required),
      addressLine2 : new FormControl('', Validators.required),
      city : new FormControl('', Validators.required),
      postalCode : new FormControl('', Validators.required),
      country : new FormControl('', Validators.required),
      rolefields:this.formBuilder.array([this.adduserroles()]),
    });

    this.columnDefs = [
      { headerName: 'First Name', field: 'firstName', sortable: true, filter: true, width: 170, checkboxSelection: true },
      { headerName: 'Middle Name', field: 'middleNmae', sortable: true, filter: true, width: 170 },
      { headerName: 'Last Name', field: 'lastName', sortable: true, filter: true, width: 170 },
      { headerName: 'Email Id', field: 'emailId', sortable: true, filter: true, width: 220 },
      { headerName: 'Mobile Number', field: 'mobileNo', sortable: true, filter: true }
    ];

    this.apiService.getUsersData({ data: this.userRecords }).subscribe((res) => {
      console.log('These are users from database : ');
      console.log(res.data.metaData);
      this.rowData = res.data.metaData;
      
    });
    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      treeData: true,
      // autoGroupColumnDef: this.autoGroupColumnDef,
      // getDataPath: this.getDataPath,
      enableFilter: true,
      enableColResize: true,
      defaultColDef: {
        // make every column editable
        editable: false,
        // make every column use 'text' filter by default
        filter: 'agTextColumnFilter'
      }
    };
  }
  onRowClicked(event: any) {
    $("#imagemodal").modal("show");

    let rowData = event;
    let selectedUserData = event.data;
    console.log(selectedUserData);
    let i = rowData.rowIndex;

    //this.updateuserinfo.controls.country.patchValue("AAAAAAA");
    this.updateuserinfo.patchValue({
      firstName : selectedUserData.firstName,
      middleName : selectedUserData.middleNmae,
      lastName : selectedUserData.lastName,
      dateofBirth : selectedUserData.dob,
      mobilenumber : selectedUserData.mobileNo,
      emailAddress : selectedUserData.emailId,
      addressLine1 : selectedUserData.addressLine1,
      addressLine2 : selectedUserData.addressLine2,
       city : selectedUserData.city,
       postalCode : selectedUserData.postalCode,
       country : selectedUserData.country,
       
    })
  }

  onaddbtnclick(){
    this.rolefields = this.updateuserinfo.get('rolefields') as FormArray;
    this.rolefields.push(this. adduserroles());
  }

  adduserroles(): FormGroup {
    return this.formBuilder.group({
      role: '',
      accesslvltype: '',
      accesslvlid: ''
    });
  }

  onremovebtnclick(index: any)
  {
    (<FormArray>this.updateuserinfo.get('rolefields').removeAt(index));
  }

  updateUserProfile(){
    if (this.updateuserinfo.invalid) {
      return
    }
    else {
      console.log("FormValues:",JSON.stringify(this.updateuserinfo.value));
    }  }
}
