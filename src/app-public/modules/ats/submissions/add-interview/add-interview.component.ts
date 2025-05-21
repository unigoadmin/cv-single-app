import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { InterviewsService } from '../../core/http/interviews.service';
import { InterviewStatus } from '../../core/models/Interviewstatuslist';
import { InterviewList } from '../../core/models/interviewslist';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import icClose from '@iconify/icons-ic/twotone-close';
import { GlobalSettingsService } from  'src/@shared/http/globalsettings.service';
import { InterviewRounds } from '../../core/models/interviewrounds';
import { InterviewTypes } from '../../core/models/interviewtypes';

@Component({
  selector: 'cv-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit {

  AddInterviewForm: FormGroup;
  loginUser: LoginUser;
  InterviewStatusList: InterviewStatus[];
  selectedSubmission: any;
  SelectedInterview: InterviewList = new InterviewList();
  status_textClass: any = 'text-amber-contrast';
  status_bgClass: any = 'bg-amber';
  selectedDateTime: any;
  icClose=icClose;
  IsLoading:boolean=false;
  minDate = new Date(2020, 0, 1);
  interviewTypesList: InterviewTypes[] = [];
  interviewRoundsList: InterviewRounds[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public def_Submission: any,
  private dialogRef: MatDialogRef<AddInterviewComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private interviewService: InterviewsService,
    private tcservice: GlobalSettingsService,
    private fb: FormBuilder,
    private _eventemtterservice:EventEmitterService) {
    this.AddInterviewForm = this.fb.group({
      IntvTitle: ['', Validators.required],
      InterviewType: ['',Validators.required],
      InterviewDuration: ['',Validators.required],
      InterviewTimeZone: ['',Validators.required],
      ScheduleComments: [''],
      selectedDateTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetInterviewRounds();
      this.GetInterviewTypes();
      this.selectedSubmission = this.def_Submission;
    }
  }

  save() {
    this.IsLoading=true;
    this.SelectedInterview.BenchsubmissionId = this.selectedSubmission.SubmissionID;
    this.SelectedInterview.SubmissionId = this.selectedSubmission.SubmissionID;
    this.SelectedInterview.BenchCandidateId = this.selectedSubmission.CandidateId;
    this.SelectedInterview.CreatedBy = this.loginUser.UserId;
    let formattedDate: any = moment(this.selectedDateTime).format("YYYY-MM-DDTHH:mm:ss.ms");
    if (formattedDate != "Invalid date")
      this.SelectedInterview.InterviewDate = formattedDate; 
    this.interviewService.UpdateInterview(this.SelectedInterview)
      .subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success("Schedule has been updated.");
          this.dialogRef.close(true);
          this._eventemtterservice.intervirewupdateEvent.emit();
        }
        this.IsLoading=false;
      },
        error => {
          this.IsLoading=false;
          this._alertService.error(error);
        }
      )
  }

  GetInterviewTypes() {
    this.tcservice.GetInterviewTypesList(this.loginUser.Company.Id).subscribe(response => {
      if (!response.IsError) {
        this.interviewTypesList = response.Data;
      }
    
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    });
  }

  GetInterviewRounds() {
    this.tcservice.GetInterviewRoundsList(this.loginUser.Company.Id).subscribe(response => {
      if (!response.IsError) {
        this.interviewRoundsList = response.Data;
      }
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    });
  }


}
