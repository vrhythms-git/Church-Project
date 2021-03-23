import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class uiCommonUtils {

    constructor(
        private snackBar: MatSnackBar
    ) { }

    showSnackBar(message: string, action: string, duration: number) {
        this.snackBar.open(message, action, {
            duration: duration,
        });
    }

    hasPermissions(permission: string): boolean {

        let metaDataJSON = this.getUserMetaDataJson()
        let tempVar1 = metaDataJSON.permissions.indexOf(permission)
        if (tempVar1 >= 0)
            return true;
        else
            return false;

    }

    getUserMetaDataJson(): any {
        let metaDataJSON = JSON.parse(localStorage.getItem('chUserMetaData') || '{}')

        if (metaDataJSON == {})
            console.log('User metadata not found in the LocalStorage');

        return metaDataJSON;

    }
}