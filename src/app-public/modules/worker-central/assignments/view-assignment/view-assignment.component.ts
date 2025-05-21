import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import { EmployeeMaster } from '../../core/models/employeemaster';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import iclocationon from '@iconify/icons-ic/location-on';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';

@Component({
  selector: 'cv-view-assignment',
  templateUrl: './view-assignment.component.html',
  styleUrls: ['./view-assignment.component.scss'],
  providers: [AccountTypes, PlacementService]
})
export class ViewAssignmentComponent implements OnInit {



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
  iclocationon=iclocationon;
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert=icMoreVert;
  icArrowDropDown=icArrowDropDown;
  formattedAddress:string;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<ViewAssignmentComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdr: ChangeDetectorRef,
    private _service: PlacementService,
    private _sanitizer: DomSanitizer,
  ) {
    this.thirdFormGroup = this.fb.group({
      AssignmentId: [{ value: '', disabled: true }], Name: [{ value: '', disabled: true }], AssignmentType: [{ value: '', disabled: true }],
      Classification: [{ value: '', disabled: true }], asmStartDate: [{ value: '', disabled: true }],
      asmEndDate: [{ value: '', disabled: true }], WLAddress2: [{ value: '', disabled: true }],
      WLState: [{ value: '', disabled: true }], WLCity: [{ value: '', disabled: true }], countryName: [{ value: '', disabled: true }], WLZipCode: [{ value: '', disabled: true }],
      TimeSheet: [{ value: '', disabled: true }], RemoteAssignment: [{ value: '', disabled: true }], AmendmentRequired: [{ value: '', disabled: true }],
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
        this.EmpCompanyId = this.Assignment.ComapnyEmployeeID; //this.EmployeeList.find(x => x.EmployeeID === this.employeeID).ComapnyEmployeeID;
        this.empFirstName = this.Assignment.EmployeeFirstName;//this.EmployeeList.find(x => x.EmployeeID === this.employeeID).FirstName;
        this.empLastName = this.Assignment.EmployeeLastName;//this.EmployeeList.find(x => x.EmployeeID === this.employeeID).LastName;
        const Addoutput =  [this.Assignment.WLAddress1, this.Assignment.WLAddress2,this.Assignment.WLCity, this.Assignment.WLState,this.Assignment.WLZipCode].filter(Boolean).join(", ");
        this.formattedAddress = Addoutput;
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
  
}
