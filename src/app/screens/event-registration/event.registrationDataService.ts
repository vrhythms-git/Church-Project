import { Injectable } from '@angular/core';

var thisData = {};
var eventType:any;

@Injectable({
  providedIn: 'root',
})

export class EventRegistrationDataService {

    constructor() { }
    
    getSelectedRowData(): any {
        return thisData;
    }

    setSelectedRowData(data: any) {
     
        return thisData = data;
    }

    getDataService(): EventRegistrationDataService {
        return this;
    }

    getselectedEventData():any {
        return eventType;
    }

    setselectedEventData(data: any){
        return eventType = data;
    }

}

