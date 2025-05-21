import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { AlertService } from 'src/@shared/services';
import { isNullOrUndefined } from 'src/@shared/services/helpers';

@Component({
  selector: 'cv-confirm-dialog-notes',
  templateUrl: './confirm-dialog-notes.component.html',
  styleUrls: ['./confirm-dialog-notes.component.scss']
})
export class ConfirmDialogNotesComponent implements OnInit {

  title: string;
  message: string;
  DeleteNotes: string;
  icClose = icClose;
  placeholder: string;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
    private _alertService: AlertService,) {
    this.title = data.title;
    this.placeholder = this.title;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    if (this.DeleteNotes == "" || isNullOrUndefined(this.DeleteNotes)) {
      this._alertService.error("Please provide a Notes.");
      return;
    }
    const responseData = new ConfirmDialogModelResponse(true, this.DeleteNotes);
    // Close the dialog, return true
    this.dialogRef.close(responseData);
  }

  onDismiss(): void {
    // Close the dialog, return false
    const responseData = new ConfirmDialogModelResponse(false, null);
    this.dialogRef.close(responseData);
  }

}

