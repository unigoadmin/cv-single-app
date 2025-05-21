import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDocuments } from '../../core/models/employeedocuments';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { PlacementService } from '../../core/http/placement.service';
import { FileStoreService } from 'src/@shared/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { TimesheetTemp } from '../../core/models/TimesheetTemp';
import { TimesheetDocuments } from '../../core/models/timesheetuploaddocs';
import { TimesheetDayInfo } from '../../core/models/timesheetdayinfo';
import { ValidationService } from 'src/@cv/services/validation.service';
import { timesheet } from '../../core/models/timesheet';
import { TimesheetDayDetails } from '../../core/models/timesheetdaydetails';
import { TimeSheetSearch } from '../../core/models/timesheetsearch';
import { LoginUser } from 'src/@shared/models';
import moment from 'moment';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { TimesheetDocViewerComponent } from '../timesheet-doc-viewer/timesheet-doc-viewer.component';
import { TimesheetTaskDetails } from '../../core/models/timesheettask';
import { TimesheetAddTaskComponent } from '../timesheet-add-task/timesheet-add-task.component';
import { TimesheetService } from '../../core/http/timesheet.service';
import { TimesheetMasterNotes } from '../../core/models/timesheetnotes';
import * as FileSaver from 'file-saver';
import { IconService } from 'src/@shared/services/icon.service';
import { TimesheetStatusEnum } from '../../core/models/timesheetsEnum';
import { TimesheetNotesComponent } from '../timesheet-notes/timesheet-notes.component';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { TimesheetPrintInfo } from '../../core/models/teimsheetPrintinfo';

