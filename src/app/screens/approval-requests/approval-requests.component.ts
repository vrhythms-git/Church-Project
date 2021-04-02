import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormControl, Validators, FormBuilder } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { ReqRendererComponent } from '../../screens/renderers/req-renderer/req-renderer.component';
import { uiCommonUtils } from '../../common/uiCommonUtils';
declare let $: any;


@Component({
  selector: 'app-approval-requests',
  templateUrl: './approval-requests.component.html',
  styleUrls: ['./approval-requests.component.css']
})
export class ApprovalRequestsComponent implements OnInit {

  data: any;
  params: any;
  columnDefs:any;
  rowData:any;
  userRecords!: any[];
  selectedUserData: any;
  approveReqForm: any;
  reqDisableForm: any;
  userMetaData : any;
  isApproved : boolean = true;
  loggedInUser : any;

  constructor(private apiService:ApiService, private formBuilder:FormBuilder, 
    private uiCommonUtils :uiCommonUtils, private router: Router) { }

  agInit(params: any) {
    this.params = params;
    this.data = params.value;
  }

  ngOnInit(): void {
    this.reqDisableForm = this.formBuilder.group({
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
    })

    this.approveReqForm = this.formBuilder.group({
      comment: new FormControl('')
    })


    this.columnDefs = [
      { headerName: 'First Name', field: 'firstName', sortable: true, filter: true, width: 170, checkboxSelection: true },
      { headerName: 'Last Name', field: 'lastName', sortable: true, filter: true, width: 170 },
      { headerName: 'Email Id', field: 'emailId', sortable: true, filter: true, width: 220 },
      { headerName: 'Mobile Number', field: 'mobileNo', sortable: true, filter: true },
      { headerName: 'Org Type', field:'orgType',sortable: true, filter: true, width:170},
      { headerName: 'Actions', field: 'action', cellRendererFramework: ReqRendererComponent, width: 160}
    ]

    this.userMetaData = this.uiCommonUtils.getUserMetaDataJson();
    this.loggedInUser = this.userMetaData.userId;
    this.getUnapprovedUserData();
   
  }

  getUnapprovedUserData(){
    this.apiService.getUnapprovedUserData(this.loggedInUser ).subscribe((res) => {
      console.log('These are unapproved users from database : ');
      console.log(res.data.metaData);
      this.rowData = res.data.metaData;
    });
  }

  onRowClicked(event: any) {
     $("#imagemodal").modal("show");
   // this.router.navigate(['/dashboard/myprofile']);
    let rowData = event;
    this.selectedUserData = event.data;
    console.log(this.selectedUserData);
    let i = rowData.rowIndex;

    this.reqDisableForm.disable();

    this.reqDisableForm.patchValue({
      title:this.selectedUserData.title,
      firstName: this.selectedUserData.firstName,
      middleName: this.selectedUserData.middleNmae,
      lastName: this.selectedUserData.lastName,
      nickName: this.selectedUserData.nickName,
      batismalName: this.selectedUserData.batismalName,
      dob: this.selectedUserData.dob,
      mobileNo: this.selectedUserData.mobileNo,
      homePhoneNo: this.selectedUserData.homePhoneNo,
      emailAddress: this.selectedUserData.emailId,
      addressLine1: this.selectedUserData.addressLine1,
      addressLine2: this.selectedUserData.addressLine2,
      addressLine3: this.selectedUserData.addressLine3,
      city: this.selectedUserData.city,
      postalCode: this.selectedUserData.postalCode,
      state: this.selectedUserData.state,
      country: this.selectedUserData.country,
      parish: this.selectedUserData.parish,
      maritalStatus: this.selectedUserData.maritalStatus,
      dateofMarriage: this.selectedUserData.dateofMarriage,
      about_urself: this.selectedUserData.about_urself,
      isFamilyHead : this.selectedUserData.isFamilyHead
    })    
  }

  onRejectClick(){
    $("#comment").show;
    if (!$('#comment').val()) {
      $('<span class="error" style="color:red;">Please Enter Comment</span>').
            insertBefore('#comment');
}    this.isApproved = false;
  }

  onReqSubmit(){
    this.approveReqForm.value.userId = this.selectedUserData.userId;
    this.approveReqForm.value.isApproved = this.isApproved;
    this.approveReqForm.value.loggedInuserId = this.loggedInUser;
    console.log(this.approveReqForm.value);
    if(this.isApproved == false && this.approveReqForm.value.comment != ""){
      this.apiService.approveOrRejReq({ data: this.approveReqForm.value }).subscribe( res => {
        console.log(res);
        this.getUnapprovedUserData();
        $("#imagemodal").modal("hide");
      })
    }
    else if(this.isApproved == true){
      this.apiService.approveOrRejReq({ data: this.approveReqForm.value }).subscribe( res => {
        console.log(res);
        this.getUnapprovedUserData();
        $("#imagemodal").modal("hide");
      })
    }
    return;
  }
}

