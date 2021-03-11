import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ovbs-registration',
  templateUrl: './ovbs-registration.component.html',
  styleUrls: ['./ovbs-registration.component.css']
})
export class OvbsRegistrationComponent implements OnInit {

  ovbsRegistration: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.ovbsRegistration = this.formBuilder.group({

      ovbsRegistrationChurchName : new FormControl('', Validators.required),

      ovbsRegistrationLocation : new FormControl('',Validators.required),

      ovbsRegistrationParishName : new FormControl('',Validators.required),

      ovbsRegistrationParentOrGuardianName : new FormControl('',Validators.required),

      ovbsRegistrationPhoneNumber : new FormControl('',  [Validators.required, 
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),

        ovbsRegistrationEmail : new FormControl('', [Validators.required,  
          Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]),

          ovbsRegistrationEmergencyContactName : new FormControl('',Validators.required),

          ovbsRegistrationEmerrencyContactPhone : new FormControl('',  [Validators.required, 
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),

            ovbsRegistrationTshirtSizeParent : new FormControl('',Validators.required),
        
            ovbsRegistrationTshirtQuantity :new FormControl('',Validators.required)

    })
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.ovbsRegistration.value);
  }
}
