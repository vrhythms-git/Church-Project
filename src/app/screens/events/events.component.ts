import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Events } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
//import { EventEditComponent } from '../event-edit/event-edit.component';
import { ButtonRendererComponent } from '../renderers/button-renderer/button-renderer.component';
//import { Events } from '../models/events.model';
import { EventCreationComponent } from '../event-creation/event-creation.component';
import { EventDataService } from './event.dataService'

declare let $: any;
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  parentValue: any ;
  childValue: any
  term: any;
  columnDefs!: any[];
  rowData: any;
  gridOptions:any;
  gridApi:any;
  params: any;
  data : any;
  loggedInUser : any;
  eventId : any;
  eventEditForm:any;
  selectedEventData:any;
  selectedRowJson: any = {};
  //events! : Events[];

  //events! : Events[];
  @ViewChild('child') public child: EventCreationComponent | undefined;

  
  constructor(private router : Router,private apiService: ApiService,
                private _route :ActivatedRoute, private eventDataService:EventDataService) { }




   //events: Events[] = [];

  agInit(params: any) {
    this.params = params;
    this.data = params.value;
  }

  ngOnInit(): void {

    
    /*
   this._route.paramMap.subscribe(parameterMap => {
      const event_id =  parameterMap.get('event_id');
      this.getIndividualEventData(event_id);
   })
    */
    this.columnDefs = [
      { headerName: 'Event Name', field: 'name', sortable: true, filter: true, width: 170, checkboxSelection: true },
      { headerName: 'Event Type', field: 'event_type', sortable: true, filter: true, width: 160 },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Start Date', field: 'startDate', sortable: true, filter: true, width: 170,
          cellRenderer: (data:any) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
      },
      { headerName: 'End Date', field: 'endDate', sortable: true, filter: true,width: 170,
          cellRenderer: (data:any) => {
            return data.value ? (new Date(data.value)).toLocaleDateString() : '';
            }
      },
      { headerName: 'Actions', field: 'action', cellRendererFramework: ButtonRendererComponent, width: 200,
        cellRendererParams: function (params: any) {
          // onClick: this.openModal.bind(this),
          // label: 'Click'
          // `<button>Edit</button>`;
        }, suppressSizeToFit: false
      }

    ];
    
  
    this.getAllEventsData();
    
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

  getAllEventsData(){  
    this.apiService.getEventsData().subscribe((res) => {
      console.log('These are all the events from database : ');
      console.log(res.data.metaData);
      this.rowData = res.data.metaData.eventData;
      this.eventId = res.data.metaData.eventData[0].event_Id;
      console.log("Event Id is : " +this.eventId);

      //this.events = this.rowData
    });
  }
/*
  public getIndividualEventData(event_id:any){
      if( event_id){
        this.events = this.rowData.metaData.eventData.event_id;
      }
  }
  */
  onGridReady(params:any) {
    this.gridApi = params.api;
  }
  onSelectionChanged(event:any){
    var selectedRows = this.gridApi.getSelectedRows();
  }
  onAddEventClick(){
    this.router.navigate(['/dashboard/createevent']);
  }
  onDeleteEventClick(){
    console.log("Clicked on Event delete button");
    if (this.eventDataService.getSelectedRowData() != undefined) {
      this.selectedRowJson = this.eventDataService.getSelectedRowData();
      console.log('selected row data is :: ' + JSON.stringify(this.selectedRowJson));
    }
  }

  onRowClicked(event:any){    
    //this.router.navigate(['/dashboard/editevent']);
    //this.router.navigate(['/dashboard/createevent/',event]);
    console.log("Event data : " + event.data);
    this.eventDataService.getDataService().setSelectedRowData(event.data);
    this.parentValue = this.router.navigate(['/dashboard/createevent/']);
    //this.parentValue = 'this.child';
  }
}

