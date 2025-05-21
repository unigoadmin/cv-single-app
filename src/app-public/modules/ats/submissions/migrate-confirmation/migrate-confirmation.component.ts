import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';
import { SubmissionService } from '../../core/http/submissions.service';
import { Submissions } from '../../core/models/submission';
import { AddConfirmationComponent } from '../../confirmations/add-confirmation/add-confirmation.component';

@Component({
  selector: 'cv-migrate-confirmation',
  templateUrl: './migrate-confirmation.component.html',
  styleUrls: ['./migrate-confirmation.component.scss']
})
export class MigrateConfirmationComponent implements OnInit {

  loginUser: LoginUser;
  icClose = icClose;
  public selectedSubmission: any;
  public submission: Submissions = new Submissions();

  constructor(@Inject(MAT_DIALOG_DATA) public def_Submission: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MigrateConfirmationComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private submissionService: SubmissionService
    ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.selectedSubmission = this.def_Submission;
    }

  }

  CreateConfirmation() {
    this.dialog.open(AddConfirmationComponent, {
      data:{SubmissionId:this.def_Submission,src:'submission',ConfirmationId:0},width: '80%',disableClose:true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.UpdateSubmissionStatus();
      }
      this.dialogRef.close();
    });
    
  }

  UpdateSubmissionStatus(){
    const submission = {
      SubmissionID:this.def_Submission.SubmissionID,
      CompanyID:this.loginUser.Company.Id,
      UpdatedBy:this.loginUser.UserId
    }
    this.submissionService.UpdateSubmissionToConfirmation(submission).subscribe(response => {
     
    }, error => {
      this._alertService.error(error);
    })

  }

  CheckSubmission() {
    //check whether submission is already converted to confirmation.
    this.submissionService.CheckSubmissionStatus(this.loginUser.Company.Id, this.def_Submission.SubmissionID).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.submission = response.Data;
        if(!this.submission.IsConvertToConfirmation){
          this.CreateConfirmation();
        }
        else
        {
          this._alertService.error('A Confirmation has already been created for this submission');
        }
      }

    },
      error => {
        this._alertService.error(error);
      })
  }



}
