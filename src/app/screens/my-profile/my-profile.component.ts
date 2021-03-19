import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  MyProfileForm: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.MyProfileForm = this.formBuilder.group({
      firstName : new FormControl('', Validators.required),
      middleName : new FormControl('', Validators.required),
      lastName : new FormControl('', Validators.required),
      Emailaddress : new FormControl('', [Validators.required,  
         Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]), //email
         addressLine1 : new FormControl('', Validators.required),
      addressLine2 : new FormControl('', Validators.required),
      phoneNumber : new FormControl('',  [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      city : new FormControl('', Validators.required),
      state : new FormControl('', Validators.required),
      postalCode : new FormControl('', Validators.required),
      country : new FormControl('', Validators.required),
    });
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.MyProfileForm.value);
  }

}
