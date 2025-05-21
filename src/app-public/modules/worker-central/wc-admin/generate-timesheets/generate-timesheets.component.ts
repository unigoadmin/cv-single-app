import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from 'src/@shared/models';
import icSearch from '@iconify/icons-ic/twotone-search';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { VerifyEmployee } from 'src/@cv/models/verifyemployee';
import { AssignmentMaster, EmployeeMaster } from 'src/@cv/models/processmenu';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TimesheetService } from '../../core/http/timesheet.service';
import { PlacementService } from '../../core/http/placement.service';
import { MatStepper } from '@angular/material/stepper';
import iclocationon from '@iconify/icons-ic/location-on';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import { TimesheetManagerList } from '../../core/models/tsmanagerlist';
import { TimeSheetFilter } from '../../core/models/timesheetfilter';
import { MatPaginator } from '@angular/material/paginator';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';  
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'cv-generate-timesheets',
  templateUrl: './generate-timesheets.component.html',
  styleUrls: ['./generate-timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthenticationService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
    scaleFadeIn400ms
  ],
})
export class GenerateTimesheetsComponent implements OnInit {

  EmployeeControl: FormControl = new FormControl();
  empOptions: Observable<EmployeeMaster[]>;

  empdisplayedColumns: string[] = ['position', 'name', 'type', 'classification', 'startdate', 'enddate', 'Timesheet', 'StatusName'];
  tsdisplayedColumns: string[] = ['TimesheetID', 'TimseheetPeriod', 'StdHours', 'OTHours', 'TotalHours', 'StatusName']
  iclocationon = iclocationon;
  icSearch = icSearch;
  icLayers=icLayers;
  icBack=icBack;
  loginUser: LoginUser;
  searchtext: FormControl = new FormControl('');
  isLoading: boolean = false;
  employeeSearch: string;
  public Employee: EmployeeMaster = new EmployeeMaster();
  verifyEmployee: VerifyEmployee = new VerifyEmployee();
  public employeeAssignment: AssignmentMaster[] = [];
  public Assignment: AssignmentMaster;
  dataSource = new MatTableDataSource(this.employeeAssignment);
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  thirdFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  isLoadpage: boolean = false;
  timesheetList: TimesheetManagerList[] = [];
  timeSheetFilter: TimeSheetFilter = new TimeSheetFilter();
  tsdataSource = new MatTableDataSource<TimesheetManagerList>();
  public EmployeeList: EmployeeMaster[] = [];

