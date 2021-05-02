import { Component, OnInit } from '@angular/core';
import { uiCommonUtils } from '../../common/uiCommonUtils'
import { ApiService } from '../../services/api.service'
import { ScoreUploadComponent } from '../renderers/score-upload/score-upload.component'

declare let $: any;


@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  constructor(private apiService: ApiService, private uiCommonUtils: uiCommonUtils) { }


  data: any;
  params: any;
  eventColumnDefs: any;
  eventRowData: any;
  term: any;
  eventGridOption: any;

  participantRowData: any;
  participantColumnDefs: any;
  participantGridOptions: any;

  ngOnInit(): void {

    this.eventGridOption = {
      columnDefs: this.eventColumnDefs,
      rowData: this.eventRowData,
      treeData: true,
      enableFilter: true,
      enableColResize: true,
      defaultColDef: {
        editable: false,
        filter: 'agTextColumnFilter'
      }
    };

    this.participantGridOptions = {
      columnDefs: this.participantColumnDefs,
      rowData: this.participantRowData,
      treeData: true,
      enableFilter: true,
      enableColResize: true,
      defaultColDef: {
        editable: false,
        filter: 'agTextColumnFilter'
      }
    }

    this.eventColumnDefs = [
      { headerName: 'Event Name', field: 'name',  suppressSizeToFit: true, flex:1,resizable: true, sortable: true, filter: true, },
      { headerName: 'Event Type', field: 'event_type',  suppressSizeToFit: true, flex:1, resizable: true, sortable: true, filter: true, },
      { headerName: 'Upload Score', field: 'action', suppressSizeToFit: true, flex:1, resizable: true, cellRendererFramework: ScoreUploadComponent, width: 170 }
    ];

    this.participantColumnDefs = this.getParticipantDefArr(false)

    let userId = this.uiCommonUtils.getUserMetaDataJson().userId

    this.apiService.callGetService(`getEventData?user=${userId}&&eventType=for_judgement`).subscribe((respData) => {

      if (respData.data.status == 'failed') {
        this.eventRowData = [];
        this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
        return;
      }

      if (respData.data.metaData) {
        this.eventRowData = respData.data.metaData.eventData
      } else
        this.eventRowData = [];

    });

  }

  selectedEventId: any;
  selectedEventName: any;
  selectedEvtIsScrSubmted: boolean = false;
  onRowClicked(event: any) {
   
    this.participantRowData = [];
    $("#imagemodal").modal("show");
    this.selectedEventId = event.data.event_Id;
    this.selectedEventName = event.data.name;
    this.selectedEvtIsScrSubmted = event.data.isScoreSubmitted;
    if (this.selectedEvtIsScrSubmted === true) 
      this.participantColumnDefs = this.getParticipantDefArr(false);
    else
      this.participantColumnDefs = this.getParticipantDefArr(true);
    this.apiService.callGetService(`getParticipants?event=${event.data.event_Id}&to=upload`).subscribe((respData) => {

      if (respData.data.status === 'failed') {
        this.participantRowData = [];
        this.selectedEvtIsScrSubmted = true;
        this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
        return;
      } else
        this.participantRowData = respData.data.paticipants       
    });
  }


  // clickMethod(name: string) {
  //   if(confirm("Are you sure to delete "+name)) {
  //     console.log("Implement delete functionality here");
  //   }
  // }

  getParticipantDefArr(isEditable: boolean) {

    return ([
      { headerName: 'Enrollment Id', field: 'enrollmentId', flex:1, suppressSizeToFit: true, resizable: true, sortable: true, filter: true },
      { headerName: 'Category', field: 'category', suppressSizeToFit: true, flex:1, sortable: true, resizable: true, filter: true, },
      { headerName: 'Score', field: 'score', suppressSizeToFit: true, flex:1, editable: isEditable, resizable: true,

        valueGetter: function (params: any) {
          return params.data.score;
        },
        valueSetter: function (params: any) {

          try {
            let score = parseInt(params.newValue);
            if (score > 0 && score != NaN)
              params.data.score = score;
            return true;
          } catch (error) {
            // alert('Please enter valid score.')
            return false;
          };
        },

      }
    ]);
  }

  handleScoreCompleteBtnClick($event: any) {

    let scoreData: any = this.getuserScoreArray();
    if (scoreData.length == 0) {
      this.uiCommonUtils.showSnackBar('Nothing to save!', 'error', 3000)
      return;
    } {
      let confmMsgSt = `Scores cannot be updated after submission, Please click \'Ok\' to proceed.`;
      if (confirm(confmMsgSt)) {
        this.handleScoreSaveBtnClick('submit');
        this.ngOnInit();
      }
    }
  }

  handleScoreSaveBtnClick(event: any) {

    let scoreData: any = this.getuserScoreArray();
    if (scoreData.length == 0) {
      this.uiCommonUtils.showSnackBar('Nothing to save!', 'error', 3000)
      return;
    } else {
      let payload: any = {};
      if (event == 'submit') {
        payload.action = 'submit';
        payload.eventId = this.selectedEventId;
      }
      else
        payload.action = 'save';
      payload.scoreData = scoreData;

      this.apiService.callPostService('postScore', payload).subscribe((response) => {

        if (response.data.status == 'failed') {
          this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000)
          return;
        } else {
          this.uiCommonUtils.showSnackBar('Score recorded successfully!', 'success', 3000)
        }
      })

    }
    $("#imagemodal").modal("hide");
    this.ngOnInit();
  }

  getuserScoreArray(): any[] {

    let scoreData: any = [];

    this.participantRowData.forEach((item: any) => {
      if (item.score) {
        scoreData.push({
          scoreRefId: item.scoreRefId,
          partEveRegCatId: item.partEveRegCatId,
          score: item.score,
          catStaffMapId: item.catStaffMapId
        })
      }
    });
    return scoreData;
  }
}

