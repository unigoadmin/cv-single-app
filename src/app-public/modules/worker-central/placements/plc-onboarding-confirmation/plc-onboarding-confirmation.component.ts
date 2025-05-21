import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';

@Component({
  selector: 'cv-plc-onboarding-confirmation',
  templateUrl: './plc-onboarding-confirmation.component.html',
  styleUrls: ['./plc-onboarding-confirmation.component.scss']
})
export class PlcOnboardingConfirmationComponent implements OnInit {
 
  icClose = icClose;
  constructor(public dialogRef: MatDialogRef<PlcOnboardingConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any,) { }

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