  public employeeID: number = 0;
  public EmpCompanyId: string = null;
  public empFirstName: string = null;
  public empLastName: string = null;
  public empEmailID: string = null;
  public EmployeeSearch: string;
  constructor(private fb: FormBuilder,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private timeSheetService: TimesheetService,
    private plcService: PlacementService,
    private _alertService: AlertService,
    private router:Router
    ) {
    this.thirdFormGroup = this.fb.group({
      AssignmentId: [{ value: '', disabled: true }], Name: [null], AssignmentType: [null],
      Classification: [null], asmStartDate: [null],
      asmEndDate: [null], WLAddress2: [null],
      WLState: [null], WLCity: [null], countryName: [null], WLZipCode: [null],
      TimeSheet: [null], RemoteAssignment: [null], AmendmentRequired: [null],
      EmpCompanyId: [{ value: '', disabled: true }], empFirstName: [{ value: '', disabled: true }], empLastName: [{ value: '', disabled: true }]
    });

    this.firstFormGroup = this.fb.group({
      searchtext: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getEmployeeAssign();
    }
    this.Assignment = new AssignmentMaster();
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  getEmployeeAssign() {
    this.plcService.getEmployeeAssign(this.loginUser.Company.Id).subscribe(response => {

      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.EmployeeList = response.Data;
      }
      this.empOptions = this.EmployeeControl.valueChanges.pipe(startWith(''), map(val => this.empfilter(val)));
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }
  empfilter(val: string) {
    if (val && val.length >= 2) {
    return this.EmployeeList.filter(option => option.FirstName.toLowerCase().indexOf(val.toLowerCase()) === 0
      || option.LastName.toLowerCase().indexOf(val.toLowerCase()) === 0 || option.Email.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
  }
  SearchEmployee() {
    this.isLoading = true;
    if (!isNullOrUndefined(this.empEmailID) && this.empEmailID.includes("@") && this.empEmailID.includes(".")) {
      this.verifyEmployee.Email = this.empEmailID;
      this.verifyEmployee.CompanyID = this.loginUser.Company.Id;
      this.plcService.SearchEmployeeByEmail(this.verifyEmployee).subscribe(response => {
        if (response.IsError) {
          this._alertService.error(response.ErrorMessage);
        }
        else if (!response.IsError && response.Data == null) {
          this._alertService.error("Worker is not available with this email.");
          this.isLoading = false;
        }
        else {
          this.Employee = response.Data;
          if (this.Employee.AssignmentMasters.length > 0) {
            this.employeeAssignment = JSON.parse(JSON.stringify(this.Employee.AssignmentMasters));
            this.dataSource = new MatTableDataSource(this.employeeAssignment);
            this.dataSource.sort = this.sort
          } else {
            this.employeeAssignment = [];
          }

          this.isLoading = false;
          this.verifyEmployee = new VerifyEmployee();
          //this.searchtext.reset();
        }
        if (!this.cdr["distroyed"]) {
          this.cdr.detectChanges();
        }
      }, error => {
        this._alertService.error(error);
        if (!this.cdr["distroyed"]) {
          this.cdr.detectChanges();
        }
      });
    }
    else {
      this._alertService.error("Please Enter Valid Email Id");
      this.isLoading = false;
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }
  }

  AssignmentNextClick(stepper: MatStepper, assignmnet) {
    this.searchtext.reset();
    this.Assignment = this.DeepCopyForObject(assignmnet);
    this.GetAllTimeSheet(this.Assignment.AssignmentID);
    stepper.next();
  }
  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  changeendDate(event) {
    this.Assignment.EndDate = event.value;
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  NextClick(stepper: MatStepper) {
    stepper.next();
  }
  ResetClick() {
    this.Employee = new EmployeeMaster();
    this.employeeAssignment = [];
    this.searchtext.reset();
    this.EmployeeControl.reset();
  }

  GetAllTimeSheet(AssignmentId: number) {
    this.isLoadpage = true;
    this.timeSheetFilter.CompanyId = this.loginUser.Company.Id;
    this.timeSheetFilter.EmployeeId = this.Assignment.EmployeeID;
    this.timeSheetFilter.StartDate = null;
    this.timeSheetFilter.EndDate = null;
    this.timeSheetFilter.AssignmentId = AssignmentId;
    this.timeSheetService.GetTimesheetsByAssignment(this.timeSheetFilter).subscribe(response => {
      this.timesheetList = response.Data;
      this.tsdataSource.data = this.timesheetList;
      this.setDataSourceAttributes();
      this.isLoadpage = false;
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }

    }, error => {
      this.isLoadpage = false;
      this._alertService.error(error);
    })
  }

  GenerateTimesheets() {
    this.timeSheetService.GenerateMissingTimesheets(this.loginUser.Company.Id, this.Assignment.AssignmentID).subscribe(res => {
      if (!res.IsError) {
        this._alertService.success(res.SuccessMessage);
        this.GetAllTimeSheet(this.Assignment.AssignmentID);
      }
      else {
        this._alertService.error(res.ErrorMessage);
      }
    })
  }
  onSelectionempChanged(event) {
    this.employeeID = event.option.id;
    this.EmpCompanyId = this.EmployeeList.find(x => x.EmployeeID === event.option.id).ComapnyEmployeeID;
    this.empFirstName = this.EmployeeList.find(x => x.EmployeeID === event.option.id).FirstName;
    this.empLastName = this.EmployeeList.find(x => x.EmployeeID === event.option.id).LastName;
    this.empEmailID = this.EmployeeList.find(x => x.EmployeeID === event.option.id).Email;
    this.SearchEmployee();
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  setDataSourceAttributes() {
    this.tsdataSource.paginator = this.paginator;
    this.tsdataSource.sort = this.sort;
  }
backClick(){
  this.router.navigateByUrl('/worker-central/wc-admin')
}
}
