import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import { EmployeeMaster } from '../../core/models/employeemaster';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from 'src/@shared/services/alert.service';
import { City } from 'src/@shared/models/city';
import { Country } from 'src/@shared/models/country'; 
import { State } from 'src/@shared/models/state';
import { UserCompanyDetails } from '../../core/models/usercompanydetails';
import { AuthenticationService } from 'src/@shared/services/authentication.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import icClose from '@iconify/icons-ic/twotone-close';
import icfileupload from '@iconify/icons-ic/file-upload';
import { LoginUser } from 'src/@shared/models';
import { PlacementService } from '../../core/http/placement.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'cv-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss'],
  providers: [AccountTypes, PlacementService]
})
export class EditAssignmentComponent implements OnInit {
 


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
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<EditAssignmentComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdr: ChangeDetectorRef,
    private _service: PlacementService,
    private _sanitizer: DomSanitizer,
  ) {
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
      this.getEmployeeAssign();
      this.GetAssignmentById();
    }

  }
  GetAssignmentById() {
    this._service.GetAssignmentById(this.Data, this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.Assignment = response.Data;
        this.employeeID = this.Assignment.EmployeeID;
        this.EmpCompanyId = this.EmployeeList.find(x => x.EmployeeID === this.employeeID).ComapnyEmployeeID;
        this.empFirstName = this.EmployeeList.find(x => x.EmployeeID === this.employeeID).FirstName;
        this.empLastName = this.EmployeeList.find(x => x.EmployeeID === this.employeeID).LastName;
      }
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  getEmployeeAssign() {
    this._service.getEmployeeAssign(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.EmployeeList = response.Data;
      }
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  onAssignSelectionempChanged(event) {
    this.employeeID = event.option.id;
    this.EmpCompanyId = this.EmployeeList.find(x => x.EmployeeID === event.option.id).ComapnyEmployeeID;
    this.empFirstName = this.EmployeeList.find(x => x.EmployeeID === event.option.id).FirstName;
    this.empLastName = this.EmployeeList.find(x => x.EmployeeID === event.option.id).LastName;
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }
  saveAssignment() {
    
    this.Assignment.UpdatedBy = this.loginUser.UserId;
    this.Assignment.UpdatedDate = new Date();
    let currentDate:any = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
    
    if (this.Assignment.StartDate){
      let adtes:any=moment(this.Assignment.StartDate).format("YYYY-MM-DDTHH:mm:ss");
      this.Assignment.StartDate = adtes
    }      
    if (this.Assignment.EndDate){
      let adtese:any=moment(this.Assignment.EndDate).format("YYYY-MM-DDTHH:mm:ss");
      this.Assignment.EndDate = adtese;
    }
    this.Assignment.Status = !isNullOrUndefined(this.Assignment.EndDate)?this.Assignment.EndDate<currentDate?0:1:0;
    
    this._service.EditAssignment(this.Assignment).subscribe(response => {
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
    this.cdr.detectChanges();
  }
  // getAssignAddress(event) {
  //   let data = event.address_components
  //   this.Assignment.WLAddress2 = null;
  //   if (data.length > 0) {
  //     for (let address of data) {
  //       if (address.types.includes("street_number")) {
  //         this.Assignment.WLAddress1 = address.long_name;
  //       } else if (address.types.includes("route")) {
  //         this.Assignment.WLAddress1 = isNullOrUndefined(this.Assignment.WLAddress1) ? "" : this.Assignment.WLAddress1 + " " + address.long_name;
  //       } else if (address.types.includes("locality")) {
  //         this.Assignment.WLCity = address.long_name;
  //       } else if (address.types.includes("administrative_area_level_1")) {
  //         this.Assignment.WLState = address.short_name;
  //       } else if (address.types.includes("country")) {
  //         this.Assignment.WLCountry = address.short_name;
  //       } else if (address.types.includes("postal_code")) {
  //         this.Assignment.WLZipCode = address.long_name;
  //       }
  //     }
  //   }
  //   if (!this.cdr["distroyed"]) {
  //     this.cdr.detectChanges();
  //   }
  // }
  inputAssignEmployeeAddress(event) {
    this.getAssignAddress(event);
    //this.Assignment.WLAddress1 = isNullOrUndefined(event.target.value) ? "" : event.target.value;
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

}
