import { HttpClient } from '@angular/common/http';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { uiCommonUtils } from 'src/app/common/uiCommonUtils';
import { ComponentCanDeactivate } from 'src/app/component-can-deactivate';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit, ComponentCanDeactivate{

  constructor(private apiService: ApiService,
    private http: HttpClient, private formBuilder: FormBuilder, private uiCommonUtils: uiCommonUtils,
    public router: Router) { }

  canDeactivate() : boolean{
    return !this.isDirty;
  }

  myprofileform: any;
  members: any;
  isDirty:boolean = false;
  hasAddMemPerm:boolean = false;
  userRecords: any;
  fbUid: any;
  alluserdata: any;
  userId: any;
  isFamilyHead: any;
  orgId: any;
  parishList!: any[];
  memberDetailsData!: any[];

  ngOnInit(): void {
    this.myprofileform = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      nickName: new FormControl('', Validators.required),
      batismalName: new FormControl('', Validators.required),
      dob: new FormControl('', [Validators.required]),
      homePhoneNo: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl('', Validators.required),
      addressLine3: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      parish: new FormControl(''),
      memberDetails: this.formBuilder.array([this.addfamilyMembers()]),
      maritalStatus: new FormControl('', Validators.required),
      dateofMarriage: new FormControl('', Validators.required),
      aboutYourself: new FormControl('', Validators.required),
      userId: new FormControl(''),
      isFamilyHead: new FormControl(''),
      orgId: new FormControl('')
    });

    this.alluserdata = this.uiCommonUtils.getUserMetaDataJson();
    this.userId = this.alluserdata.userId;
    this.fbUid = this.alluserdata.fbUid;
    this.isFamilyHead = this.alluserdata.isFamilyHead;
    this.orgId = this.alluserdata.orgId;
    this.memberDetailsData = this.alluserdata.memberDetails;
    this.myprofileform.setControl('memberDetails', this.setMemberDetails(this.memberDetailsData));

    this.hasAddMemPerm = this.uiCommonUtils.hasPermissions("add_member");

    // this.apiService.getUsersData({ data: this.userRecords }).subscribe((res) => {
    //   console.log('These are users from database : ');
    //   console.log(res.data.metaData);
    //   //this.alluserdata = res.data.metaData;
    // });

    this.apiService.getParishListData().subscribe(res => {
      for (let i = 0; i < res.data.metaData.Parish.length; i++) {
        this.parishList = res.data.metaData.Parish;
      }
      console.log(this.parishList);
    });


    
    this.myprofileform.patchValue({
      title: this.alluserdata.title,
      firstName: this.alluserdata.firstName,
      middleName: this.alluserdata.middleName,
      lastName: this.alluserdata.lastName,
      nickName: this.alluserdata.nickName,
      batismalName: this.alluserdata.batismalName,
      dob: this.alluserdata.dob,
      homePhoneNo: this.alluserdata.homePhoneNo,
      mobileNo: this.alluserdata.mobile_no,
      emailId: this.alluserdata.emailId,
      addressLine1: this.alluserdata.addressLine1,
      addressLine2: this.alluserdata.addressLine2,
      addressLine3: this.alluserdata.addressLine3,
      city: this.alluserdata.city,
      postalCode: this.alluserdata.postalCode,
      state: this.alluserdata.state,
      country: this.alluserdata.country,
      parish: this.alluserdata.parish,
      //memberDetails: this.alluserdata.memberDetails,
      maritalStatus: this.alluserdata.maritalStatus,
      dateofMarriage: this.alluserdata.dateofMarriage,
      aboutYourself: this.alluserdata.aboutYourself,
      userId: this.alluserdata.userId,
    });
  }


  setMemberDetails(memberDetailsData: any): FormArray {
    const formArray = new FormArray([]);
    memberDetailsData.forEach((e: any) => {
      formArray.push(this.formBuilder.group({
        title: e.title,
        firstName: e.firstName,
        middleName: e.middleName,
        lastName: e.lastName,
        relationship: e.relationship,
        dob: e.dob,
        mobileNo: e.mobileNo,
        emailId: e.emailId
      }));
    });
    return formArray;
  }

  onaddbtnclick() {
    this.members = this.myprofileform.get('memberDetails') as FormArray;
    this.members.push(this.addfamilyMembers());
  }

  addfamilyMembers(): FormGroup {
    return this.formBuilder.group({
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      relationship: '',
      dob: '',
      mobileNo: '',
      emailId: ''
    });
  }

  onremovebtnclick(index: any) { 
    (<FormArray>this.myprofileform.get('memberDetails').removeAt(index));
  }

  updateUserProfile() {
    // if (this.myprofileform.invalid) {
    //   return
    // }
    // else {
    console.log("this.userId", this.userId);
    this.myprofileform.value.userId = this.userId;
    this.myprofileform.value.updatedBy = this.userId;
    this.myprofileform.value.orgId = this.orgId;
    this.myprofileform.value.isFamilyHead = this.isFamilyHead;
    // let dob = this.myprofileform.value.dob;
    // console.log(dob);
    this.apiService.updateUserProfile({ data: this.myprofileform.value }).subscribe(res => {
      console.log("res", JSON.stringify(res));

      // if(res.status == "success"){
            console.log("User Profile Updated.");
            this.uiCommonUtils.showSnackBar("Profile updated successfully!","Dismiss",4000);

            //let abc =  localStorage.getItem('chUserFbUid' + "");
            this.apiService.callGetService(`getUserMetaData?fbuid=${this.fbUid}`).subscribe((data)=>{
            localStorage.setItem('chUserMetaData', JSON.stringify(data.data.metaData));
          });
      //  }
    });
    console.log("FormValues:", JSON.stringify(this.myprofileform.value));
  }
}
