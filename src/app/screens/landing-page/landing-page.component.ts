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
  updateuserinfo: any;
  roles: any;
  roledata!: any[];
  orgs!: any[];
  orgDetails!: any[];
  userId: any;
  selectedOrg:any;
  max_date!: Date;
  constructor(private apiService: ApiService,
    private http: HttpClient, private formBuilder: FormBuilder) { }
  // this.gridOptions = <GridOptions>{};

  agInit(params: any) {
    this.params = params;
    this.data = params.value;
  }
  ngOnInit(): void {
    this.updateuserinfo = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dob: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      emailAddress: new FormControl(''),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      state : new FormControl('',Validators.required),
      country: new FormControl('', Validators.required),
      roles: this.formBuilder.array([this.adduserroles()]),
    });

    this.columnDefs = [
      { headerName: 'First Name', field: 'firstName', sortable: true, filter: true, width: 170, checkboxSelection: true },
      { headerName: 'Middle Name', field: 'middleNmae', sortable: true, filter: true, width: 170 },
      { headerName: 'Last Name', field: 'lastName', sortable: true, filter: true, width: 170 },
      { headerName: 'Email Id', field: 'emailId', sortable: true, filter: true, width: 220 },
      { headerName: 'Mobile Number', field: 'mobileNo', sortable: true, filter: true },
    ];

    this.apiService.getUsersData({ data: this.userRecords }).subscribe((res) => {
      console.log('These are users from database : ');
      console.log(res.data.metaData);
      this.rowData = res.data.metaData;
    });

    this.max_date = new Date;



    this.apiService.getUserRoleData().subscribe(res => {
      console.log("User Role Data : ", res.data.metadata);
      this.roledata = res.data.metadata.roles;
      this.orgs = res.data.metadata.orgs;
      console.log("Roles Data:", this.orgs);
    })

    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      treeData: true,
      enableFilter: true,
      enableColResize: true,
      defaultColDef: {
        editable: false,
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
    this.userId = selectedUserData.userId;
    
    this.updateuserinfo.patchValue({
      firstName: selectedUserData.firstName,
      middleName: selectedUserData.middleNmae,
      lastName: selectedUserData.lastName,
      dob: selectedUserData.dob,
      mobileNo: selectedUserData.mobileNo,
      emailAddress: selectedUserData.emailId,
      addressLine1: selectedUserData.addressLine1,
      addressLine2: selectedUserData.addressLine2,
      city: selectedUserData.city,
      postalCode: selectedUserData.postalCode,
      state : selectedUserData.state,
      country: selectedUserData.country,
      //  role : selectedUserData.roles[0].roleId,
      //  accesslvltype : selectedUserData.roles[0].orgType,
      //  accesslvlid : selectedUserData.roles[0].orgId  
      roles: selectedUserData.roles
    })
  }
  onOrgSelect(){
  console.log("Org Name",this.selectedOrg);
  for(let i=0;i<this.orgs.length; i++){
    if(this.orgs[i].orgtype == this.selectedOrg){
      console.log(this.orgs[i].details);
      this.orgDetails = this.orgs[i].details;
    }
  }
  }
  

  onaddbtnclick() {
    this.roles = this.updateuserinfo.get('roles') as FormArray;
    this.roles.push(this.adduserroles());
  }

  adduserroles(): FormGroup {
    return this.formBuilder.group({
      roleId: '',
      role: '',
      orgId: ''
    });
  }

  onremovebtnclick(index: any) {
    (<FormArray>this.updateuserinfo.get('roles').removeAt(index));
  }

  updateUserProfile() {
    if (this.updateuserinfo.invalid) {
      return
    }
    else {
      this.updateuserinfo.value.userId = this.userId;
      this.updateuserinfo.value.updatedBy = this.userId;
      let dob = this.updateuserinfo.value.dob;
      console.log(dob);
      this.apiService.updateUserProfile({ data: this.updateuserinfo.value }).subscribe(res=>{
        console.log("User Profile Updated.")
      });
      // console.log("FormValues:", JSON.stringify(this.updateuserinfo.value));
    }
  }
}
