import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import icSearch from '@iconify/icons-ic/twotone-search';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { ProcessMenuService } from '../../../services/processmenu.service';
import { LoginUser } from 'src/@shared/models';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AssignmentMaster, DBAssignmentMaster, EmployeeMaster } from '../../../models/processmenu';
import iclocationon from '@iconify/icons-ic/location-on';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { VerifyEmployee } from '../../../models/verifyemployee';

@Component({
  selector: 'cv-update-assignment',
  templateUrl: './update-assignment.component.html',
  styleUrls: ['./update-assignment.component.scss'],
  providers: [AuthenticationService, ProcessMenuService],
})
export class UpdateAssignmentComponent implements OnInit {
  empdisplayedColumns: string[] = ['position', 'name', 'type', 'classification', 'startdate', 'enddate'];
  icClose = icClose;
  icSearch = icSearch;
  iclocationon=iclocationon;
  loginUser: LoginUser;
  searchtext: FormControl = new FormControl('');
  public TerminateEmployeeFormGroup: FormGroup;
  public Employee: EmployeeMaster = new EmployeeMaster();
  isLoading: boolean = false;
  public EmployeeList: EmployeeMaster[] = [];
  public employeeAssignment: AssignmentMaster[] = [];
  employeeSearch: string;
  public dbAssignmentMaster: DBAssignmentMaster[] = [];
  thirdFormGroup: FormGroup;
  sort: MatSort;
  public Assignment: AssignmentMaster;
  dataSource = new MatTableDataSource(this.employeeAssignment);
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  verifyEmployee:VerifyEmployee=new VerifyEmployee();
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public EmployeeID: number,
    private dialogRef: MatDialogRef<UpdateAssignmentComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private _service: ProcessMenuService,
    private _alertService: AlertService,
  ) {
    this.Employee.WorkStatusExpiry = null;
    this.thirdFormGroup = this.fb.group({
      AssignmentId: [{ value: '', disabled: true }], Name: [null], AssignmentType: [null],
      Classification: [null], asmStartDate: [null],
      asmEndDate: [null], WLAddress2: [null],
      WLState: [null], WLCity: [null], countryName: [null], WLZipCode: [null],
      TimeSheet: [null], RemoteAssignment: [null], AmendmentRequired: [null],
      EmpCompanyId: [{ value: '', disabled: true }], empFirstName: [{ value: '', disabled: true }], empLastName: [{ value: '', disabled: true }]
    });
   
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
    }
    this.Assignment= new AssignmentMaster();
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  SearchEmployee() {
    this.isLoading = true;
    if (!isNullOrUndefined(this.employeeSearch) && this.employeeSearch.includes("@") && this.employeeSearch.includes(".")) {
      this.verifyEmployee.Email=this.employeeSearch;
this.verifyEmployee.CompanyID=this.loginUser.Company.Id;
      this._service.SearchEmployeeByEmail(this.verifyEmployee).subscribe(response => {
        if (response.IsError) {
          this._alertService.error(response.ErrorMessage);
        }
        else if(!response.IsError && response.Data==null){
          this._alertService.error("Worker is not available with this email.");
          this.isLoading = false;
        } 
        else {
          this.Employee = response.Data;
          if (this.Employee.AssignmentMasters.length > 0) {
            this.employeeAssignment = JSON.parse(JSON.stringify(this.Employee.AssignmentMasters));
            this.dataSource = new MatTableDataSource(this.employeeAssignment);
            this.dataSource.sort =this.sort
          } else {
            this.employeeAssignment = [];
          }
          
          this.isLoading = false;
          this.verifyEmployee=new VerifyEmployee();
          this.searchtext.reset();
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
    else{
      this._alertService.error("Please Enter Valid Email Id");
      this.isLoading = false;
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }
  }
  AssignmentNextClick(stepper: MatStepper,assignmnet){
    this.searchtext.reset();
    this.Assignment=this.DeepCopyForObject(assignmnet);
    stepper.next();
  }
  NextClick(stepper: MatStepper) {
      stepper.next();
  }
  ResetClick() {
    this.Employee = new EmployeeMaster();
    this.employeeAssignment = [];
    this.searchtext.reset();
  }
  saveAssignment() {
    this.Assignment.UpdatedBy = this.loginUser.UserId;
    this.Assignment.UpdatedDate = new Date();
    if (this.Assignment.StartDate){
      let adtes:any=moment(this.Assignment.StartDate).format("YYYY-MM-DDTHH:mm:ss")
      this.Assignment.StartDate = adtes
    }      
    if (this.Assignment.EndDate){
      let adtese:any=moment(this.Assignment.EndDate).format("YYYY-MM-DDTHH:mm:ss");
      this.Assignment.EndDate = adtese;
    }
    this._service.SaveAssignment(this.Assignment).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this._alertService.success("Assignment updated successfully")
        this.dialogRef.close(true);
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  changestartDate(event) {
    this.Assignment.StartDate = event.value;
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  changeendDate(event) {
    this.Assignment.EndDate = event.value;
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  getAssignAddress(event) {
    let data = event.address_components
    this.Assignment.WLAddress2 = null;
    if (data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          this.Assignment.WLAddress1 = address.long_name;
        } else if (address.types.includes("route")) {
          this.Assignment.WLAddress1 = isNullOrUndefined(this.Assignment.WLAddress1) ? "" : this.Assignment.WLAddress1 + " " + address.long_name;
        } else if (address.types.includes("locality")) {
          this.Assignment.WLCity = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.Assignment.WLState = address.long_name;
        } else if (address.types.includes("country")) {
          this.Assignment.WLCountry = address.long_name;
        } else if (address.types.includes("postal_code")) {
          this.Assignment.WLZipCode = address.long_name;
        }
      }
    }
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  inputAssignEmployeeAddress(event) {
    this.Assignment.WLAddress1 = isNullOrUndefined(event.target.value) ? "" : event.target.value;
  }
  public onInputKeyPress(event): void {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.code !== 'Backspace' && event.code !== 'Tab' &&
      event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

}
