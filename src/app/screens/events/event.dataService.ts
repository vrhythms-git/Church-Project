import { Injectable } from '@angular/core';


var thisData = {};


@Injectable({
  providedIn: 'root',
})

export class EventDataService {

    constructor() { }

    getSelectedRowData(): any {
        return thisData;
    }
    setSelectedRowData(data: any) {
     
        return thisData = data;
    }

    getDataService(): EventDataService {
        return this;
    }


}
