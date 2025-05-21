import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import icClose from '@iconify/icons-ic/twotone-close';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { MarketingDashboardService } from '../../core/http/marketingdashboard.service';
import { CandidateMaster } from '../../core/models/candidatemaster';
import { CandidateAccount } from '../../core/models/candidateaccount';
import { AccountTypeNameEnum, AccountTypesEnum, UserModules } from 'src/@cv/models/accounttypeenum';
import { assign } from 'src/@shared/models/assign';
import { AccountTypes } from 'src/static-data/accounttypes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectItem } from 'src/@shared/models/SelectItem';
import { ValidationService } from 'src/@cv/services/validation.service';
import { ResumeSource } from '../../core/models/resumesource';
import { BenchCandidateService } from '../../bench-candidates/bench-candidates.service';
import moment from 'moment';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { CandidateRecruiterMappings } from '../../core/models/candidaterecruitermapping';
import { CandidateService } from '../../core/http/candidates.service';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@Component({
  selector: 'cv-candidate-review',
  templateUrl: './candidate-review.component.html',
  styleUrls: ['./candidate-review.component.scss'],
  providers: [AccountTypes],
  animations: [
    fadeInUp400ms,
  ],
})
export class CandidateReviewComponent implements OnInit {

  loginUser: LoginUser;
  benchCandidates: CandidateMaster = new CandidateMaster();
  SelectedKwywods: string[] = [];
  selectedHashTagChips: any[] = [];
  SelectedCerts: string[] = [];
  SelectedAssigness: assign[] = [];
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  enumAccountTypeName: typeof AccountTypeNameEnum = AccountTypeNameEnum;
  cansubVClientAccount: CandidateAccount = new CandidateAccount();
  IsLocation: boolean;
  IsPageDirty: boolean;
  c2cFormValid: boolean=true;
  workStatuFields: SelectItem[] = [];
  CandidateStatus: SelectItem[] = [];
  resumeSource: ResumeSource[];
  addForm: FormGroup;
  icClose = icClose;
  datemask = [/\d/, /\d/, '/', /\d/, /\d/];
  dbHashTags: string;
  loading: boolean;
  currentModule: string;
  applicantsMapping: CandidateRecruiterMappings[] = [];
  existingAssigness: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public inputValues: any,
    private dialogRef: MatDialogRef<CandidateReviewComponent>,
    private _service: BenchCandidateService,
    private _canservice: CandidateService,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _mrktService: MarketingDashboardService,
    private cd: ChangeDetectorRef,
    private accountTypes: AccountTypes,
    private _alertService: AlertService,
    private workStatusService: WorkStatusService
  ) {
    this.addForm = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      phone: [null, [Validators.required, ValidationService.phonenumValidator]],
      email: [null, [Validators.required, Validators.email]],  // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      location: [null],
      wexperience: [null],
      skills: [null],
      tags: [null],
      wpermit: [null, [Validators.required]],
      wpermitexpiration: [null],
      cansource: [null],
      PayRate: [null, [ValidationService.numberValidator]],
      assignees: [null],
      benchpriority: [null],
      Certifications: [null],
      LinkedIn: [null],
      title: [null],
      Qualification: [null],
      Notes: [null],
      AvailablityToStart: [null],
      DOB: [],
      SSN: [],
      EmployementType: [],
      jobtitle: [null],
      SkillRating: [null],
      CommRating: [null]
    });
    
    this.CandidateStatus = this.accountTypes.CandidateStatus;
    this.resumeSource = [];
    this.currentModule = UserModules.TalentCentral;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getResumeSourceByCompany();
      this.getCandidate(this.inputValues.candidateId);
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatuFields = data;
      });
    }
  }

  getResumeSourceByCompany() {
    this._service.getResumeSourceByCompany(this.loginUser.Company.Id)
      .subscribe(
        resumeSource => {
          this.resumeSource = resumeSource;
        },
        error => {
          this._alertService.error(error);
        });
  }

  getCandidate(CandidateId: number) {
    this._mrktService.GetBenchCandidateForEdit(CandidateId, this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.benchCandidates = response.Data;
          this.benchCandidates.Email = this.benchCandidates.CandidateEmail;
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

          this.SelectedCerts = this.benchCandidates.Certifications ? this.benchCandidates.Certifications.split(',') : [];

          if (this.benchCandidates.ManagerList.length > 0) {
            this.existingAssigness = this.benchCandidates.ManagerList.map(x=>x.UserId);
          }
          else {
            this.existingAssigness = [];
          }

          if (this.benchCandidates.AccountMasters && this.benchCandidates.AccountMasters.length > 0) {
            this.benchCandidates.AccountMasters.forEach(element => {
              const acntTypeName = this.getAccounttypeName(element.AccountTypeID);
              const prepaedAccount = this.prepareAccount(element.AccountTypeID, element);
              this.cansubVClientAccount = prepaedAccount;
            })
          }

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

  onChildFormValidityChanged(validity: boolean) {
    this.c2cFormValid = validity;
  }

  GetTechRating(event) {
    this.benchCandidates.TechnicalSkillRating = event.toString();
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetCommRating(event) {
    this.benchCandidates.CommunicationSkillRating = event.toString();
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  onEmploymentTypeChange(ob) {
    this.IsPageDirty = true;
    if (ob.value == 'W2')
      this.c2cFormValid = true;
    else
      this.c2cFormValid = false;
  }

  inputAssignAddress(event) {
    this.getAssignAddress(event.target.value);
  }
  getAssignAddress(event) {
    this.IsPageDirty = true;
    let data = event.address_components
    this.benchCandidates.Location = "";
    this.benchCandidates.City = "";
    this.benchCandidates.State = "";

    if (data && data.length > 0) {
      for (let address of data) {
        if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.benchCandidates.City = address.long_name;
        }
        else if (address.types.includes("administrative_area_level_1")) {
          this.benchCandidates.State = address.short_name;
        }
      }
      this.benchCandidates.Location = this.benchCandidates.City + ', ' + this.benchCandidates.State;
      this.IsLocation = true;
    }
    else {
      this.benchCandidates.Location = null;
      this.IsLocation = false;
    }
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  prepareAccount(AccountType, acunt: CandidateAccount) {
    let Account: CandidateAccount = new CandidateAccount();
    Account = acunt;
    Account.CreatedBy = this.loginUser.UserId;
    Account.CreatedDate = new Date();
    Account.AccountTypeID = AccountType;
    Account.Employer = false;
    Account.AccountLevel = "candidate";
    Account.MappingStatus = true;
    Account.CompanyID = this.loginUser.Company.Id;
    Account.AccountTypeName = this.accountTypes.CandidateC2C.find(x => x.value == AccountType).label;
    if (AccountType === this.enumAccountTypes.EndClient) {
      Account.SalesPOC = null;
    } else {
      Account.SalesPOC.CreatedBy = this.loginUser.UserId;
      Account.SalesPOC.CreatedDate = new Date();
      Account.SalesPOC.FirstName = acunt.SalesPOC.FirstName;
      Account.SalesPOC.LastName = acunt.SalesPOC.LastName;
      Account.SalesPOC.Email = acunt.SalesPOC.Email;
      Account.SalesPOC.Phonenumber = acunt.SalesPOC.Phonenumber;
    }
    return Account;
  }

  getAccounttypeName(AccountTypeId): string {
    let Name = "";
    if (AccountTypeId === this.enumAccountTypes.EndClient) {
      Name = this.enumAccountTypeName.EndClient;
    } else if (AccountTypeId === this.enumAccountTypes.PrimeVendor) {
      Name = this.enumAccountTypeName.PrimeVendor;
    } else if (AccountTypeId === this.enumAccountTypes.ManagedServiceProvider) {
      Name = this.enumAccountTypeName.ManagedServiceProvider
    } else if (AccountTypeId === this.enumAccountTypes.ImplementationPartner) {
      Name = this.enumAccountTypeName.ImplementationPartner
    } else if (AccountTypeId === this.enumAccountTypes.SubPrimeVendor) {
      Name = this.enumAccountTypeName.SubPrimeVendor
    } else if (AccountTypeId === this.enumAccountTypes.ReferralVendor) {
      Name = this.enumAccountTypeName.ReferralVendor
    }
    else if (AccountTypeId === this.enumAccountTypes.SubVendor) {
      Name = this.enumAccountTypeName.SubVendor
    }
    return Name;
  }

  GetSelectedSkills(event) {
    this.SelectedKwywods = event;
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }



  GetCandSubVendorData(event) {
    this.cansubVClientAccount = event;
    this.IsPageDirty = true;
  }

  clearFields() {debugger;
    console.log(this.addForm.valid);
    console.log(this.addForm.dirty);
    this.dialogRef.close();
  }

  SendReview() {
    if (this.SelectedAssigness.length > 0) {
      var i = 1;
      this.SelectedAssigness.forEach(item => {
        var applicant = new CandidateRecruiterMappings();
        applicant.ID = i;
        applicant.RecruiterId = item.value;
        applicant.CandidateId = this.inputValues.candidateId;
        applicant.MappingStatus = item.mapping;
        applicant.RecruiterEmail = item.email;
        applicant.RecruiterName = item.name;
        this.applicantsMapping.push(applicant);
        i++;
      });

      const applicants = {
        companyId: this.loginUser.Company.Id,
        CandidateId: this.inputValues.candidateId,
        CandidateRecruiters: this.applicantsMapping,
        AssignedBy: this.loginUser.UserId,
        Notes: this.benchCandidates.Notes,
        Action: 'Review',
        UpdatedBy: this.loginUser.UserId,
        HashTags: this.selectedHashTagChips.join(','),
        Skills: this.SelectedKwywods ? this.SelectedKwywods.join(',') : null,
        Status: 3 //under mgr review
      }

      this._canservice.CandidateAssignToRecruiters(applicants).subscribe(response => {
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

  GetSelectedAssignees(event) {debugger;
    this.SelectedAssigness = event;
    this.IsPageDirty = true;
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

  UpdateCandidate() {debugger;
    if (this.SelectedAssigness.length > 0 && this.SelectedAssigness.some(x=>x.mapping==true)) {
      let currentDate: any = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      this.loading = true;

      if (this.benchCandidates.EmploymentType == 'C2C') {
        if (this.cansubVClientAccount.AccountID > 0) {
          this.cansubVClientAccount.MappingStatus = true;
          this.cansubVClientAccount.CompanyID = this.loginUser.Company.Id;
          const account = this.DeepCopyForObject(this.cansubVClientAccount);
          this.benchCandidates.AccountMasters.push(account)
        } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
          const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubVendor, this.cansubVClientAccount)
          let account = this.DeepCopyForObject(prearedacnt);
          this.benchCandidates.AccountMasters.push(account);
        }
      }

      this.benchCandidates.CompanyId = this.loginUser.Company.Id;

      if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
        this.benchCandidates.HashTags = this.selectedHashTagChips.join(',');
                                

      if (this.SelectedKwywods && this.SelectedKwywods.length > 0)
        this.benchCandidates.Skillset = this.SelectedKwywods.join(",");


      this.benchCandidates.CompanyId = this.loginUser.Company.Id;
      this.benchCandidates.BenchCandidate = false;
      this.benchCandidates.UpdatedBy = this.loginUser.UserId;
      this.benchCandidates.WorkStatusExpiry = null;
      this.benchCandidates.CreatedDate = new Date();;
      this.benchCandidates.ApplicantId = 0;
      this.benchCandidates.IsTransferApplicantNotes = false;
      this.benchCandidates.IsFromInbox = false;
      this.benchCandidates.Email = this.benchCandidates.CandidateEmail;

      this._mrktService.SaveCandidate(this.benchCandidates)
        .subscribe(
          response => {
            if (response.IsError == false) {
              let canId = response.Data;
              this.SendReview();
              this.dialogRef.close(canId);

            }
            else {
              this._alertService.error(response.ErrorMessage);

            }
          },
          error => {
            this._alertService.error(error);

          }
        );
    }
    else{
      this._alertService.error("Please select Recruiter");
    }

  }


  DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

}
