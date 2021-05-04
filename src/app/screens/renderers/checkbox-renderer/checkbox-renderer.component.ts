import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
// import {IAfterGuiAttachedParams} from 'ag-grid';


@Component({
  selector: 'app-checkbox-renderer',
  templateUrl: './checkbox-renderer.component.html',
  styleUrls: ['./checkbox-renderer.component.css']
})
export class CheckboxRendererComponent implements AgRendererComponent {


  params: any;

  agInit(params: any): void {
    this.params = params;
    // this.refresh(params);
  }

  // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  // }


  refresh(event: any): boolean {

   // try {
     if(event.event){
      event.params.data.hasAttended = event.event.currentTarget.checked
      event.params.api.refreshCells(event.params);
    }else
      event.api.refreshCells(event);
     
     
      return false;

   // } catch (err) { }
    return false;
  //}
  }
}
