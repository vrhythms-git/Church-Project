import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { GridOptions, GridApi } from "ag-grid-community";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css']
})
export class EventCreationComponent implements OnInit {

  
  eventCreationForm: any;
  VenuAndProcterfields: any;
  questionaryfields: any;

  term :any;
  eventcategories:any;
  
  eventcategorydata! : any[];

  categoryData:any;
  
  eventarray! :any[];

  eventCategoryForm!: FormGroup ;
  //items!: FormArray

 

  ISCategory! : any[];
  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    
    
    /*
    this.eventCategoryForm.patchValue({
      item : this.eventcategorydata
    });
    */


    this.eventCreationForm = this.formBuilder.group({
      
      eventName : new FormControl('', Validators.required),

      eventType : new FormControl('',Validators.required),

      parishName : new FormControl('',Validators.required),

      description : new FormControl('',Validators.required),

      startDate : new FormControl('',Validators.required),

      endDate : new FormControl('',Validators.required),

      registrationStartDate : new FormControl('',Validators.required),

      registrationEndDate : new FormControl('',Validators.required),

      city : new FormControl('',Validators.required),

      postalCode : new FormControl('',Validators.required),

      country : new FormControl('',Validators.required),

      addressLine1 : new FormControl('',Validators.required),

      addressLine2 : new FormControl(''),
      venuName : new FormControl('',Validators.required),

      state : new FormControl('',Validators.required),

      name : new FormControl('',Validators.required),
      schoolGradeFrom : new FormControl('',Validators.required),
      schoolGradeTo : new FormControl('',Validators.required),
     

      VenuAndProcterfields:this.formBuilder.array([this.adduserVenuAndProcter()]),

      question : new FormControl('',Validators.required),
      responseType : new FormControl('',Validators.required),
      questionaryfields:this.formBuilder.array([this.adduserquestionary()]),
      categoryData : this.formBuilder.array([this.addeventCategory()]),
      
      eventCategoryJudgeOne : new FormControl('',Validators.required),
      eventCategoryJudgeTwo : new FormControl('',Validators.required),
      eventCategoryJudgeThree : new FormControl(''),
      eventCategoryVenue : new FormControl('')
      
    })

    //this.categoryData = this.eventCreationForm.get('categoryData') as FormArray;
    //this.categoryData.push(this.addeventCategory());

    
    
    
    this.apiService.getEventCategoryData().subscribe((res) => {
      console.log('These are Event category from database : ');
      console.log(res.data.metaData);
      this.eventcategorydata = res.data.metaData.eventCategory;
      
      this.eventCreationForm.setControl('categoryData',this.setEventCategory(this.eventcategorydata));
      
    });   


 
  }

  setEventCategory ( eventcategorydata : any ) : FormArray {
      const formArray = new FormArray([]) ;
      eventcategorydata.forEach((e:any) =>{
        formArray.push(this.formBuilder.group({
            name :e.name,
            schoolGradeFrom:e.schoolGradeFrom,
            schoolGradeTo : e.schoolGradeTo
        }));
      });

      return formArray;

  }
  
    

  onaddbtnclick(){
    this.VenuAndProcterfields = this.eventCreationForm.get('VenuAndProcterfields') as FormArray;
    this.VenuAndProcterfields.push(this. adduserVenuAndProcter());
  }

  onaddbtnclick1(){
    this.questionaryfields = this.eventCreationForm.get('questionaryfields') as FormArray;
    this.questionaryfields.push(this. adduserquestionary());
  }
  
  onaddbtncategory(){
      
      this.categoryData = this.eventCreationForm.get('categoryData') as FormArray;
      console.log(this.categoryData);
      this.categoryData.push(this.addeventCategory());
      console.log(this.categoryData);
  }

  adduserquestionary(): FormGroup {
    return this.formBuilder.group({
      question: '',
      responseType: '',
    });
  }
  adduserVenuAndProcter(): FormGroup {
    return this.formBuilder.group({
      venuName: '',
      addressLine1:'',
      addressLine2:'',
      city:'',
      state:'',
      postalCode:'',
      country:''
    });
  }


  onremovebtnclickVenu(index: any)
  {
    (<FormArray>this.eventCreationForm.get('VenuAndProcterfields').removeAt(index));
  }

  onremovebtnclickQuestion(index: any)
  {
    (<FormArray>this.eventCreationForm.get('questionaryfields').removeAt(index));
  }
  
  removeEventCategory(index : any){
    (<FormArray>this.eventCreationForm.get('categoryData').removeAt(index));
  }
  
  addeventCategory() : FormGroup{
    return this.formBuilder.group({
        name : '',
        schoolGradeFrom: '',
        schoolGradeTo : ''
    });
    
  }

  createItem(): any {
    return this.formBuilder.group({
      name: '',
      schoolgradefrom: '',
      schoolgradeto:''
    });
  }

  
 
  
}
