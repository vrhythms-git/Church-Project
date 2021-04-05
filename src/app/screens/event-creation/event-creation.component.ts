import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { GridOptions, GridApi } from "ag-grid-community";
import { HttpClient } from '@angular/common/http';
import { uiCommonUtils } from 'src/app/common/uiCommonUtils';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css']
})
export class EventCreationComponent implements OnInit {

  eventCreationForm: any;
  venues: any;
  questionnaire: any;
  term: any;
  alluserdata: any;
  orgId: any;
  userId: any;
  isLinear!: boolean;
  venuesdataOfdata!: any[];
  venuesList!: any[];
  parishList!: any[];

  eventcategories: any;
  eventcategorydata!: any[];
  categories: any;
  eventarray!: any[];
  eventCategoryForm!: FormGroup;
  //items!: FormArray
  ISCategory!: any[];
  newVenues!: any[];
  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder, private uiCommonUtils: uiCommonUtils) { }

  ngOnInit(): void {

    this.alluserdata = this.uiCommonUtils.getUserMetaDataJson();
    this.orgId = this.alluserdata.orgId;
    this.userId = this.alluserdata.userId;

    this.eventCreationForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      eventType: new FormControl('', Validators.required),
      parishName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      orgId: new FormControl(''),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      registrationStartDate: new FormControl('', Validators.required),
      registrationEndDate: new FormControl('', Validators.required),
     
      //venueId: new FormControl('', Validators.required),
      venues: this.formBuilder.array([this.adduserVenuAndProcter()]),
     
      categories: this.formBuilder.array([this.addeventCategory()]),
      questionnaire: this.formBuilder.array([this.adduserquestionary()])
    });

    //this.categoryData = this.eventCreationForm.get('categoryData') as FormArray;
    //this.categoryData.push(this.addeventCategory());


    this.apiService.getEventCategoryData().subscribe((res) => {
      console.log('These are Event category from database : ');
      console.log(res.data.metaData);
      this.eventcategorydata = res.data.metaData.eventCategory;

      this.eventCreationForm.setControl('categories', this.setEventCategory(this.eventcategorydata));

      this.venuesdataOfdata = res.data.metaData.venuesData;
      console.log(this.venuesdataOfdata[1].name);
      //this.eventCreationForm.setControl('venues',this.setuserVenuAndProcter(this.venuesdataOfdata));

      this.venuesList = this.venuesdataOfdata;
    });

    this.apiService.getParishListData().subscribe(res => {
      for (let i = 0; i < res.data.metaData.Parish.length; i++) {
        this.parishList = res.data.metaData.Parish;
      }
      console.log(this.parishList);
    });
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
    this.venues = this.eventCreationForm.get('venues') as FormArray;
    this.venues.push(this.adduserVenuAndProcter());
  }


  onNextBtnClick() {
    this.venues = this.eventCreationForm.get('venues') as FormArray;
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
    console.log(this.newVenues);
    // if(this.venuesList){
    //   if(this.newVenues)
    // }
    //.push(this.eventCreationForm.value.venues);
  }

  onaddbtncategory() {
    this.categories = this.eventCreationForm.get('categories') as FormArray;
    this.categories.push(this.addeventCategory());
  }

  onaddbtnclick1() {
    this.questionnaire = this.eventCreationForm.get('questionnaire') as FormArray;
    this.questionnaire.push(this.adduserquestionary());
  }



  onremovebtnclickVenu(index: any) {
    (<FormArray>this.eventCreationForm.get('venues').removeAt(index));
  }

  onremovebtnclickQuestion(index: any) {
    (<FormArray>this.eventCreationForm.get('questionnaire').removeAt(index));
  }

  removeEventCategory(index: any) {
    (<FormArray>this.eventCreationForm.get('categories').removeAt(index));
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
      //name: '',
      // description: '',
      // addressLine1: '',
      // addressLine2: '',
      // city: '',
      // state: '',
      // postalCode: '',
      // country: '',
      proctorId: ''
    });
  }

  addeventCategory(): FormGroup {
    return this.formBuilder.group({
      eventCategoryID: '',
      name: '',
      schoolGradeFrom: '',
      schoolGradeTo: '',
      judge1: '',
      judge2: '',
      judge3: '',
      venueId: ''
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
        judge1: '',
        judge2: '',
        judge3: '',
        venueId: ''
      }));
    });
    return formArray;
  }


  createEvent() {
    this.eventCreationForm.value.orgId = this.orgId;
    //this.eventCreationForm.value.venues.proctorId = this.userId;
    this.apiService.insertevents({ data: this.eventCreationForm.value }).subscribe(res => {
      console.log("res", JSON.stringify(res));
      console.log("Event created successfully!");
      this.uiCommonUtils.showSnackBar("Event created successfully!", "Dismiss", 4000);
    });
    console.log("FormValues:", JSON.stringify(this.eventCreationForm.value));
  }


}
