import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { EventCreationComponent } from '../event-creation/event-creation.component';
import { uiCommonUtils } from '../../common/uiCommonUtils';
import * as moment from 'moment';
import { Moment } from 'moment';
import { EventRegistrationDataService } from '../event-registration/event.registrationDataService';
import { Router } from '@angular/router';



@Component({
  selector: 'app-cwcregistration',
  templateUrl: './cwcregistration.component.html',
  styleUrls: ['./cwcregistration.component.css']
})
export class CwcregistrationComponent implements OnInit {

  //cwcRegistrationForm: any;
  categoriesDataFormGroup: any;
  questionnaireDataFormGroup: any;
  userMetaData: any;
  loggedInUser: any;
  eventcategorydata!: any[];
  eventQuestionnaireData!: any[];
  answer: any;

  event: any;
  item: any;
  
  startDate:any;
  endDate:any;
  registrationStartDate:any;
  registrationEndDate:any;


  constructor(private router: Router, private apiService: ApiService, private formBuilder: FormBuilder,
    private uiCommonUtils: uiCommonUtils, private eventRegistrationDataService: EventRegistrationDataService) { }

  selected!: { startDate: Moment; endDate: Moment; };
  selectedRowJson: any = {};
  ngOnInit(): void {

    if (this.eventRegistrationDataService.getSelectedRowData() != undefined)
      this.selectedRowJson = this.eventRegistrationDataService.getSelectedRowData();
    console.log('selected row data is :: ' + JSON.stringify(this.selectedRowJson));

    this.userMetaData = this.uiCommonUtils.getUserMetaDataJson();
    this.loggedInUser = this.userMetaData.userId;

    
    
    this.startDate = new Date(this.selectedRowJson.startDate).toLocaleDateString("en-us");
    this.endDate = new Date(this.selectedRowJson.endDate).toLocaleDateString("en-us");

    this.registrationStartDate = new Date(this.selectedRowJson.registrationStartDate).toLocaleDateString("en-us");
    this.registrationEndDate = new Date(this.selectedRowJson.registrationEndDate).toLocaleDateString("en-us");

    console.log("Event Id is mamamamam : " + this.selectedRowJson.event_Id);

    this.apiService.callGetService(`getEvent?id=${this.selectedRowJson.event_Id}`).subscribe((res) => {

      this.eventcategorydata = res.data.eventData.categories

      this.eventQuestionnaireData = res.data.eventData.questionnaire;

      console.log("eventcategorydata is : " + this.eventcategorydata);


      this.categoriesDataFormGroup.setControl('categories', this.setDataForCategories(this.eventcategorydata));
      this.questionnaireDataFormGroup.setControl('questionnaire', this.setQuestionnairesData(this.eventQuestionnaireData))

      



    });

    this.categoriesDataFormGroup = this.formBuilder.group({
      categories: this.formBuilder.array([this.addeventCategory()]),

    });
    this.questionnaireDataFormGroup = this.formBuilder.group({
      questionnaire: this.formBuilder.array([this.addeventquestionnaire()])
    });


  }
  addeventCategory(): FormGroup {
    return this.formBuilder.group({
      eventCategoryID: '',
      name: '',

    });
  }
  addeventquestionnaire(): FormGroup {
    return this.formBuilder.group({
      questionId: '',
      answer: '',
      question: '',
      responseType: ''
    });
  }

  setDataForCategories(eventcategorydata: any): FormArray {
    const formArray = new FormArray([]);
    eventcategorydata.forEach((e: any) => {
      formArray.push(this.formBuilder.group({
        eventCategoryID: e.eventCategoryID,
        name: e.name

      }));
    });
    return formArray;
  }
  setQuestionnairesData(eventQuestionnaireData: any): FormArray {
    const formArray = new FormArray([]);
    eventQuestionnaireData.forEach((e: any) => {
      formArray.push(this.formBuilder.group({
        questionId: e.questionId,
        answer: '',
        question: e.question,
        responseType: e.responseType

      }));
    });
    return formArray;
  }
  onCancelRegistrationClick() {
    this.router.navigate(['/dashboard/eventRegistration/']);
  }

  /*
    updateCheckedOptions(categories:any, event:any) {
      this.categoriesDataFormGroup[categories] = event.target.checked;
   }
   */
  /*
   checked(item:Boolean){
    if(this.categoriesDataFormGroup.indexOf(item) != -1){
      return true;
    }
  }
  */
  catArray: any = [];
  onChange(event: any) {
    console.log("Inside the on Change " + JSON.stringify(event.item) + "Seletion : " + event.event.checked);
    if (event.event.checked == true) {
      // if(this.catArray.indexOf(event.item.eventCategoryID) < 0)
      this.catArray.push(event.item.eventCategoryID)
    } else {
      this.catArray.splice(this.catArray.indexOf(event.item.eventCategoryID), 1)
    }
    console.log("catArray : " + this.catArray);
  }
  registerEvent() {
    let eventRegistrationForm: any = {};
    eventRegistrationForm = { ...this.questionnaireDataFormGroup.value }
    console.log("this.registration form", eventRegistrationForm);

    //this.cwcRegistrationForm.value.eventId = this.eventId;
    /*
        let catArray : any = []
        eventRegistrationForm.categories.filter((item:any) => {
          catArray.push(item.eventCategoryID)
        });
        */
    eventRegistrationForm.categories = this.catArray;

    let payLoad = {
      categories: this.catArray,
      questionnaire: this.questionnaireDataFormGroup.value.questionnaire,
      eventId: this.selectedRowJson.event_Id,
      participantId: this.loggedInUser,
      schoolGrade: '',
    }
    console.log("Payload : " + JSON.stringify(payLoad));
    //console.log("eventRegistrationForm : " + eventRegistrationForm);


    //console.log("this.categoriesDataFormGroup.value.categories.length" + this.categoriesDataFormGroup.value.categories.length);
    if (this.categoriesDataFormGroup.value.categories.length == 0) {
      this.uiCommonUtils.showSnackBar('You should select atleast one category', 'Dismiss', 3000);
    }

    
    this.apiService.callPostService('registerEvent',payLoad ).subscribe((res: any) => {
      if (res.data.status == "success") {
        this.uiCommonUtils.showSnackBar("Registered for event successfully!", "success", 3000);
      }
      else
        this.uiCommonUtils.showSnackBar("Something went wrong!", "error", 3000);
    });
    
  }



}
