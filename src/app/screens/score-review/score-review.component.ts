import { Component, OnInit } from '@angular/core';
import { uiCommonUtils } from '../../common/uiCommonUtils'
import { ApiService } from '../../services/api.service'
declare let $: any;

@Component({
  selector: 'app-score-review',
  templateUrl: './score-review.component.html',
  styleUrls: ['./score-review.component.css']
})
export class ScoreReviewComponent implements OnInit {

  constructor(private apiService: ApiService, private uiCommonUtils: uiCommonUtils) { }


  data: any;
  params: any;
  eventColumnDefs: any;
  eventRowData: any;
  term: any;
  eventGridOption: any;

  scoreApprovalColDef: any;
  scoreApprovalRowData: any;
  scoreApprovalGridOption: any;

  ngOnInit(): void {

    this.eventGridOption = {
      columnDefs: this.eventColumnDefs,
      rowData: this.eventRowData,
      treeData: true,
      enableFilter: true,
      singleClickEdit: true,
      enableColResize: true,
      defaultColDef: {
        editable: false,
        filter: 'agTextColumnFilter'
      }
    };


    this.scoreApprovalGridOption = {
      columnDefs: this.scoreApprovalColDef,
      rowData: this.scoreApprovalRowData,
      treeData: true,
      enableFilter: true,
      singleClickEdit: true,
      enableColResize: true,
      defaultColDef: {
        editable: false,
        filter: 'agTextColumnFilter'
      }
    };


    // this.eventGridOption.autoSizeColumns(['Event Name', 'Event Type'])
    this.eventColumnDefs = [
      { headerName: 'Event Name', field: 'name', resizable: true, flex: 1, suppressSizeToFit: true, sortable: true, filter: true },
      { headerName: 'Event Type', field: 'event_type', flex: 1, resizable: true, suppressSizeToFit: true, sortable: true, filter: true },
    ];

    this.scoreApprovalColDef = [
      { headerName: 'Enrollment ID', field: 'enrollmentId', flex: 1, resizable: true, suppressSizeToFit: true, sortable: true, filter: true },
      { headerName: 'Category', field: 'category', flex: 1, resizable: true, suppressSizeToFit: true, sortable: true, filter: true },
      { headerName: 'Score', field: 'score', flex: 1, width: 50, suppressSizeToFit: true, resizable: true, }
    ];

    let userId = this.uiCommonUtils.getUserMetaDataJson().userId

    this.apiService.callGetService(`getEventData?user=${userId}&eventType=review_pending`).subscribe((respData: any) => {

      if (respData.data.status == 'failed') {
        this.eventRowData = [];
        this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
        return;
      }

      if (respData.data.metaData.eventData) {
        this.eventRowData = respData.data.metaData.eventData
      } else
        this.eventRowData = [];

    });

    // cellEditorParams: {
    //   values: ['Porsche', 'Toyota', 'Ford', 'AAA', 'BBB', 'CCC'],
    // },

  }

  selectedCat: string = '';
  selectedJudge: string = '';
  catNameArr: any = [];
  judgeNameArr: any = [];
  selectedEventData: any = {}
  masterData: any;
  disableApproveBtn: boolean = false;

  onRowClicked(event: any) {

    this.scoreApprovalRowData = [];
    this.catNameArr = [];
    this.judgeNameArr = [];
    this.selectedEventData = event.data;
    this.disableApproveBtn = true;
    $("#imagemodal").modal("show");

    this.apiService.callGetService(`getEventCatsAndStaffById?id=${event.data.event_Id}`).subscribe((respData) => {


      if (respData.data.status == 'failed') {
        this.scoreApprovalRowData = [];
        this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
        return;
      } else {

        if (respData.data.eventData.catarr !== null && respData.data.eventData.catarr !== null) {
          this.catNameArr = respData.data.eventData.catarr;
          this.judgeNameArr = respData.data.eventData.judgearr;
          this.selectedCat = this.catNameArr[0].categoryId;
          this.selectedJudge = this.judgeNameArr[0].judgeId;

          let urlString = `to=approve&event=${event.data.event_Id}&judge=${this.selectedJudge}&category=${this.selectedCat}`

          this.apiService.callGetService('getParticipants?' + urlString).subscribe((respData) => {
            if (respData.data.status == 'failed') {
              this.scoreApprovalRowData = [];
              this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
              return;
            } else {
              this.scoreApprovalRowData = respData.data.paticipants
              if (this.scoreApprovalRowData !==null && this.scoreApprovalRowData[0].isScoreApproved === true)
                this.disableApproveBtn = true;
              else 
                this.disableApproveBtn = false;
            }
          });

        }
      }
    });
  }

  onDropdowwnSelChange(event: any) {

    let urlString = `to=approve&event=${this.selectedEventData.event_Id}&judge=${this.selectedJudge}&category=${this.selectedCat}`

    this.apiService.callGetService('getParticipants?' + urlString).subscribe((respData) => {
      if (respData.data.status == 'failed') {
        this.scoreApprovalRowData = [];
        this.uiCommonUtils.showSnackBar('Something  went wrong!', 'error', 3000);
        return;
      } else {
        this.scoreApprovalRowData = respData.data.paticipants
        if ( this.scoreApprovalRowData !==null && this.scoreApprovalRowData[0].isScoreApproved === true)
          this.disableApproveBtn = true;
        else
          this.disableApproveBtn = false;
      }
    });
  }

  handleScoreApproveBtnClick() {

    if (this.scoreApprovalRowData === null || this.scoreApprovalRowData.length === 0  ) {
      this.uiCommonUtils.showSnackBar('Nothing to Approve!', 'error', 3000)
      return;
    } else {

      let payload = {
        action: 'approve',
        eventId: this.selectedEventData.event_Id,
        judgeId: this.selectedJudge,
        catId: this.selectedCat
      };

      this.apiService.callPostService('postScore', payload).subscribe((response) => {

        if (response.data.status == 'failed') {
          this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000)
          return;
        } else {
          this.uiCommonUtils.showSnackBar('Score successfully approved!', 'success', 3000)
          this.onDropdowwnSelChange('');
        }
      })


    }
  }
}