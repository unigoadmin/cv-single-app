import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { FormBuilder, FormControl } from '@angular/forms';
import { JobCentralService } from '../../core/http/job-central.service';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icClose from '@iconify/icons-ic/twotone-close';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JobNotes } from '../../core/model/jobnotes';

@UntilDestroy()
@Component({
  selector: 'cv-job-notes',
  templateUrl: './job-notes.component.html',
  styleUrls: ['./job-notes.component.scss']
})
export class JobNotesComponent implements OnInit {
  @Input() JobId:number=0;
  icInsertComment = icInsertComment;
  icEdit=icEdit;
  icClose=icClose;
  commentCtrl = new FormControl();
  loginUser: LoginUser;
  NotesList: JobNotes[];
  currentNotes: JobNotes;
  form: any;
  inputsrc:string=null;

  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private jobCentralService: JobCentralService,
    private fb: FormBuilder) { 
      this.NotesList = [];
      this.currentNotes = new JobNotes();
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetJobNotes(this.JobId,this.loginUser.Company.Id);
    }
  }


  GetJobNotes(jobID: number,companyId:number) {
    this.jobCentralService.GetJobMasterNotes(jobID,companyId)
      .subscribe(response => {debugger;
        if (response.IsError == false) {
          this.NotesList = response.Data;
          this.NotesList.forEach(element => {
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
    this.currentNotes.JobId= this.JobId;
    this.currentNotes.Comment = this.commentCtrl.value;
    this.currentNotes.CreatedBy = this.loginUser.UserId;
    this.currentNotes.CompanyId = this.loginUser.Company.Id;
    this.jobCentralService.AddJobMasterNotes(this.currentNotes)
      .subscribe(response => {
        this._alertService.success("Notes has been added Successfully");
        this.GetJobNotes(this.JobId,this.loginUser.Company.Id);
        this.currentNotes = new JobNotes();
        this.commentCtrl.setValue(null);
        this.UpdateNotesCount();

        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      },
        error => {
          this._alertService.error(error);
        });
  }

  UpdateNotesCount() {
      EmitterService.get("JobNotescnt").emit(this.JobId);
  }

  handleKeyEvent(event,value){
    console.log( "Event (%s): %s", event.type, value );
    var inputValue = (<HTMLInputElement>document.getElementById("incomment")).value;
    inputValue += '\r\n';
  }
}
