import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ButtonRendererComponent } from '../button-renderer/button-renderer.component';
import { GridOptions, GridApi } from "ag-grid-community";
import { AgGridAngular } from "ag-grid-angular";
import { uiCommonUtils } from '../../common/uiCommonUtils';
declare let $: any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})


export class LandingPageComponent implements OnInit {

  // @ViewChild('agGrid') agGrid: AgGridAngular;
  gridOptions: any;
  userRecords: any;
  columnDefs!: any[];
  rowData: any;
  term: any;
  gridApi: any;
  node: any;
  data: any;
  params: any;
  updateuserinfo: any;
  roles: any;
  roledata!: any[];
  orgs!: any[];
  orgDetails!: any;
  item: any;
  userId: any;
  selectedOrg: any;
  max_date!: Date;
  parishList!: any[];
  rowId: any;
  selectedUserRole!: any[];
  agGrid: any;
  userMetaData : any;
  deleteUser : any[] = new Array();
  hasRolePermission : Boolean = false;
  hasDeletePermission : Boolean = true;
  hasEditPermission : boolean = false;

  constructor(private apiService: ApiService, private uiCommonUtils :uiCommonUtils,
    private http: HttpClient, private formBuilder: FormBuilder) { }
  // this.gridOptions = <GridOptions>{};

  agInit(params: any) {
    this.params = params;
    this.data = params.value;
  }
  ngOnInit(): void {


    this.updateuserinfo = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      nickName: new FormControl('',),
      batismalName: new FormControl(''),
      dob: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      homePhoneNo: new FormControl(''),
      emailAddress: new FormControl(''),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      addressLine3: new FormControl(''),
      city: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      parish: new FormControl('', Validators.required),
      maritalStatus: new FormControl('', Validators.required),
      dateofMarriage: new FormControl(''),
      about_urself: new FormControl(''),
      isFamilyHead : new FormControl(''),
      roles: this.formBuilder.array([this.adduserroles()]),
    });

    this.columnDefs = [
      { headerName: 'First Name', field: 'firstName', sortable: true, filter: true, width: 170, checkboxSelection: true },
      { headerName: 'Middle Name', field: 'middleNmae', sortable: true, filter: true, width: 170 },
      { headerName: 'Last Name', field: 'lastName', sortable: true, filter: true, width: 170 },
      { headerName: 'Email Id', field: 'emailId', sortable: true, filter: true, width: 220 },
      { headerName: 'Mobile Number', field: 'mobileNo', sortable: true, filter: true },
      { headerName: 'Actions', field: 'action', cellRendererFramework: ButtonRendererComponent, width: 160,
        cellRendererParams: function (params: any) {
          // onClick: this.openModal.bind(this),
          // label: 'Click'
          // `<button>Edit</button>`;
        }, suppressSizeToFit: false
      }


    ];
      this.getUserData();

    this.max_date = new Date;

    this.userMetaData = this.uiCommonUtils.getUserMetaDataJson();

   this.hasRolePermission = this.uiCommonUtils.hasPermissions("assign_role");
  
  this.hasDeletePermission = this.uiCommonUtils.hasPermissions("delete_user");
