import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { EventRegistrationDataService } from './event.registrationDataService';
//import { EventRegistrationDataService } from './event.RegistrationDataService';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css']
})
export class EventRegistrationComponent implements OnInit {

  term: any;
  columnDefs!:any[];
  rowData: any;
  gridOptions:any;
  eventId:any;
  parentValue: any ;
  gridApi:any;
  data:any;
  params:any;

  constructor(private router : Router,private apiService: ApiService,
              private eventRegistrationDataService:EventRegistrationDataService) { }

  ngOnInit(): void {
    this.columnDefs = [
      { headerName: 'Event Name', field: 'name', sortable: true, filter: true, width: 170, checkboxSelection: true },
      { headerName: 'Event Type', field: 'event_type', sortable: true, filter: true, width: 160 },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Event Start Date', field: 'startDate', sortable: true, filter: true, width: 170,
          cellRenderer: (data:any) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
      },
      { headerName: 'Event End Date', field: 'endDate', sortable: true, filter: true,width: 170,
          cellRenderer: (data:any) => {
            return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
      },
      { headerName: 'Registration Start Date', field: 'registrationStartDate', sortable: true, filter: true, width: 170,
          cellRenderer: (data:any) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
      },
      { headerName: 'Registration Start Date', field: 'registrationEndDate', sortable: true, filter: true, width: 170,
      cellRenderer: (data:any) => {
      return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        },suppressSizeToFit: false
  },
    

    ];

    this.getEventDataForRegistration();

    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      treeData: true,
      enableFilter: true,
      enableColResize: true,
      defaultColDef: {
        editable: false,
        filter: 'agTextColumnFilter'
      }
    };
  }
  agInit(params: any) {
    this.params = params;
    this.data = params.value;
  }

  getEventDataForRegistration(){
    this.apiService.getEventForRegistration().subscribe((res) => {
      console.log('These are all the events from database For Registration : ');
      console.log(res.data.metaData);
      this.rowData = res.data.metaData.eventData;
      this.eventId = res.data.metaData.eventData[0].event_Id;
      console.log("Event Id is : " +this.eventId);

      //this.events = this.rowData
    });
  }
  onGridReady(params:any) {
    this.gridApi = params.api;
  }

  onRowClicked(event:any){    
    //this.router.navigate(['/dashboard/editevent']);
    //this.router.navigate(['/dashboard/createevent/',event]);
    console.log("Event data : " + event.data);
    this.eventRegistrationDataService.getDataService().setSelectedRowData(event.data);
    this.parentValue = this.router.navigate(['/dashboard/cwcregistration/']);
    //this.parentValue = 'this.child';
    
  }


}
