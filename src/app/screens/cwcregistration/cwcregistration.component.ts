import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { EventCreationComponent } from '../event-creation/event-creation.component';
import { uiCommonUtils } from '../../common/uiCommonUtils';
import * as moment from 'moment';
import { Moment } from 'moment';
import { EventRegistrationDataService } from '../event-registration/event.registrationDataService';

@Component({
  selector: 'app-cwcregistration',
  templateUrl: './cwcregistration.component.html',
  styleUrls: ['./cwcregistration.component.css']
})
export class CwcregistrationComponent implements OnInit {

  cwcRegistrationForm: any;
  parishList!: any[];
  venuesList!: any[];
  questionnaire: any;
  eventcategorydata!: any[];
  allUsersData:any;
  loggedInUser : any;
  userMetaData : any;
  allEventsData:any ={};

  categories: any;
  eventId:any;
  eventNameList! : any[];
  eventTypeList! : any[];
  eventQuestionnaireData!: any[];

  answerTypeList!: any[];

  constructor(private apiService: ApiService,private formBuilder: FormBuilder,
  private uiCommonUtils :uiCommonUtils,private eventRegistrationDataService:EventRegistrationDataService) { }

    selected!: { startDate: Moment; endDate: Moment; };
    selectedRowJson:any ={};
  ngOnInit(): void {

    if( this.eventRegistrationDataService.getSelectedRowData() != undefined )
      this.selectedRowJson = this.eventRegistrationDataService.getSelectedRowData();
      console.log('selected row data is :: ' + JSON.stringify(this.selectedRowJson));

    this.userMetaData = this.uiCommonUtils.getUserMetaDataJson();
    this.loggedInUser = this.userMetaData.userId;

    this.cwcRegistrationForm = this.formBuilder.group({
      title: new FormControl(this.userMetaData.title, Validators.required),
      firstName: new FormControl(this.userMetaData.firstName, Validators.required),
      middleName: new FormControl(this.userMetaData.middleName, Validators.required),
      lastName: new FormControl(this.userMetaData.lastName, Validators.required),
      emailId: new FormControl(this.userMetaData.emailId, [Validators.required]),
      //parish: new FormControl('', Validators.required),
      currentGradeOfStudent: new FormControl('', Validators.required),
      testingCenter : new FormControl('',Validators.required),
      testingLocation : new FormControl('',Validators.required),
      cwcdate : new FormControl('',Validators.required),
      cwcstudentGroup : new FormControl('',Validators.required),
      questionnaire: this.formBuilder.array([this.adduserquestionary()]),
      eventName: new FormControl(this.selectedRowJson.name,Validators.required),
      eventType: new FormControl(this.selectedRowJson.event_type,Validators.required),

      startDate: new FormControl(this.selectedRowJson.startDate, Validators.required),
      endDate: new FormControl(this.selectedRowJson.endDate, Validators.required),
      registrationStartDate: new FormControl(this.selectedRowJson.registrationStartDate, Validators.required),
      registrationEndDate: new FormControl(this.selectedRowJson.registrationEndDate, Validators.required),
      //yescheckBox : new FormControl('', Validators.required),
      //noCheckBox: new FormControl('', Validators.required),
      
    });

  
    

    this.apiService.getParishListData().subscribe(res => {
      for (let i = 0; i < res.data.metaData.Parish.length; i++) {
        this.parishList = res.data.metaData.Parish;
      }
      console.log(this.parishList);
    })

    this.apiService.getEventCategoryData().subscribe((res) => {
      console.log('These are Event category from database : ');
      console.log(res.data.metaData);
 
      this.venuesList = res.data.metaData.venuesData;

      this.eventcategorydata = res.data.metaData.eventCategory;
      console.log(this.eventcategorydata.length);

      //this.eventTypeList = this.eventcategorydata;

    });

    /*
    this.apiService.getUsersData( this.loggedInUser ).subscribe((res) => {
      console.log('These are users from database : ');
      console.log(res.data.metaData);
      this.allUsersData = res.data.metaData;
      //console.log("First Name of user is : "+this.allUsersData);
      //console.log("this.loggedInUser : "+this.loggedInUser.firstName);
    });
    */
   /*
    this.apiService.getEventsData().subscribe((res) => {
      console.log('These are all the events from database : ');
      console.log(res.data.metaData);
      this.allEventsData = res.data.metaData.eventData;
      this.eventId = res.data.metaData.eventData[0].event_Id;
      console.log("Event Id is : " +this.eventId);

      //this.events = this.rowData
    });
    */
    this.apiService.getEventQuestionnaireData().subscribe((res) => {
      console.log("This are questionnaires data : ");
      console.log(res.data.metaData); 
      this.eventQuestionnaireData = res.data.metaData.questionData;

      console.log(this.eventQuestionnaireData[0].answerType);
      
      this.cwcRegistrationForm.setControl('questionnaire', this.setQuestionnaires(this.eventQuestionnaireData));
    });


  }

  setQuestionnaires(eventQuestionnaireData: any): FormArray {
    const formArray = new FormArray([]);
    eventQuestionnaireData.forEach((e: any) => {
      formArray.push(this.formBuilder.group({
        questionId: e.question_id,
        eventId: e.event_id,
        question: e.question,
        answerType: e.answerType,
        
      }));
    });
    return formArray;
  }

  /*
  onQuestionAdd() {
    this.questionnaire = this.cwcRegistrationForm.get('questionnaire') as FormArray;
    this.questionnaire.push(this.adduserquestionary());
  }
  */
  onRemoveButtonClickQuestion(index: any) {
    (<FormArray>this.cwcRegistrationForm.get('questionnaire').removeAt(index));
  }

  
  adduserquestionary(): FormGroup {
    return this.formBuilder.group({
      question: '',
      answerType: '',
    });
  }
  
}