// if(this.hasDeletePermission == true){
//   this.hasDeletePermission = false;
// }

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

  openModal() {
    // this.rowId = event.rowData ? event.rowData._id : "";
    $("#imagemodal").modal("show");
  }

  onRowClicked(event: any) {
    $("#imagemodal").modal("show");

    let rowData = event;
    let selectedUserData = event.data;
    console.log(selectedUserData);
    let i = rowData.rowIndex;
    this.userId = selectedUserData.userId;

    this.apiService.getParishListData().subscribe(res => {
      for (let i = 0; i < res.data.metaData.Parish.length; i++) {
        this.parishList = res.data.metaData.Parish;
      }
      console.log(this.parishList);
    })

    this.updateuserinfo.patchValue({
      title:selectedUserData.title,
      firstName: selectedUserData.firstName,
      middleName: selectedUserData.middleNmae,
      lastName: selectedUserData.lastName,
      nickName: selectedUserData.nickName,
      batismalName: selectedUserData.batismalName,
      dob: selectedUserData.dob,
      mobileNo: selectedUserData.mobileNo,
      homePhoneNo: selectedUserData.homePhoneNo,
      emailAddress: selectedUserData.emailId,
      addressLine1: selectedUserData.addressLine1,
      addressLine2: selectedUserData.addressLine2,
      addressLine3: selectedUserData.addressLine3,
      city: selectedUserData.city,
      postalCode: selectedUserData.postalCode,
      state: selectedUserData.state,
      country: selectedUserData.country,
      parish: selectedUserData.parish,
      maritalStatus: selectedUserData.maritalStatus,
      dateofMarriage: selectedUserData.dateofMarriage,
      about_urself: selectedUserData.about_urself,
      isFamilyHead : selectedUserData.isFamilyHead,
      //  role : selectedUserData.roles[0].roleId,
      //  accesslvltype : selectedUserData.roles[0].orgType,
      //  accesslvlid : selectedUserData.roles[0].orgId  
      // roles: selectedUserData.roles
    })
    this.selectedUserRole = selectedUserData.roles;
    console.log("selectedUserRole", this.selectedUserRole)

    this.rolesArr = [];
    this.selectedUserRole.forEach((e: any) => {
      if (this.rolesArr.indexOf(e) <= 0) {

        for (let i = 0; i < this.orgs.length; i++) {
          if (this.orgs[i].orgtype == e.orgType) {
            e.orgDetails = this.orgs[i].details;
          }
        }
        this.rolesArr.push(e);
      }
    });




    this.updateuserinfo.setControl('roles', this.setRoles(this.selectedUserRole));
  }

  setRoles(selectedUserRole: any): FormArray {
    const formArray = new FormArray([]);
    this.selectedUserRole.forEach((e: any) => {

      formArray.push(this.formBuilder.group({
        roleId: e.roleId,
        role: e.orgType,
        orgId: e.orgId
      }));

      this.onOrgSelect({
        "target": {
          "value": e.orgType
        }
      });
    });
    return formArray;
  }

  onOrgSelect(event: any) {
    console.log(event);
    // console.log("Org Name", event.target.value);
    this.selectedOrg = event.target.value;
    let orgIndex = event.target.id;
    if (orgIndex == undefined)
      orgIndex = 0;
    else
      orgIndex = parseInt(orgIndex)
    console.log("Dropdown Index:", orgIndex);

    for (let i = 0; i < this.orgs.length; i++) {
      if (this.orgs[i].orgtype == this.selectedOrg) {
          this.rolesArr[orgIndex].orgDetails = this.orgs[i].details;
          this.orgDetails = this.orgs[i].details;
      }
    }

    // const select = this.orgs.find(_ => _.type == type);
    // return select ? select.values : select;
  }


  getOrgDetailsArrByindex(i: any) {
    // console.log('i======>' + i);
    // console.log('this.rolesArr:' + this.rolesArr.length)
    if (this.rolesArr.length == 0)
      return this.orgDetails
    else {
      if (i > (this.rolesArr.length - 1)){
      //  console.log('Returning []');
        return []
      }
      else{
      //  console.log('Returning ' + this.rolesArr[i].orgDetails)
        return this.rolesArr[i].orgDetails;
      }
    }
  }

  rolesArr: any[] = [];

  onaddbtnclick() {
    this.roles = this.updateuserinfo.get('roles') as FormArray;
    this.roles.push(this.adduserroles());
  }

  adduserroles(): FormGroup {
    this.rolesArr.push({});
    return this.formBuilder.group({
      roleId: [null, Validators.required],
      role: [null, Validators.required],
      orgId: [null, Validators.required]
    });
  }

  onremovebtnclick(index: any) {
    (<FormArray>this.updateuserinfo.get('roles').removeAt(index));
  }

  getUserData(){  
    this.apiService.getUsersData({ data: this.userRecords }).subscribe((res) => {
      console.log('These are users from database : ');
      console.log(res.data.metaData);
      this.rowData = res.data.metaData;
    });
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
      this.apiService.updateUserProfile({ data: this.updateuserinfo.value }).subscribe(res => {
        console.log("User Profile Updated.")
      //  if(res.data.status ="success"){
        this.uiCommonUtils.showSnackBar('User Profile Updated..', 'Dismiss', 3000)
      //  }
      this.getUserData();
      })
      $("#imagemodal").modal("hide");
    }  
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
  }

  onSelectionChanged(event:any){
    var selectedRows = this.gridApi.getSelectedRows();
  }

  onDelete() {

    let selectedRows = this.gridApi.getSelectedRows();
    for(let i=0; i < selectedRows.length;i++){
      console.log("Users for Delete",selectedRows[i].userId);
      this.deleteUser.push(selectedRows[i].userId);
      //this.deleteUser = selectedRows[i].userId;
    }

    console.log("Users for Delete", this.deleteUser);
    let payload =    {
      "data" : {
        "deleteUser" : this.deleteUser 
        }
      } 
    this.apiService.deleteUser(payload).subscribe(res => {
     // if(res.data.status = "success"){
        this.uiCommonUtils.showSnackBar('User Record Deleted..', 'Dismiss', 3000)
     // }
    })
    this.getUserData();
    console.log("Records Deleted...");
  }
}
