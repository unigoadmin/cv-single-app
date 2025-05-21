import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { assign } from 'src/@shared/models/assign';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';
import { UserModules } from 'src/@cv/models/accounttypeenum';
import { CandidateService } from '../../core/http/candidates.service';
import { MarketingDashboardService } from '../../core/http/marketingdashboard.service';
import { BenchCandidate } from '../../core/models/benchcandidate';

@Component({
  selector: 'cv-candidate-share',
  templateUrl: './candidate-share.component.html',
  styleUrls: ['./candidate-share.component.scss']
})
export class CandidateShareComponent implements OnInit {
  
  SelectedKwywods: string[] = [];
  selectedHashTagChips: any[] = [];
  SelectedAssigness: assign[] = [];
  IsPageDirty:boolean=false;
  loginUser: LoginUser;
  RecepientsFormGroup: FormGroup;
  customrecepients: string;
  EmailNotes: string;
  dbHashTags:string;
  icClose=icClose;
  currentModule:string;
  Emailrecepients: string[] = [];
  existingAssigness:any[] = [];
  benchCandidates: BenchCandidate = new BenchCandidate();
  constructor(@Inject(MAT_DIALOG_DATA) public inputValues: any,
    private dialogRef: MatDialogRef<CandidateShareComponent>,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private _authService: AuthenticationService,
    private _candidateService: CandidateService,
    private _alertService: AlertService,
    private _mktservice: MarketingDashboardService,
  ) { 
    this.RecepientsFormGroup = this.formBuilder.group({
      EmailRecp: [null],
      EmailNotes: [null]
    });
    this.currentModule = UserModules.TalentCentral;
   }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getCandidate(this.inputValues.candidateId);
    }
  }

  GetSelectedHashTags(event) {
    this.selectedHashTagChips = event;
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetSelectedSkills(event) {
    this.SelectedKwywods = event;
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetSelectedAssignees(event) {
    this.SelectedAssigness = event;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  PrepareAssigness() {debugger;
    this.Emailrecepients = [];

    if (this.SelectedAssigness && this.SelectedAssigness.length > 0) {
      this.SelectedAssigness.forEach(x => {
        this.Emailrecepients.push(x.email);
      })
    }

    if (this.customrecepients != null) {
      var recps = this.customrecepients.replace(/\r?\n/g, ",");
      var tmpList: string[] = [];
      tmpList = recps.split(",");
      if (tmpList.length > 0) {
        tmpList.forEach(x => {
          this.Emailrecepients.push(x);
        })
      }
    }
  }

  ShareCandidaes() {
    this.PrepareAssigness();
    if (this.Emailrecepients.length > 0) {
      const sharedCandidate = {
        CandidateId: this.inputValues.candidateId,
        CompanyId: this.loginUser.Company.Id,
        Emailrecepients: this.Emailrecepients,
        SharedBy: this.loginUser.UserId,
        ShareNotes: this.EmailNotes,
        ApplicantNotes: this.EmailNotes,
        HashTags: this.selectedHashTagChips.join(','),
        Skills: this.SelectedKwywods ? this.SelectedKwywods.join(',') : null
      };

      this._candidateService.ShareCandidates(sharedCandidate).subscribe(response => {
        if (!response.IsError) {
          this._alertService.success("Candidate has been shared sucessfully");
          this.dialogRef.close(true);
        }
        else {
          this._alertService.error("Internal server error.");
        }
      }, error => {
        this._alertService.error(error);
      })

    }
    else {
      this._alertService.error("Please select any recruiter or enter email recepients");
    }
  }

  getCandidate(CandidateId: number) {
    this.SelectedAssigness = [];
    this._mktservice.GetBenchCandidateForEdit(CandidateId, this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.benchCandidates = response.Data;
          
          if (this.benchCandidates.Skillset) {
            this.SelectedKwywods = this.benchCandidates.Skillset.split(",");
          }
          else {
            this.SelectedKwywods = [];
          }

          if (this.benchCandidates.HashTags) {
            this.dbHashTags = this.benchCandidates.HashTags;
            this.selectedHashTagChips = this.dbHashTags.split(',').map(Number);
          }
          else
            this.dbHashTags = null;

          if (!this.cd["distroyed"]) {
            this.cd.detectChanges();
          }

        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      }, error => {
        this._alertService.error(error);
      });
  }

}
