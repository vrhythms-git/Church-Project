import { Component, OnInit } from '@angular/core';
import { uiCommonUtils } from '../../common/uiCommonUtils'
import { ApiService } from '../../services/api.service'
import { ScoreUploadComponent } from '../renderers/score-upload/score-upload.component'
import { ScoreUploadInputComponent } from '../renderers/score-upload-input/score-upload-input.component'
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
      { headerName: 'Event Name', field: 'name', resizable: true, sortable: true, filter: true, checkboxSelection: true },
      { headerName: 'Event Type', field: 'event_type', resizable: true, sortable: true, filter: true, },
      // { headerName: 'Member Type', field: 'memberType', sortable: true, filter: true, width: 150 },
      // { headerName: 'Parish', field: 'parish_name', sortable: true, filter: true, width: 450 },
      { headerName: 'Upload Score', field: 'action', resizable: true, cellRendererFramework: ScoreUploadComponent, width: 170 }
    ];

    this.participantColumnDefs = [
      { headerName: 'Enrollment Id', field: 'enrollmentId', resizable: true, sortable: true, filter: true, checkboxSelection: true },
      // { headerName: 'School Grade', field: 'schoolGrade', sortable: true, filter: true },
      { headerName: 'Category', field: 'category', sortable: true, resizable: true, filter: true, },
      // { headerName: 'Parish', field: 'parish_name', sortable: true, filter: true, width: 450 },
      {
        headerName: 'Score', field: 'score', flex: 1, width: 50, editable: true, resizable: true,

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
    ];

    let userId = this.uiCommonUtils.getUserMetaDataJson().userId

    this.apiService.callGetService(`getEventData?user=${userId}`).subscribe((respData) => {

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

selectedEventId:any;
selectedEventName:any;
  onRowClicked(event: any) {
    $("#imagemodal").modal("show");
    this.selectedEventId = event.data.event_Id; 
    this.selectedEventName = event.data.name;
    this.apiService.callGetService(`getParticipants?event=${event.data.event_Id}`).subscribe((respData) => {

      if (respData.data.status == 'failed') {
        this.participantRowData = [];
        this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
        return;
      } else
        this.participantRowData = respData.data.paticipants
    });
  }

  handleScoreSaveBtnClick(event: any) {

    let scoreData: any = this.getuserScoreArray();
    if (scoreData.length == 0) {
      this.uiCommonUtils.showSnackBar('Nothing to save!', 'error', 3000)
      return;
    } else {
      let payload: any = {};
      payload.action = 'save';
      payload.scoreData = scoreData;

      this.apiService.callPostService('postScore', payload).subscribe((response) => {

          if(response.data.status == 'failed'){
            this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000)
            return;
          }else{
            this.uiCommonUtils.showSnackBar('Score recorded successfully!', 'success', 3000)
          }
      })

    }
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

