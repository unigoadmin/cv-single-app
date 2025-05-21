import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { AlertService } from 'src/@shared/services';
import { isNullOrUndefined } from 'src/@shared/services/helpers';

@Component({
  selector: 'cv-delete-conform-dialog',
  templateUrl: './delete-conform-dialog.component.html',
  styleUrls: ['./delete-conform-dialog.component.scss']
})
export class DeleteConformDialogComponent implements OnInit {

  title: string;
  message: string;
  DeleteNotes: string;
  icClose = icClose;
  placeholder: string;
  constructor(public dialogRef: MatDialogRef<DeleteConformDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
    private _alertService: AlertService,) {
    this.title = data.title;
    this.placeholder = this.title.includes("Rejection") ? "Reason for Rejection" : "Reason for Deletion"
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

// export class ConfirmDialogModel {

//   constructor(public title: string, public message: string) {
//   }
// }

// export class ConfirmDialogModelResponse {

//   constructor(public Dialogaction: any, public Notes: string) {
//   }
// }
