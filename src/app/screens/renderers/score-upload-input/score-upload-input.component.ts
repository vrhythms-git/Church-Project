import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild, ViewContainerRef } from "@angular/core";
///import { ICellEditorAngularComp } from "ag-grid-community/dist/lib/";


@Component({
  selector: 'app-score-upload-input',
  templateUrl: './score-upload-input.component.html',
  styleUrls: ['./score-upload-input.component.css']
})
 export class ScoreUploadInputComponent implements OnInit {

  data: any;
  params: any;
  rowData : any;
  value:number=0;
  userRecords : any;

  ngOnInit(): void {

  }

  agInit(params:  any) {
    this.params = params;
    this.data = params.value;
  }


//   private params: any;
//   private value: any;
  
//   @ViewChild('input', { read: ViewContainerRef }) public input: ViewContainerRef;

   
//   ngAfterViewInit() {
//     // focus on the input 
//     setTimeout(() => this.input.element.nativeElement.focus());
// }

// agInit(params: any): void {
//     this.params = params;

//     this.value = parseInt(this.params.value);
// }

// /* Component Editor Lifecycle methods */
// // the final value to send to the grid, on completion of editing
// getValue() {
//     // this simple editor doubles any value entered into the input
//     return this.value * 2;
// }

// // Gets called once before editing starts, to give editor a chance to
// // cancel the editing before it even starts.
// isCancelBeforeStart() {
//     return false;
// }

// // Gets called once when editing is finished (eg if enter is pressed).
// // If you return true, then the result of the edit will be ignored.
// isCancelAfterEnd() {
//     // our editor will reject any value greater than 1000
//     return this.value > 1000;
// }

}