@Component({
  selector: 'cv-manager-view',
  templateUrl: './manager-view.component.html',
  styleUrls: ['./manager-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AuthenticationService, PlacementService, FileStoreService]
})
export class ManagerViewComponent implements OnInit {

  timeSheetEnumStatus = TimesheetStatusEnum;
  empdisplayedColumns: string[] = ['position', 'name', 'actions'];
  xpandStatus = true;
  loginUser: LoginUser;
  RejectNotes: any;
  isEditAccess: boolean;
  isRejectAccess: boolean;
  isApproveAccess: boolean;
  public timesheetId: number = 0;
  public timesheet: timesheet = new timesheet();
  public selectedTimeSheetEachDay: TimesheetDayDetails = new TimesheetDayDetails();
  public timeSheetSearch: TimeSheetSearch = new TimeSheetSearch();
  public timeSheetSearchData: TimeSheetSearch = new TimeSheetSearch();
  public timesheetnotes: TimesheetMasterNotes;
  public employeeDocuments: EmployeeDocuments[] = [];

  public timesheetForm: any;
  timesheetTempList: TimesheetTemp[];
  public dayweekNames: string[] = new Array('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
  public daybiweekNames: string[] = new Array('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
  public daybimonthNames: string[] = new Array('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon');

  public timesheetuploaddocs: TimesheetDocuments = new TimesheetDocuments();
  public timesheetuploaddocsArry: TimesheetDocuments[] = [];
  dataSource = new MatTableDataSource(this.timesheetuploaddocsArry);
  public DocumentViewUrl: string;
  public Url: SafeResourceUrl;
  public DocName: string;
  @ViewChild('deleteTshPop') deleteTshPop: ElementRef;
  @ViewChild('saveModal') saveBtn: ElementRef;
  @ViewChild('myDialog') _matDialogRef: MatDialogRef<MatDialog>;
  public IsOverTimeTask: boolean;
  public checkForApproval: boolean = false;
  //TimesheetSettings
  public isDescriptionRequired: boolean = false;
  public isTaskDescriptionRequired: boolean = false;
  public MinTaskDescription: number = 0;
  public MaxTaskDescription: number = 4000;
  public MaxStdTime: number = 9;
  public FileName: string;
  public isDocumentRequired: boolean = false;
  public currentDate: any;
  public disableDates: any[];
  public disable: boolean = true;
  settings: any;
  selectedTsDate = new FormControl(new Date());
  public timesheetType: number = 0;
  public timesheetDayInfo: TimesheetDayInfo = new TimesheetDayInfo();
  public timesheetPrintInfo : TimesheetPrintInfo = new TimesheetPrintInfo();
  public isempdocloading: boolean = false;
  public DownloadableFileName: string;
  public overTime: boolean = false;
  public checkoverTime: boolean = false;
  public selectedTimesheetUploadDoc: TimesheetDocuments = new TimesheetDocuments();
  public typeTimesheet: string = "";
  public employeeType: string = "";
  public MinChar: number = 0;
  public enableCOntrolId: number = 1;
  public enableCOntrol: boolean = false;
  descFormgroup: FormGroup;
  loading: boolean = false;
  editableStatuses = [
    this.timeSheetEnumStatus.Pending,
    this.timeSheetEnumStatus.Approved,
    this.timeSheetEnumStatus.Rejected,
    this.timeSheetEnumStatus.Draft
  ];
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<ManagerViewComponent>,
    private dialogR: MatDialogRef<MatDialog>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private fileStoreService: FileStoreService,
    private _sanitizer: DomSanitizer,
    private timeseheetService: TimesheetService,
    public iconService: IconService,
    private http: HttpClient
  ) {
    this.disableDates = [];

    this.MinChar = Number(localStorage.getItem("minChar"));
    this.timesheetForm = this.fb.group({
      'STDHRS0': [{ value: '', disable: true }, [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS1': [{ value: '', disable: true }, [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS2': [{ value: '', disable: true }, [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS3': ['', [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS4': ['', [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS5': ['', [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS6': ['', [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'OTHRS0': ['', [Validators.maxLength(5)]],
      'OTHRS1': ['', [Validators.maxLength(5)]],
      'OTHRS2': ['', [Validators.maxLength(5)]],
      'OTHRS3': ['', [Validators.maxLength(5)]],
      'OTHRS4': ['', [Validators.maxLength(5)]],
      'OTHRS5': ['', [Validators.maxLength(5)]],
      'OTHRS6': ['', [Validators.maxLength(5)]],
      'TOTAL0': ['', ValidationService.TotalHoursValidator],
      'TOTAL1': ['', ValidationService.TotalHoursValidator],
      'TOTAL2': ['', ValidationService.TotalHoursValidator],
      'TOTAL3': ['', ValidationService.TotalHoursValidator],
      'TOTAL4': ['', ValidationService.TotalHoursValidator],
      'TOTAL5': ['', ValidationService.TotalHoursValidator],
      'TOTAL6': ['', ValidationService.TotalHoursValidator],
    });
    this.descFormgroup = this.fb.group({
      'upload-file-preview': [''],
      'input-file-preview': [''],
      'TimesheetDescription': ['', [Validators.compose([
        this.conditionalRequired(this.isDescriptionRequired)]), Validators.minLength(this.MinChar)]]
    })
    this.settings = {
      bigBanner: false,
      timePicker: false,
      format: 'MM/dd/yyyy',
      defaultOpen: false,
      closeOnSelect: true
    };
    this.selectedTimeSheetEachDay.TimesheetTaskDetails = [];
    this.timesheetDayInfo.timesheetDays = [];
    this.timesheetnotes = new TimesheetMasterNotes();
  }
  conditionalRequired(isRequired: boolean) {
    return (control: FormControl): { [s: string]: boolean } => {
      let required: boolean = true;
      if (isRequired === false) {
        required = false;
      }

      if (required && !control.value) {
        return { required: true };
      }
    }
  }
  panelOpenState = false;
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {

      this.timesheetId = this.Data;
      this.onGetTimesheetSettings(this.loginUser.Company.Id);
      this.GetTimesheetDayDetails();
    }
    if (this.enableCOntrolId == 1) {
      this.enableCOntrol = false;
    }
    else if (this.enableCOntrolId == 2) {
      this.enableCOntrol = true;
    }
    else {
      this.enableCOntrol = false;
    }
  }
  GetTimesheetDayDetails() {
    this._service.GetTimesheetDayDetails(this.timesheetId, this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.timesheetDayInfo = response.Data;
        this.LoadPermissions();
        if (this.timesheetDayInfo.timesheetDays.length > 0) {
          let len = this.timesheetDayInfo.timesheetDays.length;
          if (len === 7) {
            this.typeTimesheet = "Weekly";
          } else if (len === 14) {
            this.typeTimesheet = "Bi-Weekly";
          } else if (len === 15) {
            this.typeTimesheet = "Bi-Monthly";
          } else if (len === 30 || len === 31) {
            this.typeTimesheet = "Monthly";
          }
          this.timesheetDayInfo.timesheetDays.forEach(element => {
            if (new Date(element.TimesheetDay) > new Date()) {
              element.IsDisable = true;

            }
            element.DayName = moment(element.TimesheetDay).format("ddd");
            if (element.DayName === "Fri" && element.IsDisable) {
              this.checkForApproval = true;
            }
          });
        }
        if (this.timesheetDayInfo.TimesheetDocuments.length > 0) {
          this.timesheetuploaddocsArry = this.DeepCopyForObject(this.timesheetDayInfo.TimesheetDocuments);
        } else {
          this.timesheetuploaddocsArry = [];
        }
        this.dataSource = new MatTableDataSource(this.timesheetuploaddocsArry);
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  onGetTimesheetSettings(companyId: number) {
    this._service.GetTimesheetConfiguration(companyId)
      .subscribe(
        timesheetSettingResponse => {
          if (timesheetSettingResponse) {
            if (timesheetSettingResponse.Data.DescriptionValidation == 1)
              this.isDescriptionRequired = true;
            else
              this.isDescriptionRequired = false;
            if (timesheetSettingResponse.Data.TaskDescriptionValidation == 1)
              this.isTaskDescriptionRequired = true;
            else
              this.isTaskDescriptionRequired = true;
            if (timesheetSettingResponse.Data.DocumentValidation == 1)
              this.isDocumentRequired = true;
            else
              this.isDocumentRequired = false;

            this.MinTaskDescription = timesheetSettingResponse.Data.MinWeeklyDescription;
            this.MaxTaskDescription = timesheetSettingResponse.Data.MaxWeeklyDescription;
            this.MaxStdTime = timesheetSettingResponse.Data.StandardHoursMax;
            this.timesheetType = timesheetSettingResponse.Data.TimesheetType;
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }
  calculateSum(timesheetEachDay: TimesheetDayDetails): void {
    if (timesheetEachDay.StdHours > this.MaxStdTime) {
      this._alertService.error("Standard Hours Cannot be greater than " + this.MaxStdTime);
    }
    timesheetEachDay.TotalHours = Number(timesheetEachDay.StdHours.toFixed(2)) + Number(timesheetEachDay.OTHours.toFixed(2));
    timesheetEachDay.TotalHours = Number(timesheetEachDay.TotalHours.toFixed(2));
    this.timesheetDayInfo.StdHours = Number(this.timesheetDayInfo.timesheetDays.reduce((st, b) => Number(st) + Number(b.StdHours.toFixed(2)), 0))
    this.timesheetDayInfo.StdHours = Number(this.timesheetDayInfo.StdHours.toFixed(2));
    this.timesheetDayInfo.OTHours = Number(this.timesheetDayInfo.timesheetDays.reduce((ot, b) => Number(ot) + Number(b.OTHours.toFixed(2)), 0));
    this.timesheetDayInfo.OTHours = Number(this.timesheetDayInfo.OTHours.toFixed(2));
    this.timesheetDayInfo.TotalStdOTHours = Number(this.timesheetDayInfo.timesheetDays.reduce((tot, b) => Number(tot) + Number(b.TotalHours.toFixed(2)), 0));
    this.timesheetDayInfo.TotalStdOTHours = Number(this.timesheetDayInfo.TotalStdOTHours.toFixed(2))
    if (timesheetEachDay.TotalHours > 24)
      this._alertService.error("Total Hours Cannot be greater than 24 hours");

  }
  onTaskView(timesheeteachday: TimesheetDayDetails, isOverTime: boolean) {
    this.selectedTimeSheetEachDay = new TimesheetDayDetails();
    this.overTime = isOverTime;
    this.selectedTimeSheetEachDay = timesheeteachday;
    this.IsOverTimeTask = isOverTime;
    let timesheetTaskList: TimesheetTaskDetails[] = [];
    timesheetTaskList = this.selectedTimeSheetEachDay.TimesheetTaskDetails;
    if (isNullOrUndefined(timesheetTaskList)) {
      timesheetTaskList = []
    }
    if (timesheetTaskList.length > 0) {
      timesheetTaskList = timesheetTaskList.filter(task => task.IsOverTime == isOverTime)
    }
    if (timesheetTaskList.length == 0 && !this.enableCOntrol) {
      this.addTask();
    }
    this.dialog.open(TimesheetAddTaskComponent,
      { width: '60%', panelClass: "dialog-class", data: { task: this.selectedTimeSheetEachDay, time: this.IsOverTimeTask, pageMode: "view" } }
    ).afterClosed().subscribe((task) => {
      if (task) {
        this.selectedTimeSheetEachDay = task;
        this.checkoverTime = false;
        if (!this.overTime) {
          let selectedhrs = this.selectedTimeSheetEachDay.TimesheetTaskDetails.filter(x => x.IsOverTime !== true);
          let hrs = 0;
          if (selectedhrs.length > 0) {
            hrs = selectedhrs.reduce((h, b) => Number(h) + Number(b.TaskHours), 0);
          }
          if (hrs > this.MaxStdTime) {
            this._alertService.error("do not exceed max standard hours i.e " + this.MaxStdTime);
            return;
          }
        }
        if (!this.IsOverTimeTask)
          this.selectedTimeSheetEachDay.StdHours = 0;
        else
          this.selectedTimeSheetEachDay.OTHours = 0;

        let stdTemp = 0;
        let OTTemp = 0;
        this.selectedTimeSheetEachDay.TimesheetTaskDetails.forEach(element => {
          if (element.TimesheetTaskID == -1 && element.Task && element.Task.trim() != '') {
            element.TimesheetTaskID = 0;
          }
          if (element.TimesheetTaskID != -1) {
            if (!element.IsOverTime) {
              stdTemp = stdTemp + element.TaskHours;
            }
            else {
              OTTemp = OTTemp + element.TaskHours;
            }
          }

        });
        if (stdTemp != 0)
          this.selectedTimeSheetEachDay.StdHours = stdTemp;
        if (OTTemp != 0)
          this.selectedTimeSheetEachDay.OTHours = OTTemp;
        this.selectedTimeSheetEachDay.TimesheetTaskDetails = this.selectedTimeSheetEachDay.TimesheetTaskDetails.filter(task => task.TimesheetTaskID != -1);
        const i = this.timesheetDayInfo.timesheetDays.findIndex(x => x.TimesheetDayID == this.selectedTimeSheetEachDay.TimesheetDayID);
        if (i > -1) {
          this.timesheetDayInfo.timesheetDays[i] = this.selectedTimeSheetEachDay;
        }
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    });
  }
  addTask(): void {
    if (isNullOrUndefined(this.selectedTimeSheetEachDay.TimesheetTaskDetails)) {
      this.selectedTimeSheetEachDay.TimesheetTaskDetails = []
    }
    let timesheettask = {
      TimesheetTaskID: -1,
      TimesheetDayID: this.selectedTimeSheetEachDay.TimesheetDayID,
      Task: null,
      TaskHours: 0,
      IsOverTime: this.IsOverTimeTask,
      CreatedDate: new Date(),
      UpdatedDate: null
    }
    this.selectedTimeSheetEachDay.TimesheetTaskDetails.push(timesheettask);
  }
  GetTimesheetDocId(doc) {

    this.Url = null;
    this.DocumentViewUrl = doc.DocumentInnerPath + '/' + doc.Download_Path_Key;
    this.Url = this._sanitizer.bypassSecurityTrustResourceUrl(this.DocumentViewUrl);
    this.dialog.open(TimesheetDocViewerComponent,
      { width: '90vw', height: '90vh', panelClass: "dialog-class", data: { Url: this.Url, Name: "Document View" } }
    ).afterClosed().subscribe((confirmation) => {

    });
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  DownloadTimesheetDoc(doc) {
    if (doc.Download_Path_Key) {
      let docurl = doc.DocumentInnerPath + '/' + doc.Download_Path_Key;
      this._service.DownloadTimeSheetDOC(doc.Download_Path_Key, doc.Download_Path_Type, this.loginUser.Company.Id)
        .subscribe(response => {
          debugger;
          let filename = doc.DownloadableFileName;
          FileSaver.saveAs(response, filename);
        }),
        error => {
          this._alertService.error("Error while downloading the file.");
        }
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }

  }
  keyPress(event: any) {
    if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 0) {
    }
    else {
      event.preventDefault();
    }
  }
  valuechange(task) {
    if (task == '' && !task) {
      this._alertService.error('Please Enter The Task Description');
    }
  }
  isAnchor(str) {

    if (String(str).match(/&lt;a.*\&gt;.*\&lt;\/a\&gt;/)) {
      return true;
    }
    else if (String(str).match(/<a.*\>.*\<\/a\>/))
      return true;
    else
      return false;

  }
  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  onSubmittedTimeSheet(status: number) {
    const approvetimesheet = {
      TimesheetID: this.timesheetId,
      Status: status,
      ApprovedBy: this.loginUser.UserId,
      UpdatedDate: new Date(),
      CompanyId: this.loginUser.Company.Id
    };
    this.UpdateTimesheet(approvetimesheet);
  }

  UpdateTimesheet(approvetimesheet: any) {
    this.timeseheetService.UpdateTimesheetStatus(approvetimesheet).subscribe(response => {
      if (response.IsError == false) {
        this._alertService.success("Timesheet status updated successfully");
        this.dialogRef.close(true);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  openDialogWithTemplateRef(row: TimesheetDayInfo) {
    if (!row || !row.timesheetDays || row.timesheetDays.length === 0) {
      console.error("Invalid row data");
      return;
    }

    const startDate = row.timesheetDays[0]?.TimesheetDay ?
      new Date(row.timesheetDays[0].TimesheetDay).toLocaleDateString('en-US') : 'N/A';

    const endDate = row.timesheetDays[row.timesheetDays.length - 1]?.TimesheetDay ?
      new Date(row.timesheetDays[row.timesheetDays.length - 1].TimesheetDay).toLocaleDateString('en-US') : 'N/A';

    const employeeName = row?.Assignment?.EmployeeMaster?.FirstName && row?.Assignment?.EmployeeMaster?.LastName
      ? `${row.Assignment.EmployeeMaster.FirstName} ${row.Assignment.EmployeeMaster.LastName}`
      : 'Unknown Employee';

    const message = `Timesheet for Period ${startDate} - ${endDate} of Employee ${employeeName} will be rejected.`;

    const dialogData = new ConfirmDialogModel("Reject Timesheet!", message);

    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult?.Dialogaction) {
        this.RejectTimesheet(row, dialogResult.Notes);
      }
    });
  }

  RejectTimesheet(row: TimesheetDayInfo, Rejectnotes: string) {
    if (Rejectnotes !== "" && !isNullOrUndefined(Rejectnotes)) {
      const approvetimesheet = {
        TimesheetID: row.TimesheetID,
        Status: 3,
        ApprovedBy: this.loginUser.UserId,
        UpdatedDate: new Date(),
        CompanyId: this.loginUser.Company.Id,
        Comments: Rejectnotes
      };
      this.timeseheetService.UpdateTimesheetStatus(approvetimesheet).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success("Timesheet Rejected Successfully");
          this.dialogRef.close(true);
        }
      }, error => {
        this._alertService.error(error);
      })
    }
    else {
      this._alertService.error("Please provide a Reason for Rejection");
    }

  }


  LoadPermissions() {
    debugger;
    let perm = [];
    let WCModule = this.loginUser.ModulesList.find(i => i.ModuleId == "D1F78D81-5F25-4F43-BF71-86BE16823816");
    if (WCModule) {
      debugger;
      perm = WCModule.RoleAssociatedActions?.split(',');
      if (perm.some(x => x === "SUB_ACTION_MANAGER_TIMESHEET_EDIT_ALL") == true) {
        this.isEditAccess = true;
      }
      else if (perm.some(x => x === "SUB_ACTION_MANAGER_TIMESHEET_EDIT_REPORTEES") == true) {
        if (this.loginUser.UserId == this.timesheetDayInfo.Assignment.EmployeeMaster.HRManager ||
          this.timesheetDayInfo.Assignment.EmployeeMaster.FinanceManager ||
          this.timesheetDayInfo.Assignment.EmployeeMaster.TrainingManager) {
          this.isEditAccess = true;
        }
      }
      //For Approve Access
      if (perm.some(x => x === "SUB_ACTION_MANAGER_TIMESHEET_APPROVE_ALL") == true) {
        this.isApproveAccess = true;
      }
      else if (perm.some(x => x === "SUB_ACTION_MANAGER_TIMESHEET_APPROVE_REPORTEES") == true) {
        if (this.loginUser.UserId == this.timesheetDayInfo.Assignment.EmployeeMaster.HRManager ||
          this.timesheetDayInfo.Assignment.EmployeeMaster.FinanceManager ||
          this.timesheetDayInfo.Assignment.EmployeeMaster.TrainingManager) {
          this.isApproveAccess = true;
        }
      }
      //For Reject Access
      if (perm.some(x => x === "SUB_ACTION_MANAGER_TIMESHEET_REJECT_ALL") == true) {
        this.isRejectAccess = true;
      }
      else if (perm.some(x => x === "SUB_ACTION_MANAGER_TIMESHEET_REJECT_REPORTEES") == true) {
        if (this.loginUser.UserId == this.timesheetDayInfo.Assignment.EmployeeMaster.HRManager ||
          this.timesheetDayInfo.Assignment.EmployeeMaster.FinanceManager ||
          this.timesheetDayInfo.Assignment.EmployeeMaster.TrainingManager) {
          this.isRejectAccess = true;
        }
      }

    }

  }

  cancel() {
    this.dialog.closeAll();
  }

  ViewNotes(timesheetDayInfo: TimesheetDayInfo) {
    this.dialog.open(TimesheetNotesComponent, {
      data: timesheetDayInfo, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
        // this.GetAllCompanyInterviews(this.loginUser.Company.Id,this.loginUser.UserId);
      }
    });
  }

  getTimesheetDetailsForPrint(): void { 
    this._service.GetTimesheetPrintDetails(this.timesheetId, this.loginUser.Company.Id)
      .subscribe(response => {debugger;
        if (response.IsError) {
          this._alertService.error(response.ErrorMessage);
        } else {
          this.timesheetPrintInfo = response.Data; 
          this.downloadTimesheet(); 
        }
        
        // Check if change detector is not destroyed.
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }, error => {
        this._alertService.error(error);
      });
  }
  

  downloadTimesheet() {debugger;
   
    if (!this.timesheetPrintInfo) {
      console.error("Timesheet data is not available.");
      return;
    }

    // Create Date objects from the start and end dates (if needed)
    const startDate = new Date(this.timesheetPrintInfo.StartDate);
    const endDate = new Date(this.timesheetPrintInfo.EndDate);

    // Format the dates as yyyy-MM-dd. One quick way is using toISOString()
    const formattedStartDate = startDate.toISOString().substring(0, 10);
    const formattedEndDate = endDate.toISOString().substring(0, 10);

    // Load the physical HTML template file from assets
    this.http.get('assets/timesheet-template.html', { responseType: 'text' })
      .subscribe(template => {
        // Replace placeholder tokens with your timesheet data.
        let htmlContent = template;
        htmlContent = htmlContent.replace('{{EmployeeName}}',
          `${this.timesheetPrintInfo.WorkerLastName}, ${this.timesheetPrintInfo.WorkerFirstName}`);
        htmlContent = htmlContent.replace('{{TimesheetId}}', this.timesheetPrintInfo.CompanyTimesheetID.toString());
        htmlContent = htmlContent.replace('{{AssignmentName}}', this.timesheetPrintInfo.AssignmentName);
        htmlContent = htmlContent.replace('{{StartDate}}', new Date(this.timesheetPrintInfo.StartDate).toLocaleDateString());
        htmlContent = htmlContent.replace('{{EndDate}}', new Date(this.timesheetPrintInfo.EndDate).toLocaleDateString());
        htmlContent = htmlContent.replace('{{Description}}', this.timesheetPrintInfo.Description);
        htmlContent = htmlContent.replace('{{CompanyName}}', this.loginUser.Company.Name);
        htmlContent = htmlContent.replace('{{StatusName}}', this.timesheetPrintInfo.StatusName);
        // Build table rows for timesheet days.
        let daysHtml = '';debugger;
        if (this.timesheetPrintInfo.TimesheetDay_Prints && this.timesheetPrintInfo.TimesheetDay_Prints.length) {
          this.timesheetPrintInfo.TimesheetDay_Prints.forEach((day: any) => {
            daysHtml += `<tr>
                          <td>${new Date(day.TimesheetDay).toLocaleDateString()}</td>
                          <td>${day.StdHours || ''}</td>
                          <td>${day.OTHours || ''}</td>
                          <td>${day.Description || ''}</td>
                        </tr>`;
          });
        }
        htmlContent = htmlContent.replace('{{TimesheetDays}}', daysHtml);

        // Build table rows for attachments.
        let attachmentsHtml = '';
        if (this.timesheetPrintInfo.TimesheetDocuments_Prints && this.timesheetPrintInfo.TimesheetDocuments_Prints.length) {
          this.timesheetPrintInfo.TimesheetDocuments_Prints.forEach((doc: any) => {
            attachmentsHtml += `<tr>
                                  <td>${doc.DownloadableFileName || ''}</td>
                                  <td>${doc.Download_Path_Type || ''}</td>
                                </tr>`;
          });
        }
        htmlContent = htmlContent.replace('{{Attachments}}', attachmentsHtml);

        //bind table rows for Notes
        let notesHtml = '';
        if (this.timesheetPrintInfo.TimesheetNotes_Prints && this.timesheetPrintInfo.TimesheetNotes_Prints.length) {
          this.timesheetPrintInfo.TimesheetNotes_Prints.forEach((item: any) => {
            notesHtml += `<tr>
                                  <td>${new Date(item.NotesDate).toLocaleDateString()}</td>
                                  <td>${item.Comment || ''}</td>
                                  <td>${item.CreatedBy || ''}</td>
                                </tr>`;
          });
        }
        htmlContent = htmlContent.replace('{{Notes}}', notesHtml);

        //bind table rows to Activity log
        let activityHtml = '';
        if (this.timesheetPrintInfo.TimesheetActivity_Prints && this.timesheetPrintInfo.TimesheetActivity_Prints.length) {
          this.timesheetPrintInfo.TimesheetActivity_Prints.forEach((item: any) => {
            activityHtml += `<tr>
                                  <td>${new Date(item.ActivityDate).toLocaleDateString()}</td>
                                  <td>${item.Comment || ''}</td>
                                  <td>${item.CreatedBy || ''}</td>
                                </tr>`;
          });
        }
        htmlContent = htmlContent.replace('{{ActivityLog}}', activityHtml);

        //Create a hidden container and inject the HTML.
        const hiddenContainer = document.createElement('div');
        // Position off-screen (not display: none) so html2canvas can render it.
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.top = '-10000px';
        hiddenContainer.style.left = '-10000px';
        hiddenContainer.innerHTML = htmlContent;
        document.body.appendChild(hiddenContainer);

        html2canvas(hiddenContainer).then(canvas => {
          // Convert the rendered canvas to an image data URL
          const imgData = canvas.toDataURL('image/png');
        
          // Create a jsPDF instance for an A4 page in portrait mode
          const pdf = new jsPDF('p', 'mm', 'a4');
        
          // Get PDF page dimensions
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
        
          // Calculate the scaling factor to fit the width of the PDF
          const imgWidth = pageWidth;
          const scaleFactor = canvas.width / imgWidth;
          const imgHeight = canvas.height / scaleFactor;
        
          // Calculate the number of pages needed
          const pagesNeeded = Math.ceil(imgHeight / pageHeight);
        
          // For each page
          for (let page = 0; page < pagesNeeded; page++) {
            // Add new page if it's not the first page
            if (page > 0) {
              pdf.addPage();
            }
        
            // Calculate the height of the remaining content
            const remainingHeight = imgHeight - (page * pageHeight);
            
            // Calculate the position to start capturing the content for this page
            const sourceY = page * pageHeight * scaleFactor;
            
            // Calculate the height to capture for this page
            const captureHeight = Math.min(pageHeight * scaleFactor, remainingHeight * scaleFactor);
            
            // Create a temporary canvas for this page's content
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = captureHeight;
            
            // Draw the portion of the original canvas for this page
            const ctx = pageCanvas.getContext('2d');
            ctx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              captureHeight,
              0,
              0,
              canvas.width,
              captureHeight
            );
        
            // Convert the page canvas to an image
            const pageImgData = pageCanvas.toDataURL('image/png');
        
            // Calculate dimensions for this page
            const pageImgHeight = Math.min(pageHeight, remainingHeight);
        
            // Add the image to the PDF
            pdf.addImage(
              pageImgData,
              'PNG',
              0,
              0,
              pageWidth,
              pageImgHeight
            );
          }
        
          // Build the file name using template literals
          const fileName = `${this.timesheetPrintInfo.WorkerLastName} - ${this.timesheetPrintInfo.CompanyTimesheetID}.pdf`;
        
          // Save the PDF file
          pdf.save(fileName);
        
          // Remove the hidden container from the DOM
          document.body.removeChild(hiddenContainer);
        }).catch(error => {
          console.error('Error generating PDF:', error);
          document.body.removeChild(hiddenContainer);
        });

      }, error => {
        console.error('Error loading HTML template:', error);
      });
  }

}
