import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import {InterviewsService} from '../../core/http/interviews.service';
import {InterviewList} from '../../core/models/interviewslist';
import icKeyboard_Arrow_Down from '@iconify/icons-ic/keyboard-arrow-down';
import icKeyboard_Arrow_Up from '@iconify/icons-ic/keyboard-arrow-up';
import icschedule from '@iconify/icons-ic/schedule';
import icCompany from '@iconify/icons-ic/twotone-business';
import icJob from '@iconify/icons-ic/assignment';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icClose from '@iconify/icons-ic/twotone-close';
import { InterviewStatus } from '../../core/models/Interviewstatuslist';
import { MatSelectChange } from '@angular/material/select';
import { EditInterviewComponent } from '../../interviews/edit-interview/edit-interview.component';
import { InterviewNotesComponent } from '../../interviews/interview-notes/interview-notes.component';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import { ActivityLogSubmission } from '../../core/models/submissionactivitylog';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
const DEFAULT_DURATION = 300;
@Component({
  selector: 'cv-interviews-list',
  templateUrl: './interviews-list.component.html',
  styleUrls: ['./interviews-list.component.scss'],
  animations: [trigger('collapse', [
    state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
    state('true', style({ height: '0', visibility: 'hidden' })),
    transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
    transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
  ])]
})
export class InterviewsListComponent implements OnInit {
  
  @Input() SubmissionId:number;
  @Input() CandidateName:string;
  @Input() CandidateId:number;
  @Input() IsMode:string;
  loginUser: LoginUser;
  schedulesList:InterviewList[];

