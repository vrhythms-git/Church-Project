import { Component, OnInit } from '@angular/core';
import { uiCommonUtils } from '../../common/uiCommonUtils'
import { ApiService } from '../../services/api.service'

declare let $: any;


@Component({
  selector: 'app-event-attendance',
  templateUrl: './event-attendance.component.html',
  styleUrls: ['./event-attendance.component.css']
})
export class EventAttendanceComponent implements OnInit {

  data: any;
  params: any;
  eventColumnDefs: any;
  eventRowData: any;
  term: any;
  eventGridOption: any;
  selectedCategory: string = '';

  categoriesArr: any = [];

  attendanceColDef: any;
  attendanceRowData: any;
  attendanceGridOption: any;

  constructor(private apiService: ApiService, private uiCommonUtils: uiCommonUtils) { }

  ngOnInit(): void {

    this.eventGridOption = {
      columnDefs: this.eventColumnDefs,
      rowData: this.eventRowData,
      treeData: true,
      enableFilter: true,
      enableColResize: true,
      enableBrowserTooltips: true,
      defaultColDef: {
        editable: false,
        filter: 'agTextColumnFilter'
      }
    };

    this.attendanceGridOption = {
      columnDefs: this.attendanceColDef,
      rowData: this.attendanceRowData,
      treeData: true,
      enableFilter: true,
      singleClickEdit: true,
      enableColResize: true,
      rowSelection: 'multiple',
      defaultColDef: {
        editable: false,
        filter: 'agTextColumnFilter'
      }
    };

    this.eventColumnDefs = [
      { headerName: 'Event Name', field: 'eventname', suppressSizeToFit: true, flex: 1, resizable: true, sortable: true, filter: true, },
      { headerName: 'Event Type', field: 'eventtype', suppressSizeToFit: true, flex: 1, resizable: true, sortable: true, filter: true, },
      { headerName: 'Start Date', field: 'startdate', suppressSizeToFit: true, flex: 1, resizable: true, sortable: true, filter: true },
      { headerName: 'End Date', field: 'enddate', suppressSizeToFit: true, flex: 1, resizable: true, sortable: true, filter: true },
    ];


    this.attendanceColDef = [
      { headerName: 'Enrollment Id', field: 'enrollmentId', suppressSizeToFit: true, flex: 1, resizable: true, sortable: true, filter: true, },
      { headerName: 'Category', field: 'eventCategoryName', suppressSizeToFit: true, flex: 1, resizable: true, sortable: true, filter: true, },
      { headerName: 'Attendance', field: '', suppressSizeToFit: true, flex: 1, resizable: true, sortable: true, filter: true, checkboxSelection: true },
    ];


    let userId = this.uiCommonUtils.getUserMetaDataJson().userId
    this.apiService.callGetService(`getEventData?user=${userId}&eventType=attendance`).subscribe((respData) => {

      if (respData.data.status == 'failed') {
        this.eventRowData = [];
        this.categoriesArr = []
        this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
        return;
      }

      if (respData.data.metaData) {
        this.eventRowData = respData.data.metaData.events
        // this.categoriesArr = respData.data.metaData.categories
        // this.selectedCategory = respData.data.metaData.categories[0].categoryId
      } else
        this.eventRowData = [];

    });

  }

  selectedEvent: any = {};
  onRowClicked(event: any) {

    this.selectedEvent = event.data;
    this.categoriesArr = event.data.catagories;
    this.selectedCategory = event.data.catagories[0].catId;
    $("#imagemodal").modal("show");

    this.getParicipantData(this.selectedEvent.eventid, this.selectedCategory)
  }

  handleAttendanceSubmitBtnClick(event: any) {

  }

  handleAttendanceSaveBtnClick(event: any) {

  }

  onDropdowwnSelChange(event: any) {
    this.getParicipantData(this.selectedEvent.eventid, this.selectedCategory);

  }

  getParicipantData(eventId: any, category: any) {

    let urlString = `to=attendance&event=${eventId}&category=${category}`;

    this.apiService.callGetService('getParticipants?' + urlString).subscribe((respData) => {
      if (respData.data.status == 'failed') {
        this.attendanceRowData = [];
        this.uiCommonUtils.showSnackBar('Something  went wrong!', 'error', 3000);
        return;
      } else {
        this.attendanceRowData = respData.data.paticipants
        if (this.attendanceRowData == null)
          this.uiCommonUtils.showSnackBar('No one participated in this category!', 'error', 3000);
      }
    });

  }

  onCellValueChanged(event: any) {
    alert(`Value change..`)
  }
}
