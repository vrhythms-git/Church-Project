import { Component, OnInit } from '@angular/core';

declare let $: any;
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  term: any;
  columnDefs!: any[];
  rowData : any;
  gridOptions:any;
  constructor() { }

  ngOnInit(): void {

    this.columnDefs = [
      { headerName: 'Event Name', field: 'name', sortable: true, filter: true, width: 170, checkboxSelection: true },
      { headerName: 'Event Type', field: 'event_type', sortable: true, filter: true, width: 170 },
      { headerName: 'Description', field: 'description', sortable: true, filter: true, width: 200 },
      { headerName: 'Start Date', field: 'start_date', sortable: true, filter: true, width: 170 },
      { headerName: 'End Date', field: 'end_date', sortable: true, filter: true,width: 170 },
      
    ];

    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      treeData: true,
      // autoGroupColumnDef: this.autoGroupColumnDef,
      // getDataPath: this.getDataPath,
      enableFilter: true,
      enableColResize: true,
      defaultColDef: {
        // make every column editable
        editable: false,
        // make every column use 'text' filter by default
        filter: 'agTextColumnFilter'
      }
    };
  }


}
