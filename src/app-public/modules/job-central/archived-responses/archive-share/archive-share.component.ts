import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { merge, Observable } from 'rxjs';
import { distinct, map } from 'rxjs/operators';
import { LoginUser } from 'src/@shared/models';
import { assign } from 'src/@shared/models/assign';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { JobCentralService } from '../../core/http/job-central.service';
import { SubUsers } from 'src/@shared/models/common/subusers';
import {ShareApplicant} from '../../core/model/shareapplicant';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HashTag } from 'src/@shared/models/hashtags';
import { JobboardResponses } from '../../core/model/jobboardresponses';

@Component({
  selector: 'cv-archive-share',
  templateUrl: './archive-share.component.html',
  styleUrls: ['./archive-share.component.scss']
})
export class ArchiveShareComponent implements OnInit {

  customrecepients: string;
  Emailrecepients: string[] = [];
  EmailNotes:string;
  loginUser: LoginUser;
  icClose=icClose;
  RecepientsFormGroup: FormGroup;
  SelectedAssigness: assign[] = [];
  assigneesselectable: boolean = true;
  assigneesremovable: boolean = true;
  assignees: assign[] = [];
  benchSubUsers: SubUsers[];
  SharedApplcants:ShareApplicant;
  filteredAssignees: Observable<any[]>;
  AssigneeCtrl = new FormControl();
  addOnBlur: boolean = false;
  removable: boolean = true;
  IsApplicantSharing:boolean=false;
  title:string=null;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;
  currentApplicant: JobboardResponses = new JobboardResponses();
  hashtags: HashTag[];
  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  selectedHashTagChips: any[] = [];
  SelectedHashTags: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public def_inputvalues: any,
    private dialogRef: MatDialogRef<ArchiveShareComponent>,
    private formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private jobCentralService: JobCentralService
  ) { 
    this.RecepientsFormGroup = this.formBuilder.group({
      EmailRecp: [null],
      assignees: [null],
      Notes:[null],
      ApplicantNotes:[null]
    });
    this.SharedApplcants = new ShareApplicant();

    this.filteredAssignees = this.AssigneeCtrl.valueChanges.pipe(
      map((item: string | null) => item ? this._Assignfilter(item) : this.assignees.slice()));
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      if(this.def_inputvalues.resourceType=='Applicant'){
        this.title ="Share Applicant";
        this.IsApplicantSharing=true;
        this.GetHashtags();
      }
      else{
        this.title ="Share Candidate";
        this.IsApplicantSharing=false; 
      }
       
      this.getBenchSubUsers();
    }
   
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.jobCentralService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail,mapping:false });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  assigneesremove(assigneeitem: any): void {
    const index = this.SelectedAssigness.indexOf(assigneeitem);
    if (index >= 0) {
      this.SelectedAssigness.splice(index, 1);
    }
  }

  private _Assignfilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.assignees.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }

  Assigneeselected(event: MatAutocompleteSelectedEvent): void {
    const newassing = new assign();
    newassing.name = event.option.viewValue;
    newassing.value = event.option.value;
    newassing.email = this.assignees.find(x => x.value == event.option.value).email;
    let exitem = this.SelectedAssigness.find(x => x.value == newassing.value);
    if (!exitem) {
      this.SelectedAssigness.push(newassing);
    }
    this.AssigneeInput.nativeElement.value = '';
    this.AssigneeCtrl.setValue(null);
  }

  PrepareAssigness(){

    if ((this.SelectedAssigness && this.SelectedAssigness.length == 0) && (this.customrecepients && this.customrecepients.length == 0)) {
      this._alertService.error("Please enter the email recipients");
      return;
    }

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
  
  ShareApplicants(){
    this.PrepareAssigness();
    this.SharedApplcants.ArchiveId = this.def_inputvalues.resourceId;
    this.SharedApplcants.ApplicantId=0;
    this.SharedApplcants.CompanyId = this.loginUser.Company.Id;
    this.SharedApplcants.Emailrecepients=this.Emailrecepients;
    this.SharedApplcants.SharedBy = this.loginUser.UserId;
    this.SharedApplcants.ShareNotes=this.EmailNotes;
    this.SharedApplcants.ApplicantNotes = this.EmailNotes;
    this.SharedApplcants.HashTags = this.selectedHashTagChips.join(',');
    this.SharedApplcants.ApplicantFrom='Archeive';

    this.jobCentralService.ShareApplicants(this.SharedApplcants).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success("Applicants Shared Sucessfully");
        this.dialogRef.close(true);
      }
      else {
        this._alertService.error("Internal server error.");
      }
    }, error => {
      this._alertService.error(error);
    })

  }

 
  GetHashtags() {
    this.jobCentralService.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });
        },
        error => this._alertService.error(error));
  }

  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }

  }

  
}
