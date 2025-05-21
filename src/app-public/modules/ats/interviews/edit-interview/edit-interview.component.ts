import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { InterviewsService } from '../../core/http/interviews.service';
import { InterviewStatus } from '../../core/models/Interviewstatuslist';
import icClose from '@iconify/icons-ic/twotone-close';
import icPerson from '@iconify/icons-ic/twotone-person';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { InterviewList } from '../../core/models/interviewslist';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment'; 
import { GlobalSettingsService } from 'src/@shared/http/globalsettings.service';
import { InterviewTypes } from '../../core/models/interviewtypes';
import { InterviewRounds } from '../../core/models/interviewrounds';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'cv-edit-interview',
  templateUrl: './edit-interview.component.html',
  styleUrls: ['./edit-interview.component.scss']
})
export class EditInterviewComponent implements OnInit {
  
  form: FormGroup;
  loginUser: LoginUser;
  InterviewStatusList:InterviewStatus[];
  icClose=icClose;
  icPerson=icPerson;
  icEdit=icEdit;
  public SelectedInterview: InterviewList = new InterviewList();
  public status_textClass:any='text-amber-contrast';
  public status_bgClass:any='bg-amber';
  selectedDateTime: any;
  IsLoading:boolean=false;
  minDate = new Date(2020, 0, 1);
  interviewTypesList: InterviewTypes[] = [];
  interviewRoundsList: InterviewRounds[] = [];
  constructor(@Inject(MAT_DIALOG_DATA)public def_Interview: any,
    private dialogRef: MatDialogRef<EditInterviewComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private interviewService: InterviewsService,
    private tcservice: GlobalSettingsService,
    private fb: FormBuilder) { 

      this.form = this.fb.group({
        IntvTitle: ['', Validators.required],
        InterviewType:['', Validators.required],
        InterviewDuration:['', Validators.required],
        InterviewTimeZone: ['', Validators.required],
        ScheduleComments: [''],
        selectedDateTime:['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      forkJoin([
        this.interviewService.GetInterviewStatus(this.loginUser.Company.Id),
        this.tcservice.GetInterviewTypesList(this.loginUser.Company.Id),
        this.tcservice.GetInterviewRoundsList(this.loginUser.Company.Id)
      ]).subscribe(results => {
        this.InterviewStatusList = results[0].Data;
        this.interviewTypesList = results[1].Data;
        this.interviewRoundsList = results[2].Data;

      }, error => {
        console.error(error);
      });

      this.SelectedInterview = this.def_Interview;
      this.selectedDateTime = new Date(moment(this.SelectedInterview.InterviewDate).format("YYYY-MM-DD HH:mm"));

      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }

  }

  getInterviewStatusList(CompanyId: number) {
    this.interviewService.GetInterviewStatus(CompanyId)
      .subscribe(response => {
        if(response.IsError==false)
        this.InterviewStatusList = response.Data;
      },
        error => {
          this._alertService.error(error); 
        }
      );
  }

  onLabelChange(change: MatSelectChange){
    var selectedStatus = change.value;
    this.SelectedInterview.InterviewStatusName = selectedStatus.InterviewStatusName;
    this.SelectedInterview.InterviewStatus=selectedStatus.Id;
  }

  save(){
    this.IsLoading=true;
    this.SelectedInterview.BenchsubmissionId = this.SelectedInterview.SubmissionId;
    this.SelectedInterview.BenchCandidateId= this.SelectedInterview.CandidateId;
    this.SelectedInterview.UpdatedBy = this.loginUser.UserId;
    let formattedDate: any = moment(this.selectedDateTime).format("YYYY-MM-DDTHH:mm:ss.ms");
    if (formattedDate != "Invalid date")
      this.SelectedInterview.InterviewDate = formattedDate; 
    this.interviewService.UpdateInterview(this.SelectedInterview)
        .subscribe(response => {
          if(response.IsError == false){
            this._alertService.success("Schedule has been updated.");
            this.dialogRef.close(true);
          }
          this.IsLoading=false;
        },
        error => {
          this.IsLoading=false;
          this._alertService.error(error); 
        });
  }

  // GetInterviewTypes() {
  //   this.tcservice.GetInterviewTypesList(this.loginUser.Company.Id).subscribe(response => {
  //     if (!response.IsError) {
  //       this.interviewTypesList = response.Data;
  //     }
    
  //     if (!this.cdr["distroyed"]) {
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

  // GetInterviewRounds() {
  //   this.tcservice.GetInterviewRoundsList(this.loginUser.Company.Id).subscribe(response => {
  //     if (!response.IsError) {
  //       this.interviewRoundsList = response.Data;
  //     }
  //     if (!this.cdr["distroyed"]) {
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

}
