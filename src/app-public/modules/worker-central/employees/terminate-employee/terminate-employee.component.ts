import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { PlacementService } from '../../core/http/placement.service';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import { EmployeeMaster } from '../../core/models/employeemaster';
import icClose from '@iconify/icons-ic/twotone-close';
import { DBAssignmentMaster } from '../../core/models/DBAssignmentMaster';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';

@Component({
  selector: 'cv-terminate-employee',
  templateUrl: './terminate-employee.component.html',
  styleUrls: ['./terminate-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class TerminateEmployeeComponent implements OnInit {
  icClose = icClose;
  loginUser: LoginUser;
  employeeList: EmployeeMaster[] = [];
  public Employee: EmployeeMaster = new EmployeeMaster();
  isPageload: boolean = true;
  public TerminateEmployeeFormGroup: FormGroup;
  public isloading: boolean = false;
  public AssignmentName: string = null;
  public employeeAssignment: AssignmentMaster[] = [];
  public dbAssignmentMaster: DBAssignmentMaster[] = [];

  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public EmployeeID: number,
    private dialogRef: MatDialogRef<TerminateEmployeeComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _service: PlacementService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder) {

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
      this.isPageload = true;
      this.GetEmployees();
      this.GetEmployeeAssignments();
    }
  }

  GetEmployees() {debugger;
    this.Employee = new EmployeeMaster();
    this._service.GetEmployeeByID(this.EmployeeID, this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.Employee = response.Data;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
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

  GetEmployeeAssignments(){
    this._service.GetEmployeeAssignemnts(this.EmployeeID, this.loginUser.Company.Id).subscribe(response => {
      this.employeeAssignment = response.Data;
      this.employeeAssignment = this.employeeAssignment.filter(x => x.Status === 1)
      if (this.employeeAssignment.length > 0) {
        this.employeeAssignment.forEach(x=>{x.EndDate=null;})
      } else {
        this.employeeAssignment =[];
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  terminateEmployee() {
    this.isloading = true;
    this.AssignmentName = null;
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
      this.isloading = false;
      this._alertService.error("termination date must be greater than employee start date");
      this.Employee.TerminationDate = null;
      return;
    }

    if (this.employeeAssignment.length > 0) {
      const check = this.CheckAssignmentValidation(this.employeeAssignment);
      if (check) {
        this.isloading = false;
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
        this.isloading = false;
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
      } else {
        this.isloading = false;
        this._alertService.error(response.ErrorMessage);
      }

    }, error => { this._alertService.error(error); this.isloading = false; })

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
        PlacementID:x.PlacementID,
      }
      this.dbAssignmentMaster.push(assign);
    })
    return this.dbAssignmentMaster
  }

  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }


}
