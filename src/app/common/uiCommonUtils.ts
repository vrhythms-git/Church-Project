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

}