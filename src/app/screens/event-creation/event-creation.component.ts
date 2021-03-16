import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';


@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css']
})
export class EventCreationComponent implements OnInit {

  
  eventCreationForm: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

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

      state : new FormControl('',Validators.required)
    })
  }

}
