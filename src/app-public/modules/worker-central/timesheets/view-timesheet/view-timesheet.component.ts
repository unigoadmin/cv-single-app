import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
//import icClose from '@iconify/icons-ic/twotone-close';
//import icfileupload from '@iconify/icons-ic/file-upload';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDocuments } from '../../core/models/employeedocuments';
//import icdelete from '@iconify/icons-ic/delete';
//import icAdd from '@iconify/icons-ic/twotone-add';
//import icvieweye from '@iconify/icons-ic/remove-red-eye';
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
import { FileItem, FileUploader } from 'ng2-file-upload';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { TimesheetDocViewerComponent } from '../timesheet-doc-viewer/timesheet-doc-viewer.component';
import { TimesheetTaskDetails } from '../../core/models/timesheettask';
import { TimesheetAddTaskComponent } from '../timesheet-add-task/timesheet-add-task.component';
//import icEdit from '@iconify/icons-ic/twotone-edit';
//import icDelete from '@iconify/icons-ic/twotone-delete';
//import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
//import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import * as FileSaver from 'file-saver';
//import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import { TimesheetStatusEnum } from '../../core/models/timesheetsEnum';
import { IconService } from 'src/@shared/services/icon.service';

@Component({
  selector: 'cv-view-timesheet',
  templateUrl: './view-timesheet.component.html',
  styleUrls: ['./view-timesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AuthenticationService, PlacementService, FileStoreService]
})
export class ViewTimesheetComponent implements OnInit {
  timeSheetEnumStatus = TimesheetStatusEnum;
  empdisplayedColumns: string[] = ['position', 'name', 'actions'];
  //icClose = icClose;
  //icAdd = icAdd;
  //icFileUpload = icfileupload;
  //icdelete = icdelete;
  //icvieweye = icvieweye;
  //icEdit = icEdit;
  //icDelete = icDelete;
  //icMoreVert=icMoreVert;
  //icArrowDropDown=icArrowDropDown;
  //icDownload=icDownload;
  xpandStatus = true;
  loginUser: LoginUser;
  public timesheetId: number = 0;
  public timesheet: timesheet = new timesheet();
  public selectedTimeSheetEachDay: TimesheetDayDetails = new TimesheetDayDetails();
  public timeSheetSearch: TimeSheetSearch = new TimeSheetSearch();
  public timeSheetSearchData: TimeSheetSearch = new TimeSheetSearch();

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
  loading: boolean=false;
  editableStatuses = [
    this.timeSheetEnumStatus.Pending,
    this.timeSheetEnumStatus.Rejected,
    this.timeSheetEnumStatus.Draft
  ];
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<ViewTimesheetComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private fileStoreService: FileStoreService,
    private _sanitizer: DomSanitizer,
    public iconService: IconService,
  ) {
    this.disableDates = [];

    this.MinChar = Number(localStorage.getItem("minChar"));
    this.timesheetForm = this.fb.group({
      'STDHRS0': [{value:'',disable:true}, [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS1': [{value:'',disable:true}, [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
      'STDHRS2': [{value:'',disable:true}, [Validators.maxLength(5), (control: AbstractControl) => Validators.max(this.MaxStdTime)(control)]],
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
    this._service.GetTimesheetDayDetails(this.timesheetId,this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.timesheetDayInfo = response.Data;
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
    this.timesheetDayInfo.StdHours = Number(this.timesheetDayInfo.timesheetDays?.reduce((st, b) => Number(st) + Number(b.StdHours.toFixed(2)), 0))
    this.timesheetDayInfo.StdHours = Number(this.timesheetDayInfo.StdHours.toFixed(2));
    this.timesheetDayInfo.OTHours = Number(this.timesheetDayInfo.timesheetDays?.reduce((ot, b) => Number(ot) + Number(b.OTHours.toFixed(2)), 0));
    this.timesheetDayInfo.OTHours = Number(this.timesheetDayInfo.OTHours.toFixed(2));
    this.timesheetDayInfo.TotalStdOTHours = Number(this.timesheetDayInfo.timesheetDays?.reduce((tot, b) => Number(tot) + Number(b.TotalHours.toFixed(2)), 0));
    this.timesheetDayInfo.TotalStdOTHours = Number(this.timesheetDayInfo.TotalStdOTHours.toFixed(2))
    if (timesheetEachDay.TotalHours > 24)
      this._alertService.error("Total Hours Cannot be greater than 24 hours");

  }
  onTaskView(timesheeteachday: TimesheetDayDetails, isOverTime: boolean) {
    this.selectedTimeSheetEachDay=new TimesheetDayDetails();
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
      { width: '60%', panelClass: "dialog-class", data: {task:this.selectedTimeSheetEachDay,time:this.IsOverTimeTask,pageMode:"view"} }
    ).afterClosed().subscribe((task) => {
      if (task) {
        this.selectedTimeSheetEachDay=task;
          this.checkoverTime=false;
          if (!this.overTime) {
            let selectedhrs = this.selectedTimeSheetEachDay.TimesheetTaskDetails.filter(x => x.IsOverTime !== true);
            let hrs = 0;
            if (selectedhrs.length > 0) {
              hrs = selectedhrs?.reduce((h, b) => Number(h) + Number(b.TaskHours), 0);
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
          const i= this.timesheetDayInfo.timesheetDays.findIndex(x=>x.TimesheetDayID==this.selectedTimeSheetEachDay.TimesheetDayID);
          if(i>-1){
            this.timesheetDayInfo.timesheetDays[i]=this.selectedTimeSheetEachDay;
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
      { width: '60%', panelClass: "dialog-class", data: { Url: this.Url, Name: "Document View" } }
    ).afterClosed().subscribe((confirmation) => {

    });
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
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

}