  icKeyboard_Arrow_Down = icKeyboard_Arrow_Down;
  icKeyboard_Arrow_Up = icKeyboard_Arrow_Up;
  icschedule=icschedule;
  icCompany=icCompany;
  icJob = icJob;
  icEdit=icEdit;
  icClose=icClose;
  icInsertComment=icInsertComment;
  InterviewStatusList:any[];
  ActivityLogs:ActivityLogSubmission[];
  selectedinterview:InterviewList;
   status_textClass: any = 'text-amber-contrast';
   status_bgClass: any = 'bg-amber';
   subtype_textClass: any = 'text-cyan-contrast';
   subtype_bgClass: any = 'bg-cyan';
  @Output() public CloseQuickPopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  collapsed = true;
  toggle() {
    this.collapsed = !this.collapsed;
  }
  expand(selectedInterview:InterviewList) {
    this.selectedinterview=selectedInterview;
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private _service: InterviewsService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private _eventemitterservice:EventEmitterService) {
      this.schedulesList=[];
     }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getInterviewStatusList(this.loginUser.Company.Id);
      if(this.SubmissionId>0){
        this.GetInterviewsList(this.SubmissionId,this.loginUser.Company.Id,this.loginUser.UserId);
      }
      else if(this.CandidateId > 0)
      {
        this.GetInterviewListByCandidate(this.CandidateId,this.loginUser.Company.Id,this.loginUser.UserId);
      }
    }

    this._eventemitterservice.intervirewupdateEvent.subscribe(()=>{
      if(this.SubmissionId>0){
        this.GetInterviewsList(this.SubmissionId,this.loginUser.Company.Id,this.loginUser.UserId);
      }
      else if(this.CandidateId > 0)
      {
        this.GetInterviewListByCandidate(this.CandidateId,this.loginUser.Company.Id,this.loginUser.UserId);
      }
    })
  }

  GetInterviewsList(SubmisionId: number, CompanyId: number,UserId:string) {
    this._service.GetInterviewsBySubmissionId(SubmisionId, CompanyId,UserId)
      .subscribe(response => {
        if(response.IsError==false){
          this.schedulesList = response.Data;
          this.schedulesList.forEach(
            jb => {
              jb.InterviewDate = TimeZoneService.getFormattedDateTime(jb.InterviewDate);
              jb.LastUpdatedDate = TimeZoneService.getLocalDateTime_Submission(jb.LastUpdatedDate, true);
              jb.ActivityLogs.forEach(
                log =>{
                  log.CreatedDate = TimeZoneService.getLocalDateTime(log.CreatedDate, true);
                }
              )
            });
            if (!this.cdr["distroyed"]) {
              this.cdr.detectChanges();
            }
        }
        else{
          this._alertService.error(response.ErrorMessage);
        }
      }, error => {
        this._alertService.error(error);
      });
  }

  GetInterviewListByCandidate(CandidateId: number, CompanyId: number,UserId:string){
    this._service.GetAllInterviewsByCandidate(CompanyId,CandidateId,UserId)
    .subscribe(response => {
      if(response.IsError==false){
        this.schedulesList = response.Data;
        this.schedulesList.forEach(
          jb => {
            jb.InterviewDate = TimeZoneService.getFormattedDateTime(jb.InterviewDate);
            jb.LastUpdatedDate = TimeZoneService.getLocalDateTime_Submission(jb.LastUpdatedDate, true);
            jb.ActivityLogs.forEach(
              log =>{
                log.CreatedDate = TimeZoneService.getLocalDateTime(log.CreatedDate, true);
              }
            )
          });
          if (!this.cdr["distroyed"]) {
            this.cdr.detectChanges();
          }
      }
      else{
        this._alertService.error(response.ErrorMessage);
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  
  Onclose() {
    // this.IsEditSubmission = false;
    // this.IsInterviewList = false;
    this.CloseQuickPopup.emit(true);

  }
  OnEditInterview(Currentinterview:InterviewList){
    this.dialog.open(EditInterviewComponent, {
      data: Currentinterview, width: '60%',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        if (this.SubmissionId > 0) {
          this.GetInterviewsList(this.SubmissionId, this.loginUser.Company.Id, this.loginUser.UserId);
        }
        else if (this.CandidateId > 0) {
          this.GetInterviewListByCandidate(this.CandidateId, this.loginUser.Company.Id, this.loginUser.UserId);
        }
      }
    });
  }

  getInterviewStatusList(CompanyId: number) {
    this._service.GetInterviewStatusLabels(CompanyId)
      .subscribe(response => {
        if(response.IsError==false)
        this.InterviewStatusList = response.Data;
      },
        error => {
          this._alertService.error(error); 
        }
      );
  }

  onLabelChange(CurrentInterview:InterviewList ,change: MatSelectChange){debugger;
    const index = this.schedulesList.findIndex(c => c === CurrentInterview);
    var selectedStatus = change.value;
    this.schedulesList[index].InterviewStatusName = selectedStatus.StatusName;
    this.schedulesList[index].InterviewStatus = selectedStatus.Id;
    const Psubmission = {
      ScheduleID:CurrentInterview.ScheduleId,
      SubmissionID: CurrentInterview.SubmissionId,
      CompanyId: this.loginUser.Company.Id,
      Status: selectedStatus.Id,
      UpdatedBy: this.loginUser.UserId
    };
    this._service.UpdateInterviewStatus(Psubmission)
      .subscribe(
        response => {
          if(response.IsError==false){
            this._alertService.success(response.SuccessMessage);
            if (this.SubmissionId > 0) {
              this.GetInterviewsList(this.SubmissionId, this.loginUser.Company.Id, this.loginUser.UserId);
            }
            else if (this.CandidateId > 0) {
              this.GetInterviewListByCandidate(this.CandidateId, this.loginUser.Company.Id, this.loginUser.UserId);
            }
          }
         
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  ViewNotes(CurrentInterview: InterviewList){
    this.dialog.open(InterviewNotesComponent, {
      data: CurrentInterview, width: '60%',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        //this.GetAllCompanyInterviews(this.loginUser.Company.Id,this.loginUser.UserId);
      }
    });
  }

  

}
