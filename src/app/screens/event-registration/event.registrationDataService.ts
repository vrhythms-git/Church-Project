import { Injectable } from '@angular/core';

var thisData = {};


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
}

