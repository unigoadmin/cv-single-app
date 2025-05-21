import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';


@Component({
  selector: 'cv-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent implements OnInit {
  
  title: string;
  message: string;
  icClose = icClose;
  placeholder: string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
    private _alertService: AlertService,) {
    this.title = data.title;
    this.placeholder = this.title;
    this.message = data.message;
  }
  ngOnInit(): void {
  }

  onConfirm(): void {
    const responseData = new ConfirmDialogModelResponse(true,null);
    // Close the dialog, return true
    this.dialogRef.close(responseData);
  }

  onDismiss(): void {
    // Close the dialog, return false
    const responseData = new ConfirmDialogModelResponse(false, null);
    this.dialogRef.close(responseData);
  }

}
