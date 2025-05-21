import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { InterviewsService } from '../../core/http/interviews.service';
import { BenchScheduleNotes } from '../../core/models/benchschedulenotes';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { InterviewList } from '../../core/models/interviewslist';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-interview-notes',
  templateUrl: './interview-notes.component.html',
  styleUrls: ['./interview-notes.component.scss']
})
export class InterviewNotesComponent implements OnInit {

  icInsertComment = icInsertComment;
  icEdit=icEdit;
  icClose=icClose;
  commentCtrl = new FormControl();
  loginUser: LoginUser;
  benchscheduleNotes: BenchScheduleNotes[];
  currentSchedueNotes: BenchScheduleNotes;
  form: any;
  constructor(@Inject(MAT_DIALOG_DATA) public def_Interview: InterviewList,
    private dialogRef: MatDialogRef<InterviewNotesComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private interviewService: InterviewsService,
    private fb: FormBuilder) {
    this.benchscheduleNotes = [];
    this.currentSchedueNotes = new BenchScheduleNotes();
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetBenchScheduleNotes(this.def_Interview.ScheduleId);
    }
  }

  GetBenchScheduleNotes(InterviewId: number) {
    this.interviewService.GetBenchScheduleNotes(InterviewId)
      .subscribe(response => {
        if (response.IsError == false) {
          this.benchscheduleNotes = response.Data;
          this.benchscheduleNotes.forEach(element => {
            element.CreatedDate = TimeZoneService.getLocalDateTimeShort(element.CreatedDate, true);
          });
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        });
  }

  addComment() {
    if (!this.commentCtrl.value) {
      return;
    }

    this.currentSchedueNotes.Comment = this.commentCtrl.value;
    this.currentSchedueNotes.BenchScheduleId = this.def_Interview.ScheduleId;
    this.currentSchedueNotes.BenchSubmissionId = this.def_Interview.SubmissionId;
    this.currentSchedueNotes.CreatedBy = this.loginUser.UserId;
    this.interviewService.AddBenchScheduleNotes(this.currentSchedueNotes)
      .subscribe(response => {
        this.GetBenchScheduleNotes(this.def_Interview.ScheduleId);
        this._alertService.success("Notes has been added Successfully");
        this.currentSchedueNotes = new BenchScheduleNotes();
        this.commentCtrl.setValue(null);
      },
        error => {
          this._alertService.error(error);
        });
  }

}
