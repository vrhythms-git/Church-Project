import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder,FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cwc-registration',
  templateUrl: './cwc-registration.component.html',
  styleUrls: ['./cwc-registration.component.css']
})
export class CwcRegistrationComponent implements OnInit {


/*registrationForm=new FormGroup({
FirstName:new FormControl('Ganesh'),
MiddleName:new FormControl(''),
LastName:new FormControl(''),
});*/
/*registrationForm=this.fb.group({
  FirstName:['',Validators.required],
  MiddleName:['',Validators.required],
  LastName:['',Validators.required]
}); 
  constructor(private fb:FormBuilder) { }
*/

cwcRegistrationForm: any;
  rolefields: FormArray | undefined;

//constructor() { }
constructor(private formBuilder: FormBuilder) { }

 /* ngOnInit(): void {
    
  }*/


  ngOnInit() {

    this.cwcRegistrationForm = this.formBuilder.group({
      CWCfirstName : new FormControl('', Validators.required),
      CWCmiddleName : new FormControl('', Validators.required),
      CWClastName : new FormControl('', Validators.required),
      CWCEmailaddress : new FormControl('', [Validators.required,  
         Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]), //email
         CWCstudentsGrade : new FormControl('', Validators.required),
         CWCdob : new FormControl('', [Validators.required  ]),
         CWCparishName : new FormControl('', [Validators.required  ]),
         CWCtestinCenter : new FormControl('', [Validators.required  ]),
         CWCtestingLocation : new FormControl('', [Validators.required  ]),
         CWCstudentGroup : new FormControl('', [Validators.required  ]),
         alternateEmails:this.formBuilder.array([]),
         rolefields:this.formBuilder.array([this.adduserroles()]), 
    });
  }


  onaddbtnclick(){
    this.rolefields = this.cwcRegistrationForm.get('rolefields') as FormArray;
    this.rolefields.push(this. adduserroles());
  }



  adduserroles(): FormGroup {
    return this.formBuilder.group({
      role: '',
      accesslvltype: '',
      accesslvlid: ''
    });
  }


  onremovebtnclick(index: any)
  {
    (<FormArray>this.cwcRegistrationForm.get('rolefields').removeAt(index));
  }


  get alternateEmails(){
    return this.cwcRegistrationForm.get('alternateEmails') as FormArray;
  }
  addAlternateEmail(){
    this.alternateEmails.push(this.formBuilder.control(''));
  }
  selected = 'option2'
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.cwcRegistrationForm.value);
  }
  validateCWCDate(event:any){
    let year = new Date(event).getFullYear();
    let today = new Date().getFullYear();
if(year > today){
  alert("Select Date in Past");
}
  }
}
