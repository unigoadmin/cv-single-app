import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';

@Component({
  selector: 'cv-confirm-dialog-exists',
  templateUrl: './confirm-dialog-exists.component.html',
  styleUrls: ['./confirm-dialog-exists.component.scss']
})
export class ConfirmDialogExistsComponent implements OnInit {

  title: string;
  message: string;
  icClose = icClose;
  placeholder: string;
  
  constructor(public dialogRef: MatDialogRef<ConfirmDialogExistsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
    private _alertService: AlertService,) {
    this.title = data.title;
    this.placeholder = this.title;
    this.message = data.message;
  }
  ngOnInit(): void {
  }

  

}
