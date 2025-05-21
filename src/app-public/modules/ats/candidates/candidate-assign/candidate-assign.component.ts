import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CandidateService } from '../../core/http/candidates.service';
import { MarketingDashboardService } from '../../core/http/marketingdashboard.service';
import icClose from '@iconify/icons-ic/close';
import { assign } from 'src/@shared/models/assign';
import { BenchCandidate } from '../../core/models/benchcandidate';
import { CandidateAssigneMapping } from '../../core/models/candidateassigneemapping';
import { UserModules } from 'src/@cv/models/accounttypeenum';
import { CandidateRecruiterMappings } from '../../core/models/candidaterecruitermapping';
import { HashTag } from 'src/@shared/models/hashtags';

@Component({
  selector: 'cv-tc-candidate-assign',
  templateUrl: './candidate-assign.component.html',
  styleUrls: ['./candidate-assign.component.scss']
})
export class TcCandidateAssignComponent implements OnInit {

  loginUser: LoginUser;
  SelectedAssigness: assign[] = [];
  AddToBenchForm: FormGroup;
  icClose = icClose;
  CandidateNotes: any;
  benchCandidates: BenchCandidate = new BenchCandidate();
  candidatesMapping: CandidateAssigneMapping[] = [];
  currentModule: string;
  headerText: string;
  SelectedKwywods: string[] = [];
  selectedHashTagChips: any[] = [];
  IsPageDirty: boolean = false;
  dbHashTags: string;
  applicantsMapping: CandidateRecruiterMappings[] = [];
  existingAssigness: any[] = [];
  IsBenchCandidate: boolean;
  IsAssignessAvailable: boolean = false;
  hashtags: HashTag[];
  constructor(@Inject(MAT_DIALOG_DATA) public defdata: any,
    private dialogRef: MatDialogRef<TcCandidateAssignComponent>,
    private fb: FormBuilder,
    private _service: CandidateService,
    private _mktservice: MarketingDashboardService,
    private cd: ChangeDetectorRef,
    private _alertService: AlertService,
    private _authService: AuthenticationService) {
    this.AddToBenchForm = this.fb.group({
      assigneeinput: [null],
      Notes: [null],
    });
    this.currentModule = UserModules.TalentCentral;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.IsBenchCandidate = this.defdata.inputsrc == 'bench';
      this.getCandidate(this.defdata.candidateId);
    }
  }

  getCandidate(CandidateId: number) {
    this.SelectedAssigness = [];
    this._mktservice.GetBenchCandidateForEdit(CandidateId, this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.benchCandidates = response.Data;
          if (this.benchCandidates.AssigneeList.length > 0) {
            this.existingAssigness = this.benchCandidates.AssigneeList.map(x => x.UserId);
          }
          else {
            this.existingAssigness = [];
          }


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


  GetSelectedAssignees(event) {
    this.SelectedAssigness = event;
    this.IsAssignessAvailable = this.ValidateAssignees();
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
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

  AssignSingleResponse() {

    if (this.SelectedAssigness.length > 0) {
      var i = 1;
      this.SelectedAssigness.forEach(item => {
        var applicant = new CandidateRecruiterMappings();
        applicant.ID = i;
        applicant.RecruiterId = item.value;
        applicant.CandidateId = this.defdata.candidateId;
        applicant.MappingStatus = item.mapping;
        applicant.RecruiterEmail = item.email;
        applicant.RecruiterName = item.name;
        this.applicantsMapping.push(applicant);
        i++;
      });

      const candStatus = this.IsBenchCandidate ? 10 : 2;

      const applicants = {
        companyId: this.loginUser.Company.Id,
        CandidateId: this.defdata.candidateId,
        CandidateRecruiters: this.applicantsMapping,
        AssignedBy: this.loginUser.UserId,
        Notes: this.CandidateNotes,
        Action: 'Assign',
        UpdatedBy: this.loginUser.UserId,
        HashTags: this.selectedHashTagChips.join(','),
        Skills: this.SelectedKwywods ? this.SelectedKwywods.join(',') : null,
        IsBenchCandidate: this.IsBenchCandidate,
        Status: candStatus,
        Benchpriority: this.benchCandidates.BenchPriority
      }

      this._service.CandidateAssignToRecruiters(applicants).subscribe(response => {
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          this.dialogRef.close(true);
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      }, error => {
        this._alertService.error(error);
      })
    }
    else {
      this._alertService.error("Please select Recruiter");
    }
  }

  ValidateAssignees(): boolean {
    return this.SelectedAssigness.some(item => item.mapping === true);
  }


}
