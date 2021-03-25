import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-diploma-exam-registration',
  templateUrl: './diploma-exam-registration.component.html',
  styleUrls: ['./diploma-exam-registration.component.css']
})
export class DiplomaExamRegistrationComponent implements OnInit {

  DiplomaExamRegistration: any;
  DiplomaStudentPhoneNumber: any;
  max_date!: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.DiplomaExamRegistration = this.formBuilder.group({
      DiplomaParishName : new FormControl('', Validators.required),

      DiplomaParishAddress : new FormControl('', Validators.required),

      DiplomaLandmark : new FormControl('', Validators.required),

      DiplomaCity : new FormControl('', Validators.required),

      DiplomaState : new FormControl('', Validators.required),

      DiplomaPostalCode : new FormControl('', Validators.required),

      DiplomaCountry : new FormControl('', Validators.required),

      DiplomaPrincipalName : new FormControl('', Validators.required),

      

      DiplomaVicarName : new FormControl('', Validators.required),

     
      DiplomaPrincipalEmail : new FormControl('', [Validators.required,  
         Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]), //email
         
         DiplomaPrincipalPhoneNumber : new FormControl('',  [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),


         DiplomaStudentName : new FormControl('', Validators.required),
      
         DiplomaStudentEmail : new FormControl('', [Validators.required,  
        Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]), //email

        DiplomaStudentPhoneNumber : new FormControl('',  [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),

        DiplomaExamDate : new FormControl('', [Validators.required  ]),
    });
    this.max_date = new Date;
  }

  
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.DiplomaExamRegistration.value);
  }
  
  getNumber(event: any) {
    console.log(event);
    this.DiplomaStudentPhoneNumber = event;
  }

  validateDOB(event:any){
    let year = new Date(event).getFullYear();
    let today = new Date().getFullYear();
if(year > today){
  alert("Select Date in Past");
}
  }
}
