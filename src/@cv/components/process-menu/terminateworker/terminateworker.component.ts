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
import { VerifyEmployee } from '../../../models/verifyemployee';
import { NUMBER_MODE } from 'highlight.js';

@Component({
  selector: 'cv-terminateworker',
  templateUrl: './terminateworker.component.html',
  styleUrls: ['./terminateworker.component.scss'],
  providers: [AuthenticationService, ProcessMenuService]
})
export class TerminateworkerComponent implements OnInit {
  icClose = icClose;
  icSearch = icSearch;
  loginUser: LoginUser;
  searchtext: FormControl = new FormControl('');
  public TerminateEmployeeFormGroup: FormGroup;
  public Employee: EmployeeMaster = new EmployeeMaster();
  isLoading: boolean = false;
  public EmployeeList: EmployeeMaster[] = [];
  public employeeAssignment: AssignmentMaster[] = [];
  employeeSearch: string;
  public dbAssignmentMaster: DBAssignmentMaster[] = [];
  verifyEmployee:VerifyEmployee=new VerifyEmployee();
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public EmployeeID: number,
    private dialogRef: MatDialogRef<TerminateworkerComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private _service: ProcessMenuService,
    private _alertService: AlertService,
  ) {
    this.Employee.WorkStatusExpiry = null;
    this.TerminateEmployeeFormGroup = this.fb.group({
      terminationreason: ['', [Validators.required]],
      laptopreturned: [''],
      eligibleforRehire: [''],
      TerminationDate: ['', [Validators.required]],
      LastWorkingDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
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
        else  {
          this.Employee = response.Data;
          if (this.Employee.AssignmentMasters.length > 0) {
            this.employeeAssignment = JSON.parse(JSON.stringify(this.Employee.AssignmentMasters));

            this.employeeAssignment.forEach(x => {
              if (x.Status === 1)
                x.EndDate = null;
            })
          } else {
            this.employeeAssignment = [];
          }
          
          this.isLoading = false;
          //this.employeeSearch = null;
          this.searchtext.reset();
          this.verifyEmployee=new VerifyEmployee();
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
  NextClick(stepper: MatStepper) {
    if (this.employeeAssignment.length > 0) {
      const check = this.CheckAssignmentValidation(this.employeeAssignment);
      if (check) {
        this.isLoading = false;
        this._alertService.error("Please enter assignment end date");
        return;
      } else {
        stepper.next();
      }
    } else {
      stepper.next();
    }
  }
  ResetClick() {
    this.Employee = new EmployeeMaster();
    this.employeeAssignment = [];
    this.searchtext.reset();
  }
  terminateEmployee() {
    this.isLoading = true;
    if (!isNullOrUndefined(this.Employee.TerminationDate)) {
      let TermDate: any = moment(this.Employee.TerminationDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.Employee.TerminationDate = TermDate;
    }
    if (!isNullOrUndefined(this.Employee.LastWorkingDate)) {
      let lwDate: any = moment(this.Employee.LastWorkingDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.Employee.LastWorkingDate = lwDate;
    }
    const date = this.compareDate(new Date(this.Employee.TerminationDate), this.Employee.EmpStartDate);
    if (date === -1) {
      this.isLoading = false;
      this._alertService.error("termination date must be greater than employee start date");
      this.Employee.TerminationDate = null;
      return;
    }

    if (this.employeeAssignment.length > 0) {
      const check = this.CheckAssignmentValidation(this.employeeAssignment);
      if (check) {
        this.isLoading = false;
        this._alertService.error("Please enter assignment end date");
        return;
      }
      const assignment = this.prepareAssignmentMastersData(this.employeeAssignment)
      this.Employee.AssignmentMasters = this.DeepCopyForObject(assignment);
      if (this.Employee.AssignmentMasters.length > 0) {
        this.Employee.AssignmentMasters.forEach(ele => {
          if (!isNullOrUndefined(ele.EndDate)) {
            let EndDate: any = moment(ele.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
            ele.EndDate = EndDate;

            // let expectDate: any = new Date(ele.EndDate);
            // ele.EndDate = expectDate;
          }
          if (!isNullOrUndefined(ele.StartDate)) {
            let expectDate: any = moment(ele.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms");
            ele.StartDate = expectDate;
          }
        })
      }
    }

    this.SaveEmployeeMaster();

  }

  SaveEmployeeMaster() {
    this.Employee.UpdatedBy = this.loginUser.UserId;
    this.Employee.UpdatedDate = new Date();
    this._service.TerminateEmployee(this.Employee).subscribe(response => {
      if (!response.IsError) {
        this.isLoading = false;
        this._alertService.success("Employee terminated successfully");
        this.dialogRef.close(true);
      } else {
        this.isLoading = false;
        this._alertService.error(response.ErrorMessage);
      }

    }, error => { this._alertService.error(error); this.isLoading = false; })

  }

  CheckAssignmentValidation(assign) {
    let ischeck: boolean = false;
    if (assign.length > 0) {
      assign.forEach(data => {
        if (this.isEmpty(data.EndDate)) {
          ischeck = true;
        }
        const date = this.compareDate(new Date(data.EndDate), data.StartDate);
        if (date === -1) {
          ischeck = true;
        }
      });
    }
    return ischeck;
  }

  private isEmpty(value) {
    return (
      //null or undefined
      (value == null) || (value == 0) ||
      // has length and it's zero
      (value.hasOwnProperty('length') && value.length === 0) ||
      // is an Object and has no keys
      (value.constructor === Object && Object.keys(value).length === 0)
    );
  }

  prepareAssignmentMastersData(assignment: AssignmentMaster[]) {
    this.dbAssignmentMaster = [];
    assignment.forEach(x => {
      const assign = {
        AssignmentID: x.AssignmentID,
        CompAssignmentID: x.CompAssignmentID,
        AssignmentName: x.AssignmentName,
        Status: x.Status,
        AssignmentType: x.AssignmentType,
        AsmtCategory: x.AsmtCategory,
        StartDate: x.StartDate,
        EndDate: x.EndDate,
        BillingRate: x.BillingRate,
        BillRateType: x.BillRateType,
        AsmtClassification: x.AsmtClassification,
        WLAddress1: x.WLAddress1,
        WLAddress2: x.WLAddress2,
        WLCity: x.WLCity,
        WLState: x.WLState,
        WLCountry: x.WLCountry,
        WLZipCode: x.WLZipCode,
        PlacementPOC: x.PlacementPOC,
        EmployeeID: x.EmployeeID,
        IsDeleted: x.IsDeleted,
        TimeSheet: x.TimeSheet,
        CompanyID: x.CompanyID,
        CreatedBy: x.CreatedBy,
        CreatedDate: x.CreatedDate,
        UpdatedBy: x.UpdatedBy,
        UpdatedDate: x.UpdatedDate,
        CompanyAssignmentId: x.CompanyAssignmentId,
        PlacementID: x.PlacementID,
      }
      this.dbAssignmentMaster.push(assign);
    })
    return this.dbAssignmentMaster
  }
  private compareDate(date1: Date, date2: Date): number {
    let d1 = new Date(date1); let d2 = new Date(date2);

    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;

    // Check if the first is less than second
    if (d1 < d2) return -1;
  }
  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }
}
