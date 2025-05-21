import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { assign } from 'src/@shared/models/assign';
import { LoginUser } from 'src/@shared/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl,FormGroup } from '@angular/forms';
import { JobCentralService } from '../../core/http/job-central.service';
import { SubUsers } from  'src/@shared/models/common/subusers';   
import { merge, Observable, Subject } from 'rxjs';
import { distinct, map, startWith } from 'rxjs/operators';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import icClose from '@iconify/icons-ic/twotone-close';
import { ApplicantsMapping, RecruiterMappings, RecruiterObject } from '../../core/model/applicantrecruitermapping';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HashTag } from 'src/@shared/models/hashtags';
import { JobboardResponses } from '../../core/model/jobboardresponses';

@Component({
  selector: 'cv-applicant-assign',
  templateUrl: './applicant-assign.component.html',
  styleUrls: ['./applicant-assign.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class ApplicantAssignComponent implements OnInit {

  loginUser: LoginUser;
  filteredAssignees: Observable<any[]>;
  benchSubUsers: SubUsers[];
  assigneesMultiFilter: FormControl = new FormControl();
  public _onDestroy = new Subject<void>();
  AssigneName: string;
  RecruiterId: string = null;
  RecruiterEmail: string = null;
  RecruiterName: string = null;
  AssigneeCtrl: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  icClose = icClose;
  applicantsMapping: RecruiterMappings[] = [];
  currentApplicant: JobboardResponses = new JobboardResponses();
  RecruiterObjectList: RecruiterObject[] = [];
  ApplicantsMappingList: ApplicantsMapping[] = [];
  Emailrecepients: string[] = [];
  ApplicantNotes: string;
  SelectedAssigness: assign[] = [];
  assignees: assign[];
  addOnBlur: boolean = true;
  removable: boolean = true;
  assigneesremovable: boolean = true;
  assigneesselectable: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;
  @ViewChild('Assigneeauto') matAutocomplete: MatAutocomplete;

  hashtags: HashTag[];
  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  selectedHashTagChips: any[] = [];
  SelectedHashTags: any;
  SelectedKwywods:string[] = [];
  addForm: FormGroup;
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

  constructor(@Inject(MAT_DIALOG_DATA) public def_applicants: any,
    private dialogRef: MatDialogRef<ApplicantAssignComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
    private jobCentralService: JobCentralService) {

    this.assignees = [];

    this.filteredAssignees = this.AssigneeCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._Assignfilter(fruit) : this.assignees.slice()));
      
    this.addForm = this.fb.group({
      Notes: [null],
    });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getBenchSubUsers();
    }
  }

  private _Assignfilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.assignees.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }


  getBenchSubUsers() {
    this.jobCentralService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail, mapping: false });
            });
            this.GetHashtags();
        },
        error => {
          this._alertService.error(error);
        });
  }

  GetHashtags() {
    this.jobCentralService.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });
          if (this.def_applicants.responseId > 0 && this.def_applicants.model == 'single'){
            this.GetExistingAssigness();
            this.GetApplicantDetails(this.loginUser.Company.Id, this.def_applicants.responseId);
          }
        },
        error => this._alertService.error(error));
  }

  GetExistingAssigness() {
    this.jobCentralService.GetApplicantAssingees(this.loginUser.Company.Id, this.def_applicants.responseId)
      .subscribe(
        response => {
          this.SelectedAssigness = response.Data;
        },
        error => {
          this._alertService.error(error);
        });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.AssigneeCtrl.setValue(null);
  }


  onSelFunc(option: any) {
    this.RecruiterId = option.UserId;
    this.RecruiterEmail = option.PrimaryEmail;
    this.RecruiterName = option.FullName;
  }

  assigneesremove(assigneeitem: any): void {
    const index = this.SelectedAssigness.indexOf(assigneeitem);
    if (index >=0) {
      this.SelectedAssigness[index].mapping = false;
    }
    // if (index >= 0) {
    //   this.SelectedAssigness.splice(index, 1);
    // }
  }

  Assigneeselected(event: MatAutocompleteSelectedEvent): void {debugger;
    let assigneitem = this.assignees.find(x => x.value == event.option.value);
    if (assigneitem) {
      const newassing = new assign();
      newassing.name = event.option.viewValue;
      newassing.value = event.option.value;
      newassing.email = assigneitem.email;
      newassing.mapping = true;

      let exitem = this.SelectedAssigness.find(x => x.value == newassing.value);
      if (!exitem) {
        this.SelectedAssigness.push(newassing);
      }
      else{exitem.mapping=true};
    }
    this.AssigneeInput.nativeElement.value = '';
    this.AssigneeCtrl.setValue(null);
  }

  AssignApplicants() {
    if (this.def_applicants.model == 'single' && this.def_applicants.responseId) {
      this.AssignSingleResponse();
    }
    else {
      this.AssignBulkResponses();
    }
  }

  AssignSingleResponse() {
    if (this.SelectedAssigness.length > 0) {
      var i = 1;
      this.SelectedAssigness.forEach(item => {
        var applicant = new RecruiterMappings();
        applicant.ID = i;
        applicant.RecruiterId = item.value;
        applicant.ApplicantId = this.def_applicants.responseId;
        applicant.MappingStatus = item.mapping;
        applicant.RecruiterEmail = item.email;
        applicant.RecruiterName = item.name;
        this.applicantsMapping.push(applicant);
        i++;
      });

      const applicants = {
        companyId: this.loginUser.Company.Id,
        ResponseId: this.def_applicants.responseId,
        applicantRecruiters: this.applicantsMapping,
        AssignedBy: this.loginUser.UserId,
        Notes: this.ApplicantNotes,
        Action: 'Assign',
        UpdateBy: this.loginUser.UserId,
        HashTags: this.selectedHashTagChips.join(','),
        Skills: this.SelectedKwywods ? this.SelectedKwywods.join(',') : null
      }
      
      this.jobCentralService.AssignSingleApplicants(applicants).subscribe(response => {
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

  AssignBulkResponses() {
    if (this.SelectedAssigness.length > 0 && this.def_applicants.responses.length > 0) {
      this.SelectedAssigness.forEach(item => {
        var applicant = new RecruiterObject();
        applicant.RecruiterId = item.value;
        applicant.MappingStatus = item.mapping;
        applicant.RecruiterEmail = item.email;
        applicant.RecruiterName = item.name;
        this.RecruiterObjectList.push(applicant);
      });

      this.def_applicants.responses.forEach(element => {
        var applicant = new ApplicantsMapping();
        applicant.ApplicantId = element.ResponseId;
        applicant.ApplicantName = element.FirstName + " " + element.LastName;
        applicant.Recruiters = this.RecruiterObjectList;
        this.ApplicantsMappingList.push(applicant);
      })

      const applicants = {
        companyId: this.loginUser.Company.Id,
        Applicants: this.ApplicantsMappingList,
        AssignedBy: this.loginUser.UserId,
        Notes: this.ApplicantNotes,
        Action: 'Assign',
        UpdateBy: this.loginUser.UserId
      }
      this.jobCentralService.AssignMultipleApplicants(applicants).subscribe(response => {
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
  }



  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }

  }

  GetApplicantDetails(companyId: number, applicantId: number) {
    this.jobCentralService.ViewResponseDetails(companyId, applicantId).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.currentApplicant = result.Data;
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

        if (this.currentApplicant.Skillset) {
          this.SelectedKwywods = this.currentApplicant.Skillset.split(",");
        }
        else {
          this.SelectedKwywods = [];
        }

      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  GetSelectedSkills(event) {debugger;
    this.SelectedKwywods = event;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

}

