import { ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import { EmployeeMaster } from '../../core/models/employeemaster';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/@shared/services/alert.service';
import { City } from 'src/@shared/models/city';
import { Country } from 'src/@shared/models/country';
import { State } from 'src/@shared/models/state';
import { UserCompanyDetails } from '../../core/models/usercompanydetails';
import { AuthenticationService } from 'src/@shared/services/authentication.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import icClose from '@iconify/icons-ic/twotone-close';

import icfileupload from '@iconify/icons-ic/file-upload';
import { LoginUser } from 'src/@shared/models';
import { PlacementService } from '../../core/http/placement.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { ValidationService } from 'src/@cv/services/validation.service';
@Component({
  selector: 'cv-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss'],
  providers: [AccountTypes, PlacementService]
})
export class AddAssignmentComponent implements OnInit {

  cancountryControl: FormControl = new FormControl();
  cancountryOptions: Observable<any>;

  EmployeeControl: FormControl = new FormControl();
  empOptions: Observable<any>;

  cancityControl: FormControl = new FormControl();
  cancityOptions: Observable<any>;

  canstateControl: FormControl = new FormControl();
  canstateOptions: Observable<State[]>;

  public assignCities: City[] = [];
  public assignCountry: Country[] = [];
  public assignStates: State[] = [];
  public companyDetails: UserCompanyDetails = new UserCompanyDetails();
  public loginUser: LoginUser;
  public EmployeeList: EmployeeMaster[] = [];
  public Assignment: AssignmentMaster = new AssignmentMaster();
  public employeeID: number = 0;
  public Employee: string;
  public EmpCompanyId: string = null;
  public empFirstName: string = null;
  public empLastName: string = null;
  thirdFormGroup: FormGroup;
  icFileUpload = icfileupload;
  icClose = icClose;
  IsAssLocation:boolean=false;
  constructor(
    public zone: NgZone,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<AddAssignmentComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private _sanitizer: DomSanitizer,
  ) {
    this.thirdFormGroup = this.fb.group({
      AssignmentId: [{ value: '', disabled: true }], Name: [null], AssignmentType: [null],
      Classification: [null], 
      asmStartDate:[null,[Validators.required]],
      asmEndDate: [null,[Validators.required]], 
      WLAddress2: [null],
      WLState: [null], WLCity: [null], countryName: [null], 
      WLZipCode: [null,[Validators.required,ValidationService.zipCodeValidator]],
      TimeSheet: [null], RemoteAssignment: [null], AmendmentRequired: [null],
      EmpCompanyId: [{ value: '', disabled: true }], empFirstName: [{ value: '', disabled: true }], empLastName: [{ value: '', disabled: true }]
    },{ validator: this.ValidateAssignmentStartEndDate });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getEmployeeAssign();
      this.GetCompanyDetails();
    }

  }
  getEmployeeAssign() {
    this._service.getEmployeeAssign(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.EmployeeList = response.Data;
      }
      this.empOptions = this.EmployeeControl.valueChanges.pipe(startWith(''), map(val => this.empfilter(val)));
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }
  GetCompanyDetails() {
    this._service.GetCompanyDetails(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.companyDetails = response.Data;
        this.Assignment.WLAddress1 = this.companyDetails.Address1;
        this.Assignment.WLAddress2 = this.companyDetails.Address2;
        this.Assignment.WLState = this.companyDetails.State;
        this.Assignment.WLCity = this.companyDetails.City;
        this.Assignment.WLZipCode = this.companyDetails.Zip;
        this.Assignment.CreatedDate = new Date();
        this.Assignment.CreatedBy = this.loginUser.UserId;
        this.Assignment.AsmtClassification = 'Non-Billable';
        this.Assignment.AsmtCategory = 1;
        this.Assignment.CompanyID = this.loginUser.Company.Id;
      }
    }, error => {
      this._alertService.error(error);
    });
  }
  empfilter(val: string) {
    if (!isNullOrUndefined(val))
      return this.EmployeeList.filter(option => option.FirstName.toLowerCase().indexOf(val.toLowerCase()) === 0
        || option.LastName.toLowerCase().indexOf(val.toLowerCase()) === 0 || option.Email.toLowerCase().indexOf(val.toLowerCase()) === 0);

  }
  onAssignSelectionempChanged(event) {
    this.employeeID = event.option.id;
    this.EmpCompanyId = this.EmployeeList.find(x => x.EmployeeID === event.option.id).ComapnyEmployeeID;
    this.empFirstName = this.EmployeeList.find(x => x.EmployeeID === event.option.id).FirstName;
    this.empLastName = this.EmployeeList.find(x => x.EmployeeID === event.option.id).LastName;

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  saveAssignment() {
    this.Assignment.EmployeeID = this.employeeID;
    this.Assignment.PlacementID = null;
    if (this.Assignment.StartDate){
      let stdate:any=moment(this.Assignment.StartDate).format("YYYY-MM-DDTHH:mm:ss");
      this.Assignment.StartDate = stdate;
     // this.Assignment.StartDate = moment(this.Assignment.StartDate).format("YYYY-MM-DDTHH:mm:ss")
    }
   
    if (this.Assignment.EndDate){
      let etdate:any=moment(this.Assignment.EndDate).format("YYYY-MM-DDTHH:mm:ss");
      this.Assignment.EndDate = etdate;
    }
     
    this._service.SaveAssignment(this.Assignment).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  changestartDate(event) {
    debugger
    this.Assignment.StartDate = event.value;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  changeendDate(event) {
    this.Assignment.EndDate = event.value;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  getAssignAddress(event) {
    let data = event.address_components;
  
    // Reset fields that are going to be updated
    this.Assignment.WLAddress2 = null;
    this.Assignment.WLAddress1 = null;
    this.Assignment.WLCity = null;
    this.Assignment.WLState = null;
    this.Assignment.WLCountry = null;
    this.Assignment.WLZipCode = null;
  
    if (data && data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          this.Assignment.WLAddress1 = address.long_name;
        }
        else if (address.types.includes("route")) {
          this.Assignment.WLAddress1 = isNullOrUndefined(this.Assignment.WLAddress1) ? address.long_name : this.Assignment.WLAddress1 + " " + address.long_name;
          this.IsAssLocation = true;
        } else if (address.types.includes("locality") || address.types.includes("sublocality")) {
          this.Assignment.WLCity = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.Assignment.WLState = address.short_name;
        } else if (address.types.includes("country")) {
          this.Assignment.WLCountry = address.short_name;
        } else if (address.types.includes("postal_code")) {
          this.Assignment.WLZipCode = address.long_name;
        }
      }
    } else {
      event.target.value = null;
      this.IsAssLocation = false;
    }
  
    // Trigger change detection
    this.cdRef.detectChanges();
  }
  
  
  inputAssignEmployeeAddress(event) {
    this.getAssignAddress(event);
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

  ValidateAssignmentStartEndDate(group: FormGroup) {
    const start = group.controls.asmStartDate;
    const end = group.controls.asmEndDate;
    let StartDate: any; let EndDate: any
    if (start.value !== null) {
      StartDate = moment(start.value).format("YYYY-MM-DDTHH:mm:ss.ms")
    }
    if (end.value !== null) {
      EndDate = moment(end.value).format("YYYY-MM-DDTHH:mm:ss.ms")
    }

    if (!StartDate || !EndDate) {
      return null;
    }
    if (StartDate >= EndDate) {
      return { greaterThan: true };
    }
    return null;
  }
}
