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
export class MyProfileComponent implements OnInit, ComponentCanDeactivate {

  constructor(private apiService: ApiService,
    private http: HttpClient, private formBuilder: FormBuilder, private uiCommonUtils: uiCommonUtils,
    public router: Router) { }

  canDeactivate(): boolean {
    return !this.isDirty;
  }

  myprofileform: any;
  members: any;
  isDirty: boolean = false;
  hasAddMemPerm: boolean = false;
  userRecords: any;
  fbUid: any;
  alluserdata: any;
  userId: any;
  isFamilyHead: any;
  orgId: any;
  parishList!: any[];
  memberDetailsData!: any[];
  countries!: any[];
  states!: any[];
  signUpForm: any;
  selectedCountry: any;
  showFamilyHeadQuestion: boolean = false;
  isApprovedUserLoggedIn: boolean = false;
  contactNo: any;
  max_date!: any;


  ngOnInit(): void {
    this.myprofileform = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      nickName: new FormControl('', Validators.required),
      baptismalName: new FormControl('', Validators.required),
      dob: new FormControl('', [Validators.required]),
      homePhoneNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].{9}')]),
      mobileNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].{9}')]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
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
    this.isApprovedUserLoggedIn = this.alluserdata.isApproved

    if (this.isApprovedUserLoggedIn == true) {

      this.userId = this.alluserdata.userId;
      this.fbUid = this.alluserdata.fbUid;
      this.isFamilyHead = this.alluserdata.isFamilyHead;
      this.orgId = this.alluserdata.orgId;
      this.memberDetailsData = this.alluserdata.memberDetails;
      this.myprofileform.setControl('memberDetails', this.setMemberDetails(this.memberDetailsData));



      this.hasAddMemPerm = this.uiCommonUtils.hasPermissions("add_member");
      this.showFamilyHeadQuestion = !this.alluserdata.isFamilyMember;



      //  this.apiService.getUsersData({ data: this.userRecords }).subscribe((res) => {
      //   // console.log('These are users from database : ');
      //   // console.log(res.data.metaData);
      //    this.alluserdata = res.data.metaData;
      //  });

      this.apiService.getParishListData().subscribe(res => {
        for (let i = 0; i < res.data.metaData.Parish.length; i++) {
          this.parishList = res.data.metaData.Parish;
        }
        //console.log(this.parishList);
      });

      this.apiService.getCountryStates().subscribe((res: any) => {
        this.countries = res.data.countryState;
        // console.log("Countries", this.countries);
        this.patchCountryState(this.alluserdata.country);
      })

      this.myprofileform.patchValue({
        country: this.alluserdata.country,
        title: this.alluserdata.title,
        firstName: this.alluserdata.firstName,
        middleName: this.alluserdata.middleName,
        lastName: this.alluserdata.lastName,
        nickName: this.alluserdata.nickName,
        baptismalName: this.alluserdata.baptismalName,
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
        parish: this.alluserdata.orgName,
        //memberDetails: this.alluserdata.memberDetails,
        maritalStatus: this.alluserdata.maritalStatus,
        dateofMarriage: this.alluserdata.dateofMarriage,
        aboutYourself: this.alluserdata.aboutYourself,
        userId: this.alluserdata.userId,
      });
    } if (this.isApprovedUserLoggedIn == false) {

      this.signUpForm = this.formBuilder.group({
        title: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        dob: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[@])(?=.*?[0-9]).{8,}$')]),
        cnfmpwd: new FormControl('', Validators.required),
        mobileNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].{9}')]),
        memberType: new FormControl('', Validators.required),
        orgId: new FormControl('', Validators.required),
        abtyrslf: new FormControl('')
      });

      this.signUpForm.patchValue({
        title: this.alluserdata.title,
        firstName: this.alluserdata.firstName,
        lastName: this.alluserdata.lastName,
        dob: this.alluserdata.dob,
        mobileNo: this.alluserdata.mobile_no,
        email: this.alluserdata.emailId,
        parish: this.alluserdata.orgName,
        userId: this.alluserdata.userId,
        orgId: this.alluserdata.orgId,
        memberType: this.alluserdata.membershipType,
        abtyrslf: this.alluserdata.aboutYourself,
      });

      this.apiService.getParishListData().subscribe(res => {

        for (let i = 0; i < res.data.metaData.Parish.length; i++) {
          this.parishList = res.data.metaData.Parish;
        }
      })

    }
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
        baptismalName: e.baptismalName,
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
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      relationship: new FormControl('', Validators.required),
      baptismalName: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      mobileNo: new FormControl('', [Validators.pattern('[0-9].{9}')]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
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
    //    console.log("this.userId", this.userId);
    if (this.isApprovedUserLoggedIn == true) {
      this.myprofileform.value.userId = this.userId;
      this.myprofileform.value.updatedBy = this.userId;
      this.myprofileform.value.orgId = this.orgId;

      // if((this.myprofileform.value.isFamilyHead == '' || this.alluserdata.isFamilyHead ==true )
      //      &&  this.myprofileform.value.isFamilyHead == true){
      //   this.myprofileform.value.isFamilyHead = true;
      // }else
      // this.myprofileform.value.isFamilyHead = false;

      let currFHValue = this.myprofileform.value.isFamilyHead;
      if (currFHValue === true || currFHValue == 'true')
        this.myprofileform.value.isFamilyHead = true;
      else if (currFHValue === false || currFHValue == 'false')
        this.myprofileform.value.isFamilyHead = false;
      else if (currFHValue === '')
        this.myprofileform.value.isFamilyHead = this.alluserdata.isFamilyHead

      this.apiService.updateUserProfile({ data: this.myprofileform.value }).subscribe((res: any) => {
        if (res.data.status == "success") {
          this.uiCommonUtils.showSnackBar("Profile updated successfully!", "success", 3000);
          this.getAndSetMetdata(this.userId)
        }
        else
          this.uiCommonUtils.showSnackBar("Something went wrong!", "error", 3000);
      });

    } if (this.isApprovedUserLoggedIn == false) {

      this.signUpForm.value.userId = this.alluserdata.userId;
      this.signUpForm.value.updatedBy = this.alluserdata.userId;
      this.signUpForm.value.orgId = this.alluserdata.orgId;

      this.apiService.callPostService(`updateBasicProfile`, this.signUpForm.value).subscribe((data) => {

        if (data.data.status == "success") {
          this.uiCommonUtils.showSnackBar("Profile updated successfully!", "success", 3000);
          this.getAndSetMetdata(this.alluserdata.userId)
        }
        else
          this.uiCommonUtils.showSnackBar("Something went wrong!", "error", 3000);
      });


    }
  }

  getAndSetMetdata(userId: number) {
    this.apiService.callGetService(`getUserMetaData?uid=${userId}`).subscribe((data) => {
      localStorage.setItem('chUserMetaData', JSON.stringify(data.data.metaData));
    });
  }

  changeCountry(country: any) {
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].countryName == country.target.value) {
        console.log(this.countries[i].states);
        this.states = this.countries[i].states;
      }
    }
  }

  patchCountryState(country: any) {
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].countryName == country) {
        console.log(this.countries[i].states);
        this.states = this.countries[i].states;
      }
    }
  }

  isStateDataSet = false;
  keyPress(event: any) {
    this.isStateDataSet = false;
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
      if (event.keyCode == 13) {
        //this.change(event);
        console.log("keyCode == 13");
      }
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  goToLogin() {
    this.router.navigate(['/signin']);
  }

  getNumber(event: any) {
    // console.log(event);
    this.contactNo = event;
  }

  validateDOB(event: any) {
    let year = new Date(event).getFullYear();
    let today = new Date().getFullYear();
    if (year > today) {
      alert("Select Date in Past");
    }
  }
}
