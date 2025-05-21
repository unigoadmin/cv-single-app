import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { EmployeeMaster } from 'src/@cv/models/processmenu';
import { LoginUser } from 'src/@shared/models';
import { ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CandidateMaster } from '../../core/models/candidatemaster';

@Component({
  selector: 'cv-worker-exists',
  templateUrl: './worker-exists.component.html',
  styleUrls: ['./worker-exists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class WorkerExistsComponent implements OnInit {

  loginUser: LoginUser;
  isPageload:boolean=false;
  icClose=icClose;
  existingCandidate:EmployeeMaster = new EmployeeMaster();
  title: string;
  message: string;
  placeholder:string;
  failType:string;
  modescreen:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public def_model: any,
    private dialogRef: MatDialogRef<WorkerExistsComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
  ) {debugger;
    this.title = def_model.title;
    this.placeholder = this.title;
    this.message = def_model.msg;
    this.failType = def_model.failtype;
    this.modescreen = def_model.dtype;
   }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.existingCandidate = this.def_model.dmodel;
    }
   
  }

  onUseExistingWorker(): void {
    // Close the dialog, return false
    const responseData = new ConfirmDialogModelResponse("Existing Candidate", null);
    this.dialogRef.close(responseData);
  }

  onUpdateExistingWorker(): void {
    // Close the dialog, return false
    const responseData = new ConfirmDialogModelResponse("Update", null);
    this.dialogRef.close(responseData);
  }

  onDismissProcess():void{
    const responseData = new ConfirmDialogModelResponse("Cancel", null);
    this.dialogRef.close(responseData);
  }

  onCreateNewWorker():void{
    const responseData = new ConfirmDialogModelResponse("New", null);
    this.dialogRef.close(responseData);
  }

}
