import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: any;
  contactNo: any;
  max_date!: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private AuthService : AuthService 
    ) { }


  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      dob: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern('((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})')]),
      cnfmpwd: new FormControl('', Validators.required),
      mobileNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].{9}')]),
      abtyrslf: new FormControl('')
    });

    this.max_date = new Date;

  // this.today = date.getFullYear()+ "-" + ("0" + (date.getMonth() + 1)).slice(-2)+ "-" +("0" + date.getDate()).slice(-2)
  // console.log("Today:",this.today);
  }

  signUp() {
    var password = this.signUpForm.controls.password.value;
    var confirmPassword = this.signUpForm.controls.cnfmpwd.value;
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      // return false;
    }
    else
      if (this.signUpForm.invalid) {
        return
      }
      else {
        this.signUpForm.value.mobileNo = this.contactNo;
        // this.AuthService.SignUp(this.signUpForm.value).then((data)=>{
         // console.log(JSON.stringify(data));
        // })
      }
    // this.signUpForm.reset();
  }


  cancel() {
    this.router.navigate(['/signin']);
  }

  goToLogin() {
    this.router.navigate(['/signin']);
  }

  getNumber(event: any) {
    console.log(event);
    this.contactNo = event;
  }

  validateDOB(event:any){
    let year = new Date(event).getFullYear();
    let today = new Date().getFullYear();
if(year > today){
  alert("Select Date in Past");
}
  }

}



