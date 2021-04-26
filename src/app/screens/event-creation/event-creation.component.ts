import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { GridOptions, GridApi } from "ag-grid-community";
import { HttpClient } from '@angular/common/http';
import { uiCommonUtils } from 'src/app/common/uiCommonUtils';
import { EventDataService } from '../events/event.dataService';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css']
})
export class EventCreationComponent implements OnInit {

  eventCreationForm: any;
  eventsDataFormGroup: any;
  venuesDataFormGroup: any;
  categoriesDataFormGroup: any;
  questionnaireDataFormGroup: any;
  eventId:any;
  rowData:any;

  selectedRegion: any;
  venues: any;
  questionnaire: any;
  term: any;
  alluserdata: any;
  orgId: any;
  userId: any;
  selectedOrg: any;
  orgDetails!: any;

  orgs!: any[];
  isLinear!: boolean;
  venuesdataOfdata!: any[];
  venuesList!: any[];
  eventList!: any[];
  regionList!: any[];
  parishList!: any[];
  proctorData!: any[];
  rolesData!: any[];
  eventcategories: any;
  eventcategorydata!: any[];
  categories: any;
  eventarray!: any[];
  eventCategoryForm!: FormGroup;
  ISCategory!: any[];
  newVenues!: any[];
  isVenueRequired: any;
  isProctorRequired: any;
  isJudgeRequired: any;
  isSchoolGradeRequired: any;
  public myreg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
  minDate = new Date(); 
  selectedRowJson: any = {};
  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder, private uiCommonUtils: uiCommonUtils, private eventDataService: EventDataService) { }

  ngOnInit(): void {

    if (this.eventDataService.getSelectedRowData() != undefined) {
      this.selectedRowJson = this.eventDataService.getSelectedRowData();
      console.log('selected row data is :: ' + JSON.stringify(this.selectedRowJson))
    }
    this.alluserdata = this.uiCommonUtils.getUserMetaDataJson();
    this.orgId = this.alluserdata.orgId;
    this.userId = this.alluserdata.userId;

    this.eventsDataFormGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      eventType: new FormControl('', Validators.required),
      orgType: new FormControl('', Validators.required),
      orgId: new FormControl(''),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      registrationStartDate: new FormControl('', Validators.required),
      registrationEndDate: new FormControl('', Validators.required),
      eventUrl: new FormControl('', [Validators.required, Validators.pattern(this.myreg)]),
      description: new FormControl('', Validators.required),
    }),//{validator: this.checkDates}); //to compare event registration dates


      this.venuesDataFormGroup = this.formBuilder.group({
        venues: this.formBuilder.array([this.adduserVenuAndProcter()])
      });

    this.categoriesDataFormGroup = this.formBuilder.group({
      categories: this.formBuilder.array([this.addeventCategory()])
    });



    this.questionnaireDataFormGroup = this.formBuilder.group({
      questionnaire: this.formBuilder.array([this.adduserquestionary()])
    });

    this.apiService.getRegionAndParish().subscribe((res: any) => {
      this.regionList = res.data.metaData.regions;
      console.log("regionList", this.regionList);
    });


    this.apiService.getEventType().subscribe((res: any) => {
      this.eventList = res.data.metaData.eventType;
      this.eventcategorydata = res.data.metaData.eventType;
    });


    this.apiService.getUserRoleData().subscribe(res => {
      //this.roledata = res.data.metadata.roles;
      this.orgs = res.data.metadata.orgs;
    });

    // //to compare event dates
    // this.eventsDataFormGroup.setValue({
    //   registrationStartDate: this.eventsDataFormGroup.registrationStartDate,
    //   registrationEndDate: this.eventsDataFormGroup.registrationEndDate,
    //   startDate: this.eventsDataFormGroup.startDate,
    //   endDate: this.eventsDataFormGroup.endDate
    // });

    this.apiService.getEventsData().subscribe((res) => {
      console.log('These are all the events from database : ');
      console.log(res.data.metaData);
      this.rowData = res.data.metaData.eventData;
      this.eventId = res.data.metaData.eventData[0].event_Id;
      console.log("Event Id is : " +this.eventId);

      //this.events = this.rowData
    });

    this.apiService.getEventById(this.eventId).subscribe((res) => {
      console.log(res.data.metaData);
    });

    // this.apiService.callGetService(getEventById?id=this.selectedRowJson.eventId).subscribe((res)=> {
    //   console.log("event Id data : " + res.data.metaData);
    // });

  }



  rolesArr: any[] = [];


  onOrgSelect(event: any) {
    console.log(event);
    this.selectedOrg = event.value;
    let orgIndex = event.id;
    if (orgIndex == undefined)
      orgIndex = 0;
    else
      orgIndex = parseInt(orgIndex)
    console.log("Dropdown Index:", orgIndex);

    for (let i = 0; i < this.orgs.length; i++) {
      if (this.orgs[i].orgtype == this.selectedOrg) {
        this.orgDetails = this.orgs[i].details;
      }
    }
  }

  addeventCategory(): FormGroup {
    return this.formBuilder.group({
      eventCategoryID: '',
      name: '',
      schoolGradeFrom: '',
      schoolGradeTo: '',
      judges: '',
      venueId: ''
    });
  }

  //function to validate event dates
  checkDates(group: FormGroup) {
    if ((group.controls.registrationEndDate.value) < (group.controls.registrationStartDate.value) && (group.controls.registrationEndDate.value)) {
      return { notValid: true }

    }
    if (group.controls.startDate.value < (group.controls.registrationEndDate.value) && (group.controls.startDate.value)) {
      return { notValid1: true }

    }
    if (group.controls.endDate.value < (group.controls.startDate.value) && (group.controls.endDate.value)) {
      return { notValid2: true }

    }
    return null;
  }


  setuserVenuAndProcter(venuesdataOfdata: any): FormArray {
    const formArray = new FormArray([]);
    venuesdataOfdata.forEach((e: any) => {
      formArray.push(this.formBuilder.group({
        name: e.name,
        venueId: e.venueId
      }));
    });
    return formArray;
  }

  onaddbtnclick() {
    this.venues = this.venuesDataFormGroup.get('venues') as FormArray;
    this.venues.push(this.adduserVenuAndProcter());
  }

  onEventsNextBtnClick() {


    if (this.eventsDataFormGroup.valid) {

      console.log(this.eventsDataFormGroup.value.eventType);

      if (this.eventsDataFormGroup.value.eventType == 'CWC') {
        this.rolesData = ['CWC Competition Proctor', 'CWC Coordinator'];
        let roleData =
        {
          "data": {
            "rolesData": this.rolesData
          }
        }
        this.apiService.getProctorData(roleData).subscribe(res => {
          this.proctorData = res.data.metaData.proctorData;
          console.log("this.proctorData", this.proctorData);
        });
      }

      if (this.eventsDataFormGroup.value.eventType == 'TTC') {
        this.rolesData = ['TTC Exam Proctor', 'TTC Exam Coordinator'];
        let roleData =
        {
          "data": {
            "rolesData": this.rolesData
          }
        }
        this.apiService.getProctorData(roleData).subscribe(res => {
          this.proctorData = res.data.metaData.proctorData;
          console.log("this.proctorData", this.proctorData);
        });
      }

      if (this.eventsDataFormGroup.value.eventType == 'OVBS') {
        this.rolesData = ['OVBS Coordinator'];
        let roleData =
        {
          "data": {
            "rolesData": this.rolesData
          }
        }
        this.apiService.getProctorData(roleData).subscribe(res => {
          this.proctorData = res.data.metaData.proctorData;
          console.log("this.proctorData", this.proctorData);
        });
      }

      let venuesDatanew: any = {};

      venuesDatanew.orgType = this.eventsDataFormGroup.value.orgType;
      venuesDatanew.orgId = this.eventsDataFormGroup.value.orgId;

      this.apiService.getVenues({ data: venuesDatanew }).subscribe((res: any) => {
        this.venuesList = res.data.venueList;
        console.log("venuesList", this.venuesList);
      });


      for (let i = 0; i < this.eventList.length; i++) {
        if (this.eventsDataFormGroup.value.eventType == this.eventList[i].eventType) {
          this.categoriesDataFormGroup.setControl('categories', this.setEventCategory(this.eventcategorydata[i].eventName));
        }
      }

      for (let i = 0; i < this.eventList.length; i++) {
        if (this.eventList[i].eventType == this.eventsDataFormGroup.value.eventType) {
          this.isVenueRequired = this.eventList[i].isVenueRequired;
          this.isProctorRequired = this.eventList[i].isProctorRequired;
          this.isJudgeRequired = this.eventList[i].isJudgeRequired;
          this.isSchoolGradeRequired = this.eventList[i].isSchoolGradeRequired;
        }
      }
    }
  }

  onCategoriesNextBtn() {
    if (this.categoriesDataFormGroup.value.categories.length == 0) {
      this.uiCommonUtils.showSnackBar("Event should atleast have one category!", "error", 3000);
    }
  }

  onVenuesNextBtnClick() {
    this.venues = this.venuesDataFormGroup.get('venues') as FormArray;
    this.newVenues = this.venues.value;

    for (let i = 0; i < this.venuesList.length; i++) {
      console.log(this.venuesList[i].name);
      console.log(this.venuesList[i].venueId);
      for (let j = 0; j < this.newVenues.length; j++) {
        if (this.newVenues[j].venueId == this.venuesList[i].venueId) {
          this.newVenues[j].name = this.venuesList[i].name;
        }
      }
    }

    if (this.venuesDataFormGroup.value.venues.length == 0) {
      this.uiCommonUtils.showSnackBar("Event should atleast have one venue!", "error", 3000);
    }

  }



  onaddbtnclick1() {
    this.questionnaire = this.questionnaireDataFormGroup.get('questionnaire') as FormArray;
    this.questionnaire.push(this.adduserquestionary());
  }

  onremovebtnclickVenu(index: any) {
    (<FormArray>this.venuesDataFormGroup.get('venues').removeAt(index));
  }

  onremovebtnclickQuestion(index: any) {
    (<FormArray>this.questionnaireDataFormGroup.get('questionnaire').removeAt(index));
  }

  removeEventCategory(index: any) {
    (<FormArray>this.categoriesDataFormGroup.get('categories').removeAt(index));
  }



  adduserquestionary(): FormGroup {
    return this.formBuilder.group({
      question: '',
      responseType: '',
    });
  }

  adduserVenuAndProcter(): FormGroup {
    return this.formBuilder.group({
      venueId: '',
      proctorId: ''
    });
  }


  setEventCategory(eventcategorydata: any): FormArray {
    const formArray = new FormArray([]);
    eventcategorydata.forEach((e: any) => {
      formArray.push(this.formBuilder.group({
        eventCategoryID: e.id,
        name: e.name,
        schoolGradeFrom: e.schoolGradeFrom,
        schoolGradeTo: e.schoolGradeTo,
        judges: '',
        venueId: ''
      }));
    });
    return formArray;
  }

  createEvent() {

    if (this.eventsDataFormGroup.value.eventType == 'TTC' || this.eventsDataFormGroup.value.eventType == 'OBVS' || this.eventsDataFormGroup.value.eventType == 'CWC') {
      if (this.categoriesDataFormGroup.value.categories.length == 0) {
        this.uiCommonUtils.showSnackBar("Event should atleast have one category!", "error", 3000);
      }
    }
    else if (this.eventsDataFormGroup.value.eventType == 'CWC') {
      if (this.venuesDataFormGroup.value.venues.length == 0) {
        this.uiCommonUtils.showSnackBar("Event should atleast have one venue!", "error", 3000);
      }
    }
    else {
      let eventCreationForm: any = {};
      eventCreationForm = { ...this.eventsDataFormGroup.value, ...this.venuesDataFormGroup.value, ...this.categoriesDataFormGroup.value, ...this.questionnaireDataFormGroup.value }
      console.log("this.eventCreationForm", eventCreationForm);
      this.eventsDataFormGroup.value.orgId = this.orgId;
      this.apiService.insertevents({ data: eventCreationForm }).subscribe((res: any) => {
        if (res.data.status == "success") {
          this.uiCommonUtils.showSnackBar("Event created successfully!", "success", 3000);
        }
        else
          this.uiCommonUtils.showSnackBar("Something went wrong!", "error", 3000);
      });
    }
  }
}
