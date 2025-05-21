import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { JobCentralService } from '../../core/http/job-central.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { HashTag } from 'src/@shared/models/hashtags';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-applicant-ignore',
  templateUrl: './applicant-ignore.component.html',
  styleUrls: ['./applicant-ignore.component.scss']
})
export class ApplicantIgnoreComponent implements OnInit {
  
  loginUser: LoginUser;
  currentApplicant: JobboardResponses = new JobboardResponses();
  hashtags: HashTag[];
  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  selectedHashTagChips: any[] = [];
  SelectedHashTags: any;
  ApplicantNotes: string;
  icClose=icClose;
  message:string="";
  IgnoreApplicantFormGroup: FormGroup;
  formBuilder: any;
  constructor(@Inject(MAT_DIALOG_DATA) public def_applicants: any,
  private dialogRef: MatDialogRef<ApplicantIgnoreComponent>,
  private fb: FormBuilder,
  private _authService: AuthenticationService,
  private cdRef: ChangeDetectorRef,
  private _alertService: AlertService,
  private jobCentralService: JobCentralService) {
    this.IgnoreApplicantFormGroup = this.fb.group({
      Notes: [null]
    });
   }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetHashtags();
    }
  }

  GetHashtags() {
    this.jobCentralService.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });
          this.GetApplicantDetails(this.loginUser.Company.Id, this.def_applicants.responseId);
        },
        error => this._alertService.error(error));
  }

  GetApplicantDetails(companyId: number, applicantId: number) {
    this.jobCentralService.ViewResponseDetails(companyId, applicantId).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.currentApplicant = result.Data;
        this.message =  'Applicant <b><span class="displayEmail">' + this.currentApplicant.FirstName+ ' '+ this.currentApplicant.LastName + ' </span></b> will be removed from your Responses?'
        if (this.currentApplicant.HashTags) {
          let ids: string[] = this.currentApplicant.HashTags.split(',');
          ids.forEach(element => {
            let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
            hastagitem.state = true;
            this.selectedHashTagChips.push(hastagitem.HashTagId);
          });
          this.selectedHashTagChips = this.currentApplicant.HashTags.split(',');
        }
        else
          this.selectedHashTagChips = [];

      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }

  }

  ValidateAction() {debugger;
    if (this.def_applicants.Source == 'ACP') {
      //Notes is mandantaory.
      if (isNullOrUndefined(this.ApplicantNotes)) {
        this._alertService.error("Please provide Notes");
        return;
      }
      else {
        this.confirmIgnoreRecord();
      }
    }
    else {
      this.confirmIgnoreRecord();
    }
  }

  confirmIgnoreRecord() {
    const pfilters = {
      applicantId: this.currentApplicant.ResponseId,
      CompanyId: this.loginUser.Company.Id,
      UpdatedBy: this.loginUser.UserId,
      Notes: this.ApplicantNotes,
      HashTags: this.selectedHashTagChips.join(','),
      Utype: 'ADD',
      Action: 'NotInterested'
    };
    this.jobCentralService.ApplicantNotInterested(pfilters).subscribe(response => {
      if (response.IsError == false) {
        this._alertService.success("Applicant Ignored Successfully");
        this.dialogRef.close(true);
      }
    },
      error => {
        this._alertService.error(error);
      })
  }


}


