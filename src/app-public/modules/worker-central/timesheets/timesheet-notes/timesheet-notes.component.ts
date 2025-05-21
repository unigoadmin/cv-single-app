import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { TimesheetService } from '../../core/http/timesheet.service';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { TimesheetMasterNotes } from '../../core/models/timesheetmasternotes';
import { TimesheetManagerList } from '../../core/models/tsmanagerlist';
import { IconService } from 'src/@shared/services/icon.service';


@Component({
  selector: 'cv-timesheet-notes',
  templateUrl: './timesheet-notes.component.html',
  styleUrls: ['./timesheet-notes.component.scss']
})
export class TimesheetNotesComponent implements OnInit {
  
 
  commentCtrl = new FormControl();
  loginUser: LoginUser;
  public timesheetnotesData: TimesheetMasterNotes[];
  timesheetnotes: TimesheetMasterNotes;
  form: any;
  isSubmitting: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public def_Timesheet: TimesheetManagerList,
  private dialogRef: MatDialogRef<TimesheetNotesComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private timesheetService: TimesheetService,
    public iconService: IconService,
    private fb: FormBuilder) { 
    this.timesheetnotesData = [];
    this.timesheetnotes = new TimesheetMasterNotes();
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetNotes(this.def_Timesheet.TimesheetID);
    }
  }

  GetNotes(TimesheetID: number) {
    this.timesheetService.GetTimesheetNotes(TimesheetID,this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.timesheetnotesData = response.Data;
          this.timesheetnotesData.forEach(element => {
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

    if (!this.commentCtrl.value) {debugger;
      return;
    }
    this.isSubmitting = true;
    this.timesheetnotes.ManagerID = this.loginUser.UserId;
    this.timesheetnotes.EmployeeID = this.def_Timesheet.EmployeeID;
    this.timesheetnotes.TimesheetID = this.def_Timesheet.TimesheetID;
    this.timesheetnotes.EmployerType = this.loginUser.Role;
    this.timesheetnotes.CompanyId = this.loginUser.Company.Id;
    this.timesheetnotes.CommentBy = this.loginUser.FirstName +" "+this.loginUser.LastName;

    this.timesheetnotes.Comment = this.commentCtrl.value;
    this.timesheetService.SaveComments(this.timesheetnotes)
      .subscribe(response => {
        this.GetNotes(this.def_Timesheet.TimesheetID);
        this._alertService.success("Notes has been added Successfully");
        this.timesheetnotes = new TimesheetMasterNotes();
        this.commentCtrl.setValue(null);
        this.isSubmitting = false;
      },
        error => {
          this._alertService.error(error);
          this.isSubmitting = false;
        });
  }

  handleEnter(event: KeyboardEvent): void {
    // Allow the default Enter key behavior without custom logic
    if (event.key === 'Enter') {
      event.stopPropagation(); // Stops propagation but keeps the default behavior
    }
  }

}
