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

  participantRowData:any;
  participantColumnDefs:any;
  participantGridOptions:any;
  
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
      { headerName: 'Event Name', field: 'name', sortable: true, filter: true,  checkboxSelection: true },
      { headerName: 'Event Type', field: 'event_type', sortable: true, filter: true,  },
      // { headerName: 'Member Type', field: 'memberType', sortable: true, filter: true, width: 150 },
      // { headerName: 'Parish', field: 'parish_name', sortable: true, filter: true, width: 450 },
      { headerName: 'Upload Score', field: 'action', cellRendererFramework: ScoreUploadComponent, width: 170 }
    ];

    this.participantColumnDefs = [
      { headerName: 'Enrollment Id', field: 'enrollmentId', sortable: true, filter: true,  checkboxSelection: true },
      // { headerName: 'School Grade', field: 'schoolGrade', sortable: true, filter: true },
      { headerName: 'Category', field: 'category', sortable: true, filter: true,  },
      // { headerName: 'Parish', field: 'parish_name', sortable: true, filter: true, width: 450 },
      { headerName: 'Score', field: 'action', cellRendererFramework: ScoreUploadInputComponent }
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

  
  onRowClicked(event: any) {
    $("#imagemodal").modal("show");
          
          this.apiService.callGetService(`getParticipants?event=${event.data.event_Id}`).subscribe((respData) => {

            if (respData.data.status == 'failed') {
              this.participantRowData = [];
              this.uiCommonUtils.showSnackBar('Something went wrong!', 'error', 3000);
              return;
            }else
              this.participantRowData = respData.data.paticipants  
          });
  }
}

