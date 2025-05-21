import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconService } from 'src/@shared/services/icon.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { AssignMyselfComponent } from '../../JC-Common/assign-myself/assign-myself.component';
import { LoginUser } from 'src/@shared/models';
import { RecruiterMappings } from '../../core/model/applicantrecruitermapping';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { JobCentralService } from '../../core/http/job-central.service';
import { ApplicantAssignComponent } from '../../JC-Common/applicant-assign/applicant-assign.component';
import { ApplicantIgnoreComponent } from '../../JC-Common/applicant-ignore/applicant-ignore.component';
import { ShareApplicantComponent } from '../../JC-Common/share-applicant/share-applicant.component';
import { ApplicantCandidateComponent } from '../../JC-Common/applicant-candidate/applicant-candidate.component';


@Component({
  selector: 'cv-responses-actions-menu',
  templateUrl: './responses-actions-menu.component.html',
  styleUrls: ['./responses-actions-menu.component.scss']
})
export class ResponsesActionsMenuComponent implements OnInit {

  @Input() row: any;
  DialogResponse: any;
  loginUser: LoginUser;
  applicantsMapping: RecruiterMappings[] = [];
  @Output() refrehApplicants: EventEmitter<void> = new EventEmitter<void>();

  constructor(public iconService: IconService,
    private dialog: MatDialog,
    private _authService: AuthenticationService,
    private jobCentralService: JobCentralService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
  }

  /** Method to validate recruiter */
  validateRecruiter(applicant: any): boolean {
    if (applicant.RecruiterList != null)
      return applicant.RecruiterList.find(x => x.UserId == this.loginUser.UserId);
    else
      return false;
  }

  /** Action Methods */
  assignToSelf(applicant: any): void {
    console.log('Assigning to self:', applicant);
  
    // Create RecruiterMapping object
    const current_applicant: RecruiterMappings = {
      ID: 1, // Validate this hardcoded value
      RecruiterId: this.loginUser.UserId,
      ApplicantId: applicant.ResponseId,
      ApplicantName:null,
      MappingStatus: true,
      RecruiterEmail: this.loginUser.Email,
      RecruiterName: this.loginUser.FullName
    };
  
    // Push the current mapping to the array
    const updatedMapping = [...this.applicantsMapping, current_applicant];
  
    // Prepare the applicants payload
    const applicantsPayload = {
      companyId: this.loginUser.Company.Id,
      ResponseId: applicant.ResponseId,
      applicantRecruiters: updatedMapping,
      AssignedBy: this.loginUser.UserId,
      Notes: null,
      Action: 'Assign',
      UpdateBy: this.loginUser.UserId
    };
  
    // Call the service to assign the applicant
    this.jobCentralService.AssignSingleApplicants(applicantsPayload).subscribe({
      next: (response) => {
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          this.applicantsMapping = []; // Clear mapping after success
          this.refrehApplicants.emit();
        } else {
          this._alertService.error(response.ErrorMessage);
        }
      },
      error: (error) => {
        console.error('Error assigning applicant:', error);
        this._alertService.error('An error occurred while assigning the applicant. Please try again.');
      }
    });
  }
  

  assignApplicant(applicant: any): void {
    console.log('Assigning applicant:', applicant);
      let rowdata = [];
      rowdata.push(applicant);
      this.dialog.open(ApplicantAssignComponent, {
        data: { responses: rowdata, model: 'single', responseId: applicant.ResponseId }, width: '60%', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.refrehApplicants.emit();
        }
      });
  }

  reviewApplicant(applicant: any): void {
    console.log('Sending for review:', applicant);
    this.dialog.open(AssignMyselfComponent, {
      data: { resourceId: applicant.ResponseId, resourceType: 'Inbox' },
      maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.refrehApplicants.emit();
      }
    });
  }

  ignoreApplicant(applicant: any): void {
    console.log('Ignoring applicant:', applicant);
    this.dialog.open(ApplicantIgnoreComponent, {
      data: { responseId: applicant.ResponseId, Source: 'ACP' }, width: '60%', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.refrehApplicants.emit();
      }
    });
  }

  shareApplicant(applicant: any): void {
    console.log('Sharing applicant:', applicant);
    this.dialog.open(ShareApplicantComponent, {
      data: { resourceId: applicant.ResponseId, resourceType: 'Applicant' }, width: '60%', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.refrehApplicants.emit();
      }
    });
  }

  saveToDB(applicant: any): void {
    console.log('Saving applicant to DB:', applicant);
    this.dialog.open(ApplicantCandidateComponent, {
      data: { applicantId: applicant.ResponseId, candidateId: 0 }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        //written logic in stored procedure.
        //this.UpdateApplicantDBStatus(this.loginUser.Company.Id, row.ApplicantId, response);
        this.refrehApplicants.emit();
      }
    });
  }

  assignForTechScreen(applicant: any): void {
    console.log('Assigning for tech screen:', applicant);
    const message = 'Applicant <b><span class="displayEmail"> ' + applicant.FirstName + ' ' + applicant.LastName + ' </span></b> status will be changed to Under Tech Screen ?'
    const dialogData = new ConfirmDialogModel("Tech Screen", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        const Psubmission = {
          ApplicantId: applicant.ResponseId,
          companyId: this.loginUser.Company.Id,
          ApplicantStatus: 10, //Under Tech Screen
          UpdatedBy: this.loginUser.UserId,
          IsUnderTechScreen: true
        };
        this.UpdateResponseStatus(Psubmission);
      }
    });
  }

  assignForMarketing(applicant: any): void {
    console.log('Assigning for marketing:', applicant);
    const message = 'Applicant <b><span class="displayEmail"> ' + applicant.FirstName + ' ' + applicant.LastName + ' </span></b> will be moved to Marketing Screen ?'
    const dialogData = new ConfirmDialogModel("Tech Screen", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        const Psubmission = {
          ApplicantId: applicant.ResponseId,
          companyId: this.loginUser.Company.Id,
          ApplicantStatus: 14,//Marketing Status 
          UpdatedBy: this.loginUser.UserId,
          IsMarketing: true
        };
        this.UpdateResponseStatus(Psubmission);
      }
    });
  }

  UpdateResponseStatus(ResponseStaus: any) {
    this.jobCentralService.UpdateApplicantStatusWithRecruiter(ResponseStaus)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            this.refrehApplicants.emit();
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

}
