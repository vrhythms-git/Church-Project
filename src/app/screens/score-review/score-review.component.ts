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
      { headerName: 'Event Name', field: 'name', resizable: true, flex:1, suppressSizeToFit: true, sortable: true, filter: true },
      { headerName: 'Event Type', field: 'event_type',flex:1, resizable: true, suppressSizeToFit: true, sortable: true, filter: true },
    ];

    this.scoreApprovalColDef = [
      { headerName: 'Enrollment ID', field: 'enrollmentId',flex:1, resizable: true, suppressSizeToFit: true, sortable: true, filter: true },
      { headerName: 'Category', field: 'category',flex:1, resizable: true, suppressSizeToFit: true, sortable: true, filter: true },
      { headerName: 'Score', field: 'score', flex: 1, width: 50, suppressSizeToFit: true, resizable: true, }
    ];

    let userId = this.uiCommonUtils.getUserMetaDataJson().userId

    this.apiService.callGetService(`getEventData?user=${userId}&&eventType=review_pending`).subscribe((respData: any) => {

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

  selectedCat: string = 'All';
  selectedJudge: string = 'All';
  catNameArr: any = [];
  judgeNameArr: any = [];
  selectedEventData: any = {}
  masterData: any;
  onRowClicked(event: any) {

    this.scoreApprovalRowData = [];
    this.catNameArr = [];
    this.judgeNameArr = [];
    this.selectedEventData = event.data;
    $("#imagemodal").modal("show");

    this.apiService.callGetService(`getParticipants?event=${event.data.event_Id}&to=approve`).subscribe((respData) => {
      if (respData.data.status == 'failed') {
        this.scoreApprovalRowData = [];
        this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
        return;
      } else {
        this.scoreApprovalRowData = respData.data.paticipants
        this.masterData = respData.data.paticipants;

        respData.data.paticipants.forEach((item: any) => {
          let index1 = this.catNameArr.findIndex((arrItem: any) => arrItem.categoryId == item.categoryId)
          let index2 = this.judgeNameArr.findIndex((arrItem: any) => arrItem.judgeId == item.judgeId)
          if (index1 < 0)
            this.catNameArr.push(item);
          if (index2 < 0)
            this.judgeNameArr.push(item)
        });
      }
    });
  }

  onDropdowwnSelChange(event: any) {

    if (this.selectedCat === 'All' && this.selectedJudge === 'All')
      this.scoreApprovalRowData = this.masterData;
    else if (this.selectedCat !== 'All' && this.selectedJudge === 'All')
      this.scoreApprovalRowData = this.masterData.filter((item: any) => item.categoryId == this.selectedCat)
    else if (this.selectedCat === 'All' && this.selectedJudge !== 'All')
      this.scoreApprovalRowData = this.masterData.filter((item: any) => item.judgeId == this.selectedJudge)
    else if (this.selectedCat !== 'All' && this.selectedJudge !== 'All') {
      this.scoreApprovalRowData = this.masterData.filter((item: any) => (item.judgeId == this.selectedJudge) && item.categoryId == this.selectedCat)
    }

  }

  handleScoreApproveBtnClick() {

    if (this.scoreApprovalRowData.length == 0) {
      this.uiCommonUtils.showSnackBar('Nothing to Approve!', 'error', 3000)
      return;
    } 
  }
}