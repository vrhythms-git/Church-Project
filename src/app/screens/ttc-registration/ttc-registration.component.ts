import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ttc-registration',
  templateUrl: './ttc-registration.component.html',
  styleUrls: ['./ttc-registration.component.css']
})
export class TtcRegistrationComponent implements OnInit {

  ttcRegistrationForm: any;
  TtcTeacherPhoneNumber: any;
  max_date!: any;
  TtcPrincipalPhoneNumber: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
   
    this. ttcRegistrationForm = this.formBuilder.group({
      TtcParishName : new FormControl('', Validators.required),

      TtcParishAddress : new FormControl('', Validators.required),

      TtcLandmark : new FormControl('', Validators.required),

      TtcCity : new FormControl('', Validators.required),

      TtcState : new FormControl('', Validators.required),

      TtcPostalCode : new FormControl('', Validators.required),

      TtcCountry : new FormControl('', Validators.required),

      TtcPrincipalName : new FormControl('', Validators.required),

      

      TtcVicarName : new FormControl('', Validators.required),

     
      TtcPrincipalEmail : new FormControl('', [Validators.required,  
         Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]), //email
         
         TtcPrincipalPhoneNumber : new FormControl('',  [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),


         TtcTeacherName : new FormControl('', Validators.required),
      
         TtcTeacherEmail : new FormControl('', [Validators.required,  
        Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]), //email

        TtcTeacherPhoneNumber : new FormControl('',  [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),

        TtcExamDate : new FormControl('', [Validators.required  ]),
    });
    this.max_date = new Date;
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.ttcRegistrationForm.value);
  }
  telInputObject(obj: { setCountry: (arg0: string) => void; }) {
    console.log(obj);
    obj.setCountry('us');
  }
  TTCgetNumber(event: any) {
    console.log(event);
    this.TtcTeacherPhoneNumber = event;
  }
  TTCgetNumber1(event: any) {
    console.log(event);
    this.TtcPrincipalPhoneNumber = event;
  }
  TTCExamDate(event:any){
    let year = new Date(event).getFullYear();
    let today = new Date().getFullYear();
if(year > today){
  alert("Select Date in Past");
}
  }
}
