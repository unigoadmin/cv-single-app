import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import icAdd from '@iconify/icons-ic/twotone-add';
import { TimesheetDayDetails } from '../../core/models/timesheetdaydetails';
import { AlertService } from 'src/@shared/services';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import icMinus from '@iconify/icons-ic/twotone-minus';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cv-timesheet-add-task',
  templateUrl: './timesheet-add-task.component.html',
  styleUrls: ['./timesheet-add-task.component.scss']
})
export class TimesheetAddTaskComponent implements OnInit {
  icClose = icClose;
  icAdd=icAdd;
  icMinus=icMinus;
  public selectedTimeSheetEachDay: TimesheetDayDetails = new TimesheetDayDetails();
  IsOverTimeTask:boolean=false;
  enableCOntrol:boolean=false
  constructor(
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<TimesheetAddTaskComponent>,
    private cdr: ChangeDetectorRef,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    if(this.Data){
      this.selectedTimeSheetEachDay=this.Data.task;
      this.IsOverTimeTask=this.Data.time;
    }
  }
  addTask(): void {
    if (isNullOrUndefined(this.selectedTimeSheetEachDay.TimesheetTaskDetails)) {
      this.selectedTimeSheetEachDay.TimesheetTaskDetails = []
    }
    let timesheettask = {
      TimesheetTaskID: -1,
      TimesheetDayID: 0,
      Task: null,
      TaskHours: 0,
      IsOverTime: this.IsOverTimeTask,
      CreatedDate: new Date(),
      UpdatedDate: null
    }
    this.selectedTimeSheetEachDay.TimesheetTaskDetails.push(timesheettask);
  }
  RemoveTaskClick(timesheetTaskField) {
    this.selectedTimeSheetEachDay.TimesheetTaskDetails = this.selectedTimeSheetEachDay.TimesheetTaskDetails.filter(task => task != timesheetTaskField);
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  valuechange(task) {
    if (task == '' && !task) {
      this._alertService.error('Please Enter The Task Description');
    }
  }
}
