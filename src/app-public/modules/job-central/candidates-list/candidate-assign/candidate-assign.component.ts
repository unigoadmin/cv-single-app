import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { assign } from 'src/@shared/models/assign';
import { LoginUser } from 'src/@shared/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { JobCentralService } from '../../core/http/job-central.service';
import { SubUsers } from  'src/@shared/models/common/subusers';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinct, map, startWith, takeUntil } from 'rxjs/operators';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import icClose from '@iconify/icons-ic/twotone-close';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApplicantsMapping, RecruiterMappings, RecruiterObject } from '../../core/model/applicantrecruitermapping';
import { ApplicantInbox } from '../../core/model/applicantinbox';
import { JobCandidateService } from '../../core/http/jobcandidate.service';
import { CandidateMaster } from 'src/@shared/models/common/candidatemaster';

function autocompleteStringValidator(validOptions: SubUsers[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.findIndex(x => x.FullName == control.value) !== -1) {
      return null  /* valid option selected */
    }
    return { 'invalidAutocompleteString': { value: control.value } }
  }
}

@Component({
  selector: 'cv-candidate-assign',
  templateUrl: './candidate-assign.component.html',
  styleUrls: ['./candidate-assign.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class CandidateAssignComponent implements OnInit {

  loginUser: LoginUser;
  filteredAssignees: ReplaySubject<assign[]> = new ReplaySubject<assign[]>(1);
  public benchSubUsers: SubUsers[];
  public salesTeam: SubUsers[];
  assigneesMultiFilter: FormControl = new FormControl();
  public _onDestroy = new Subject<void>();
  AssigneName: string;
  RecruiterId: string = null;
  RecruiterEmail: string = null;
  RecruiterName: string = null;
  ApplicantId: number = 0;
  currentApplicant: ApplicantInbox = new ApplicantInbox();
  candidatemaster: CandidateMaster = new CandidateMaster();
  filteredOptions: Observable<any[]>;
  icClose = icClose;
  //candidatesMapping: CandidateRecruiterMapping[] = [];
  //FinalCandidatesMapping:CandidateRecruiterMapping[] = [];
  Emailrecepients: string[] = [];
  ApplicantNotes: string;
  removable: boolean = true;
  addOnBlur: boolean = false;
  AssigneeCtrl = new FormControl();
  SelectedAssigness: assign[] = [];
  assigneesselectable: boolean = true;
  assigneesremovable: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  applicantsMapping: RecruiterMappings[] = [];
  assignees: assign[] = [];
  title:string;

  public validation_msgs = {
    'contactAutocompleteControl': [
      { type: 'invalidAutocompleteObject', message: 'Contact name not recognized. Click one of the autocomplete options.' },
      { type: 'required', message: 'Contact is required.' }
    ],
    'phoneLabelAutocompleteControl': [
      { type: 'invalidAutocompleteString', message: 'User name not recognized. Click one of the autocomplete options.' },
      { type: 'required', message: 'User is required.' }
    ]
  }



  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public def_inputvalues: any,
    private dialogRef: MatDialogRef<CandidateAssignComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
    private jobCentralService: JobCentralService,
    private _jcservice: JobCandidateService) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      if (this.def_inputvalues.resourceType == 'Recruiter'){
        this.title = "Assign Recruiter";
      }
      else
      {
        this.title = "Send Candidate for Review";
      }
      this.getBenchSubUsers();
      this.CheckApplicantAvailability();
      this.GetCandidate();
    }
  }

  filterUsers() {
    this.salesTeam.sort((a, b) => {
      var valueA = a.FullName, valueB = b.FullName
      if (valueA < valueB)
        return -1
      if (valueA > valueB)
        return 1
      return 0
    });

    this.filteredOptions = this.AssigneeCtrl.valueChanges.pipe(startWith(''), map(val => this._filter(val)));
  }


  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.salesTeam.filter(option => option.FullName.toLowerCase().indexOf(filterValue) === 0);
  }

  CheckApplicantAvailability() {
    this.jobCentralService.CheckCandidateApplicantStatus(this.loginUser.Company.Id, this.def_inputvalues.candidateId)
      .subscribe(
        response => {
          debugger;
          this.ApplicantId = response.Data;
        },
        error => {
          this._alertService.error(error);
        });
  }


  getBenchSubUsers() {
    this.jobCentralService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          this.salesTeam = response.filter(item => item.IsActive == true);
          this.filterUsers();

          this.AssigneeCtrl = new FormControl('',
            { validators: [autocompleteStringValidator(this.salesTeam), Validators.required] })
        },
        error => {
          this._alertService.error(error);
        });
  }

  GetCandidate() {
    this._jcservice.GetCandidateForEdit(this.def_inputvalues.candidateId, this.loginUser.Company.Id)
      .subscribe(response => {
        this.candidatemaster = response.Data;
      },
        error => {
          this._alertService.error(error);
        });
  }


  filterAssigness() {
    if (!this.assignees) {
      return;
    }
    let search = this.assigneesMultiFilter.value;
    if (!search) {
      this.filteredAssignees.next(this.assignees.slice());
      return;
    } else
      search = search.toLowerCase();
    this.filteredAssignees.next(
      this.assignees.filter(ass => ass.name.toLowerCase().indexOf(search) > -1)
    );
  }


  onSelFunc(option: any) {
    this.RecruiterId = option.UserId;
    this.RecruiterEmail = option.PrimaryEmail;
    this.RecruiterName = option.FullName;
  }

  deepCopy(source) {
    return JSON.parse(JSON.stringify(source));
  }

  AssignApplicants() {
    if (this.def_inputvalues.resourceType == 'Recruiter')
      this.AssignRecruiter();
    else
      this.AssignManager();
  }

  AssignRecruiter() {
    this.applicantsMapping=[];
    if (this.AssigneName != null && this.def_inputvalues.candidateId > 0) {
      const selecteditem = this.salesTeam.find(x => x.FullName == this.AssigneName);

        var applicant = new RecruiterMappings();
        applicant.ID = 1;
        applicant.RecruiterId = selecteditem.UserId
        applicant.ApplicantId = 0;
        applicant.MappingStatus = true;
        applicant.RecruiterEmail = selecteditem.PrimaryEmail;
        applicant.RecruiterName = selecteditem.FullName;
        this.applicantsMapping.push(applicant);

      const MappingData = {
        CompanyId: this.loginUser.Company.Id,
        CandidateId: this.candidatemaster.CandidateID,
        RecruiterId: selecteditem.UserId,
        ManagerId:null,
        ApplicantStatus:2,
        MappedApplicant: this.ApplicantId,
        Notes: this.ApplicantNotes,
        CreatedBy: this.loginUser.UserId,
        Action:"ForAssign",
        applicantRecruiters: this.applicantsMapping,
      }
      this.jobCentralService.SaveApplicantFromCandidate(MappingData).subscribe(response => {
        if (!response.IsError) {
          this._alertService.success("Candidate has been sent for review");
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

  AssignManager() {
    if (this.AssigneName != null && this.def_inputvalues.candidateId > 0) {
      const selecteditem = this.salesTeam.find(x => x.FullName == this.AssigneName);
      const MappingData = {
        CompanyId: this.loginUser.Company.Id,
        CandidateId: this.candidatemaster.CandidateID,
        RecruiterId: this.loginUser.UserId,
        ManagerId:selecteditem.UserId,
        ApplicantStatus:3,
        MappedApplicant: this.ApplicantId,
        Notes: this.ApplicantNotes,
        CreatedBy: this.loginUser.UserId,
        Action:"ForReview"
      }
      this.jobCentralService.SaveApplicantFromCandidate(MappingData).subscribe(response => {
        if (!response.IsError) {
          this._alertService.success("Candidate assigned to Manager");
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

}


