import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EYesOrNo } from '../../../interfaces/constant';

@Component({
    selector: 'app-dialog-on-action',
    templateUrl: './dialog-on-action.component.html',
    styleUrls: ['./dialog-on-action.component.scss']
})
export class DialogOnActionComponent {
    public result = EYesOrNo;
    constructor(
        public dialogRef: MatDialogRef<DialogOnActionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { text: string },
    ) {}
}
