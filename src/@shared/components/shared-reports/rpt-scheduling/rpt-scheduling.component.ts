import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinct, map, startWith, takeUntil } from 'rxjs/operators';
import { ValidationService } from 'src/@cv/services/validation.service';
import { CommonService } from 'src/@shared/http';
import { ConsultviteTimeZones, LoginUser } from 'src/@shared/models';
import { DailyRecurrencePattern, MonthlyRecurrencePattern, ReportRecurrence, WeeklyRecurrencePattern } from 'src/@shared/core/reports/models/reportschedule';
import icschedule from '@iconify/icons-ic/schedule';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import { GenericReportsService } from 'src/@shared/core/reports/http/genericreports.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'cv-rpt-scheduling',
  templateUrl: './rpt-scheduling.component.html',
  styleUrls: ['./rpt-scheduling.component.scss']
})
export class RptSchedulingComponent implements OnInit {
  loginUser: LoginUser;
  timezoneControl: FormControl = new FormControl();
  timezoneOptions: Observable<any>;
  icClose = icClose;
  icContacts = icContacts;
  dayslist: any[];
  timeFormatList:any[];
  timezones: ConsultviteTimeZones[];
  schedule: ReportRecurrence = new ReportRecurrence();
  public schFormGroup: FormGroup;
  public RecepientsFormGroup: FormGroup;
  SchControl = new FormControl();
  icschedule = icschedule;
  isEndDate: boolean = false;
  Frequency: number = 0;
  Weekdays: number = 0;
  stDate: any = null;
  StTime:any = null;
  StartTime: string;
  customrecepients: string=null;
  Emailrecepients: string[] = [];
  selectedDateTime: any;
  selectedstartDate:any;
  selectedDay:number;
  addOnBlur: boolean = false;
  removable: boolean = true;
  AssigneeCtrl = new FormControl();
  SelectedAssigness: assign[] = [];
  assigneesselectable: boolean = true;
  assigneesremovable: boolean = true;
  public assignees: assign[] = [];
  public benchSubUsers: SubUsers[];
  filteredAssignees: Observable<any[]>;
  assigneesMultiFilter: FormControl = new FormControl();
  public _onDestroy = new Subject<void>();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;
  defaultSelected = 0;
  selection: number;
  EndType:any;
  SchEndDate:any;
  constructor(@Inject(MAT_DIALOG_DATA) public def_report: any,
    private dialogRef: MatDialogRef<RptSchedulingComponent>,
    private formBuilder: FormBuilder,
    private _commonService: CommonService,
    private reportsService: GenericReportsService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef) {
    this.dayslist = [
      { id: 2, value: "Mon", isSelected: false },
      { id: 4, value: "Tue", isSelected: false },
      { id: 8, value: "Wed", isSelected: false },
      { id: 16, value: "Thu", isSelected: false },
      { id: 32, value: "Fri", isSelected: false },
      { id: 64, value: "Sat", isSelected: false },
      { id: 1, value: "Sun", isSelected: false }
    ];
    this.timeFormatList=[
      {label:"12:00 AM",value:"12:00 AM"},
      {label:"1:00 AM",value:"1:00 AM"},
      {label:"2:00 AM",value:"2:00 AM"},
      {label:"3:00 AM",value:"3:00 AM"},
      {label:"4:00 AM",value:"4:00 AM"},
      {label:"5:00 AM",value:"5:00 AM"},
      {label:"6:00 AM",value:"6:00 AM"},
      {label:"7:00 AM",value:"7:00 AM"},
      {label:"8:00 AM",value:"8:00 AM"},
      {label:"9:00 AM",value:"9:00 AM"},
      {label:"10:00 AM",value:"10:00 AM"},
      {label:"11:00 AM",value:"11:00 AM"},
      {label:"12:00 PM",value:"12:00 PM"},
      {label:"1:00 PM",value:"1:00 PM"},
      {label:"2:00 PM",value:"2:00 PM"},
      {label:"3:00 PM",value:"3:00 PM"},
      {label:"4:00 PM",value:"4:00 PM"},
      {label:"5:00 PM",value:"5:00 PM"},
      {label:"6:00 PM",value:"6:00 PM"},
      {label:"7:00 PM",value:"7:00 PM"},
      {label:"8:00 PM",value:"8:00 PM"},
      {label:"9:00 PM",value:"9:00 PM"},
      {label:"10:00 PM",value:"10:00 PM"},
      {label:"11:00 PM",value:"11:00 PM"}
    ]
    this.schFormGroup = this.formBuilder.group({
      Enabled: [null, [Validators.required]],
      Frequency: [null, [Validators.required]],
      RecurrencePattern: [null, [Validators.required]],
      selectedDateTime: ['', Validators.required],
      TimeZoneId: [null],
      EndDate: [null],
      Weekdays: [null],
      selectedDay:[null],
      ScheduleEnd:[null],
      StartTime:[null],
    });
    this.RecepientsFormGroup = this.formBuilder.group({
      EmailRecp: [null],
      assignees: [null]
    })
    this.Frequency = 1;
    this.schedule.RecurrencePattern = 1;
    this.schedule.IsActive = true;

    this.filteredAssignees = this.AssigneeCtrl.valueChanges.pipe(
      map((item: string | null) => item ? this._Assignfilter(item) : this.assignees.slice()));

  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getTimeZones();
      this.getBenchSubUsers();
      if (this.def_report.taskId != null && this.def_report.taskId > 0) {
        this.getScheduleRecurrence();
      }
    }

  }

  getScheduleRecurrence() {
    this.reportsService.getRecurrence(this.loginUser.Company.Id, this.def_report.taskId, this.def_report.reportId)
      .subscribe(
        response => {
          
          if (!response.IsError) {
            this.schedule = response.Data;
            this.SetExistingRecurrence();
            if (!this.cdRef["distroyed"]) {
              this.cdRef.detectChanges();
            }
          }
        },
        error => {
          this._alertService.error(error);
        });
  }

  getTimeZones() {
    this._commonService.GetAllTimeZones().subscribe(res => {
      this.timezones = res;
      this.timezoneOptions = this.timezoneControl.valueChanges
        .pipe(
          startWith(''),
          map(val => this.timezonefilter(val))
        );
    })
  }

  timezonefilter(val: string) {
    return this.timezones.filter(option =>
      option.TimeZoneID.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }



  onSchedueEventChanged(isEnabled: boolean) {

  }

  SetExistingRecurrence() {
    // var FullDateTime = new Date(this.schedule.StartDate);
    // let sttime: any; let sdate:any;
    // sttime = moment(this.schedule.StartDate).format('HH:mm');  //FullDateTime.getTime();
    // sdate = moment(this.schedule.StartDate).format('DD-MM-YYYY'); //FullDateTime.getDate();
    // this.stDate = new Date(this.schedule.StartDate);//new Date(sdate);
    // this.StartTime = sttime;
    this.selectedDateTime = new Date(moment(this.schedule.StartDate).format("YYYY-MM-DD HH:mm"));
    this.stDate = new Date(moment(this.schedule.StDate).format("MM-DD-YYYY"));
    this.StTime = this.schedule.StTime;
    if(this.schedule.EndDate){
      this.SchEndDate = new Date(moment(this.schedule.EndDate).format("MM-DD-YYYY"));
      this.isEndDate = true;
    }
   
    if (this.schedule.RecurrencePattern == 1) {
      this.Frequency = this.schedule.DailyRecurrencePattern.Occurence;
      this.schedule.RecurrencePattern = 1;
    }
    else if (this.schedule.RecurrencePattern == 2) {
      this.Frequency = this.schedule.WeeklyRecurrencePattern.Occurence;
      this.schedule.RecurrencePattern = 2;
      let dayitem = this.dayslist.findIndex(x => x.id == this.schedule.WeeklyRecurrencePattern.WeekDays);
      this.dayslist[dayitem].isSelected = true;
      this.Weekdays = this.dayslist[dayitem].id;

    }
    else if (this.schedule.RecurrencePattern == 3) {
      this.schedule.RecurrencePattern = 3;
      this.Frequency = this.schedule.MonthlyRecurrencePattern.Occurence;
      this.selectedDay = this.schedule.MonthlyRecurrencePattern.Day;
    }

    if(this.schedule.EndDate!=null){
      this.EndType='EndsAt';
    }
    else{
      this.EndType='Never';
    }

    if (this.schedule.Emailrecepients != null && this.schedule.Emailrecepients.length > 0) {
      var tmpList: string[] = [];
      this.schedule.Emailrecepients.forEach(element => {
        var existingUser = this.benchSubUsers.find(x => x.PrimaryEmail == element);
        if (existingUser != null) {
          const newassing = new assign();
          newassing.name = existingUser.FullName;  //event.option.viewValue;
          newassing.value = existingUser.UserId;  //event.option.value;
          newassing.email = existingUser.PrimaryEmail;  //this.assignees.find(x=>x.value==event.option.value).email;
          this.SelectedAssigness.push(newassing);
        }
        else {
          tmpList.push(element)
        }
      });
      if (tmpList.length > 0) {
        this.customrecepients = tmpList.join(",")
      }
    }

  }

  PrepareRecurrence() {
    this.Emailrecepients = [];
    if (this.schedule.RecurrencePattern == 1) {
      this.schedule.DailyRecurrencePattern = new DailyRecurrencePattern();
      this.schedule.DailyRecurrencePattern.Occurence = this.Frequency;
      this.schedule.DailyRecurrencePattern.OccurenceType = 1;
      this.schedule.WeeklyRecurrencePattern = null;
      this.schedule.MonthlyRecurrencePattern = null;
    }
    else if (this.schedule.RecurrencePattern == 2) {
      this.schedule.WeeklyRecurrencePattern = new WeeklyRecurrencePattern();
      this.schedule.WeeklyRecurrencePattern.Occurence = this.Frequency;
      this.schedule.WeeklyRecurrencePattern.WeekDays = this.Weekdays;
      this.schedule.DailyRecurrencePattern = null;
      this.schedule.MonthlyRecurrencePattern = null;
    }
    else if (this.schedule.RecurrencePattern == 3) {
      this.schedule.MonthlyRecurrencePattern = new MonthlyRecurrencePattern();
      this.schedule.DailyRecurrencePattern = null;
      this.schedule.WeeklyRecurrencePattern = null;
      this.schedule.MonthlyRecurrencePattern.OccurenceType = 1;
      this.schedule.MonthlyRecurrencePattern.Occurence =this.Frequency;
      this.schedule.MonthlyRecurrencePattern.Day = this.selectedDay;
    }

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

    this.schedule.Emailrecepients = this.Emailrecepients;
    this.schedule.UpdatorID = this.loginUser.UserId;
    this.schedule.RangePattern = this.isEndDate == true ? 3 : 1;
    this.schedule.ReportId = this.def_report.reportId;
    
     let sdate:any;
     sdate = moment(this.stDate).format('MM-DD-YYYY');
     this.schedule.StDate = sdate;

     //let stime: any; 
     //stime = moment(this.StTime).format('hh:mm A'); 
     this.schedule.StTime = this.StTime; 

     if(this.schedule.StDate && this.schedule.StTime){
      this.selectedDateTime = moment(this.schedule.StDate + " " + this.schedule.StTime);
      let formattedDate: any = moment(this.selectedDateTime).format("YYYY-MM-DDTHH:mm:ss.ms");
      if (formattedDate != "Invalid date")
      this.schedule.StartDate = formattedDate;
     }

  
     if(this.SchEndDate){
      let senddate:any;
      senddate = moment(this.SchEndDate).format('YYYY-MM-DDTHH:mm:ss.ms');
      this.schedule.EndDate = senddate;
     }
     
    // var MomentTime:any= moment(sdate + ' ' + sttime,"DD-MM-YYYY HH:mm");
    // let FormattedTime:any=  MomentTime.format("YYYY-MM-DDTHH:mm:ss.ms");//moment(sdate + ' ' + sttime).format("YYYY-MM-DDTHH:mm:ss.ms");
    // this.schedule.StartDate = FormattedTime;

  }

  SaveRecurrence() {debugger;

    if ((this.SelectedAssigness && this.SelectedAssigness.length == 0) && (this.customrecepients==null)) {
      this._alertService.error("Please enter the email recipients");
      return;
    }

    this.PrepareRecurrence();

    this.reportsService.SaveRecurrence(this.schedule).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success("Schedule Configuration Created Sucessfully");
        this.dialogRef.close(true);
      }
      else {
        this._alertService.error("Internal server error.");
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  assigneesremove(assigneeitem: any): void {
    const index = this.SelectedAssigness.indexOf(assigneeitem);
    if (index >= 0) {
      this.SelectedAssigness.splice(index, 1);
    }
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.reportsService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail });
            });
        },
        error => {
          this._alertService.error(error);
        });
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

  radioChange($event: MatRadioChange) {
    if ($event.value == 'EndsAt') {
      this.isEndDate = true;
      this.schFormGroup.controls["EndDate"].setValidators(Validators.required);
      this.schFormGroup.controls["EndDate"].updateValueAndValidity();
    }
    else {
      this.isEndDate = false;
      this.schFormGroup.controls["EndDate"].clearValidators();
      this.schFormGroup.controls["EndDate"].updateValueAndValidity();
    }
  }

  OnWeekChange(value) {
    this.selection = value;
    this.dayslist[value].isSelected = true;
    this.Weekdays = this.dayslist[value].id;
    //this.schedule.WeeklyRecurrencePattern.WeekDays = 
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.schFormGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.log(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

  private _Assignfilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.assignees.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }
}


export class assign {
  value: string;
  name: string;
  email: string;
  constructor() {
    this.value = null;
    this.name = null;
    this.email = null;
  }
}
