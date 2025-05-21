import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import iclocationon from '@iconify/icons-ic/location-on';
import icdelete from '@iconify/icons-ic/delete';
import icvieweye from '@iconify/icons-ic/remove-red-eye';
import icClose from '@iconify/icons-ic/twotone-close';
import icfileupload from '@iconify/icons-ic/file-upload';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginUser } from 'src/@shared/models';
import { EmployeeMaster } from '../../core/models/employeemaster';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import icPerson from '@iconify/icons-ic/twotone-person';
import moment from 'moment';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { PlacementService } from '../../core/http/placement.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { InvoiceCycle } from '../../core/models/onboardingEnum';
import { FileStoreService } from 'src/@shared/services/file-store.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDocuments } from '../../core/models/employeedocuments';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { EmployerProfile } from '../../core/models/employerprofile';
import { DocViewerComponent } from '../doc-viewer/doc-viewer.component';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { forkJoin } from 'rxjs';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@Component({
  selector: 'cv-edit-placement-employee',
  templateUrl: './edit-placement-employee.component.html',
  styleUrls: ['./edit-placement-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService, InvoiceCycle, FileStoreService]
})
export class EditPlacementEmployeeComponent implements OnInit {

  empdisplayedColumns: string[] = ['position', 'name', 'type', 'actions'];

  icFileUpload = icfileupload;
  icClose = icClose;
  icDoneAll = icDoneAll;
  icPictureAsPdf = icPictureAsPdf;
  iclocationon = iclocationon;
  icPerson = icPerson;
  icdelete = icdelete;
  icvieweye = icvieweye

  public manageEmployerProfile: EmployerProfile[] = [];
  public financeEmployerProfile: EmployerProfile[] = [];
  public trainingEmployerProfile: EmployerProfile[] = [];
  public AddEmployeeFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public Employeedownlaodables: FileUploader = new FileUploader({ url: this.fileStoreService.getWebAPIEmployeeUploadUrl() });
  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  loginUser: LoginUser;
  public employeeDocuments: EmployeeDocuments[] = [];
  public selectedEmployeeDoc: EmployeeDocuments = new EmployeeDocuments();
  public Employee: EmployeeMaster = new EmployeeMaster();
  public FileName: string;
  empdataSource = new MatTableDataSource(this.employeeDocuments)
  public Url: any;
  DocumentViewUrl: string;
  DocName: any;
  empDocumentType: number;
  EmployeeFileName: string;
  public workStatuFields: SelectItem[] = [];
  isPageload: boolean = true;
  isempdocloading: boolean = false;
  isempDocumentType: boolean = true;
  employeeList: EmployeeMaster[] = [];
  DialogResponse: ConfirmDialogModelResponse;
  public EmployeeList: EmployeeMaster[] = [];
  public Assignment: AssignmentMaster = new AssignmentMaster();
  public employeeID: number = 0;
  public EmpCompanyId: string = null;
  public empFirstName: string = null;
  public empLastName: string = null;
  IsWorkerLocation: boolean = false;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<EditPlacementEmployeeComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private invoiceCycle: InvoiceCycle,
    private fileStoreService: FileStoreService,
    private _sanitizer: DomSanitizer,
    public zone: NgZone,
    private workStatusService: WorkStatusService
  ) {
    this.AddEmployeeFormGroup = this.fb.group({
      EmployeeId: [{ value: '', disabled: true }], EmployeeType: [null], FirstName: [null],
      MiddleName: [null], LastName: [null], Email: [{ value: '', disabled: true }],
      PrimaryPhoneNumber: [null], dob: [null], Address1: [null],
      Address2: [null], City: [null], State: [null], EmploymentType: [null],
      ZipCode: [null], Gender: [null], MaritalStatus: [null], Designation: [null],
      WorkStatus: [null], WorkStatusExpiry: [null], WorkStatusEffective: [null],
      EmpStartDate: [null], assignmentStatus: [null], CreateUserAccount: [null],
      HealthInsuranceEnrolled: [null], HRManager: [null], TrainingManager: [null],
      FinanceManager: [null], DocumentType: [null], Department: [null], empDocumentType: [null],
      EmployeeFileName: [null], I94Number: [null], I94ExpiryDate: [null]
    });
    this.thirdFormGroup = this.fb.group({
      AssignmentId: [{ value: '', disabled: true }], Name: [{ value: '', disabled: true }], AssignmentType: [{ value: '', disabled: true }],
      Classification: [{ value: '', disabled: true }], asmStartDate: [{ value: '', disabled: true }],
      asmEndDate: [{ value: '', disabled: true }], WLAddress2: [{ value: '', disabled: true }],
      WLState: [{ value: '', disabled: true }], WLCity: [{ value: '', disabled: true }], countryName: [{ value: '', disabled: true }], WLZipCode: [{ value: '', disabled: true }],
      TimeSheet: [{ value: '', disabled: true }], RemoteAssignment: [{ value: '', disabled: true }], AmendmentRequired: [{ value: '', disabled: true }],
      EmpCompanyId: [{ value: '', disabled: true }], empFirstName: [{ value: '', disabled: true }], empLastName: [{ value: '', disabled: true }]
    });
    this.Employee.EmployeeType = "Consultant";

  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      // Create an object to store all observables
      this.getEmployeeCentralUsers();
      // Load work status fields directly
      this.loadWorkStatusFields().subscribe({
        next: (workStatusFields) => {
          this.workStatuFields = workStatusFields;
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error loading work status fields:', error);
          this._alertService.error('Error loading work status fields');
        }
      });

    }
    // Setup file upload handler
    this.setupFileUploadHandlers();
  }

  loadWorkStatusFields() {
    return this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id);
  }

  private setupFileUploadHandlers(): void {
    this.Employeedownlaodables.onAfterAddingFile = (item: FileItem) => {
      this.isempdocloading = true;
      let isValid: boolean = false;
      let fileExtension = item.file.name.replace(/^.*\./, '');
      let validExtensions: string[] = [".pdf"];

      for (let ext of validExtensions) {
        if (item.file.name.toLowerCase().endsWith(ext.toLowerCase())) {
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        this._alertService.error("uploaded file is not in the correct format");
        this.isempdocloading = false;
        return;
      }

      item.withCredentials = false;
      item.file.name = item.file.name;
      this.Employeedownlaodables.uploadItem(item);
      this.EmployeeFileName = item.file.name;
    };

    this.Employeedownlaodables.onSuccessItem = (item: FileItem, response: string) => {
      this.isempdocloading = false;
      let result = JSON.parse(response);
      result.PlacementID = this.Data;
      if (this.empDocumentType != 0) {
        result.DocumentType = this.empDocumentType;
      }
      result.EmployeeDocumentID = 0;
      result.EmployeeID = this.Employee.EmployeeID != 0 ? this.Employee.EmployeeID : 0;
      this.employeeDocuments.push(result);
      this.empdataSource = new MatTableDataSource(this.employeeDocuments);
      this.EmployeeFileName = null;
      this.empDocumentType = 0;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    };
  }

  GetEmployeeByID() {
    this.Employee = new EmployeeMaster();
    this._service.GetEmployeeByID(this.Data, this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.Employee = response.Data;
        if (this.Employee && this.Employee.EmployeeDocuments && this.Employee.EmployeeDocuments.length > 0) {
          this.employeeDocuments = this.Employee.EmployeeDocuments;
          this.empdataSource = new MatTableDataSource(this.employeeDocuments);
        }

        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
        this.getEmployeeAssign();
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  getEmployeeAssign() {
    this._service.getEmployeeAssign(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.EmployeeList = response.Data;

      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }
  getEmployeeCentralUsers() {
    this._service.getEmloyeeCentralUsers(this.loginUser.Company.Id).subscribe(response => {
      this.manageEmployerProfile = response.Data;
      this.GetEmployeeByID();
    }, error => {
      this.isPageload = false;
      this._alertService.error(error);
    })
  }
  Workstatuchange(event) {
    if (event.value === "USC") {
      this.Employee.WorkStatusExpiry = new Date("12/31/9999");
    }
  }

  DeleteEmployeeDocument(item, i) {
    const message = 'Are you sure you want to delete <b><span class="displayEmail">' + item.DownloadableFileName + ' </span></b> ?'
    const dialogData = new ConfirmDialogModel("Delete Worker Document", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmDeletedEmpDoc(item, i);
      }
    });
  }

  ConfirmDeletedEmpDoc(item, i) {
    this.employeeDocuments[i].isDeleted = true;
    this.empdataSource = new MatTableDataSource(this.employeeDocuments.filter(x => x.isDeleted === false));
    this._alertService.success('Document Deleted successfully');
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  ViewDocViewer(doc, type) {
    this.Url = null;
    this.DocumentViewUrl = 'https://prod-consultvite.s3.amazonaws.com/' + doc.s3location + '/' + doc.Download_Path_Key;
    this.Url = this._sanitizer.bypassSecurityTrustResourceUrl(this.DocumentViewUrl);
    this.DocName = type;
    this.dialog.open(DocViewerComponent,
      { width: '60%', panelClass: "dialog-class", data: { Url: this.Url, Name: this.DocName } }
    ).afterClosed().subscribe((confirmation) => {
    });
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  onEmpFileClick(ada) {
    if (this.empDocumentType === 0) {
      this.isempDocumentType = true;
      this._alertService.error("Please select document type");
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    } else {
      this.isempDocumentType = false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    }
  }
  empDocumentTypechange(event) {
    if (event.value !== 0) {
      this.empDocumentType = event.value;
      this.isempDocumentType = false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    } else {
      this.isempDocumentType = true;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    }

  }
  onDownlaodablesemployeeClear() {
    this.EmployeeFileName = null;
    this.isempdocloading = false;
    this.selectedEmployeeDoc = new EmployeeDocuments();
  }
  updateEmployee() {
    this.Employee.UpdatedDate = new Date();
    this.Employee.UpdatedBy = this.loginUser.UserId;
    this.Employee.CompanyID = this.loginUser.Company.Id;
    this.Employee.DOB = moment(this.Employee.DOB).format("YYYY-MM-DD");
    if (this.employeeDocuments.length > 0) {
      this.employeeDocuments.forEach(ele => {
        if (ele.EmployeeDocumentID === 0) {
          ele.CreatedDate = new Date();
          ele.CreatedBy = this.loginUser.UserId;
        }
      })
      this.Employee.EmployeeDocuments = this.employeeDocuments;
    }
    this._service.SaveEmployeeMaster(this.Employee).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })
  }
  assignmentStatusChange(event) { }


  getAddress(event) {
    let data = event.address_components;
    this.Employee.Address2 = null;
    this.Employee.Address1 = null;
    this.Employee.City = null;
    this.Employee.Country = null;
    this.Employee.ZipCode = null;

    if (data && data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          this.Employee.Address1 = address.long_name;
        }
        else if (address.types.includes("route")) {
          this.Employee.Address1 = isNullOrUndefined(this.Employee.Address1) ? address.long_name : this.Employee.Address1 + " " + address.long_name;
          this.IsWorkerLocation = true;
        }
        else if (address.types.includes("locality") || address.types.includes("sublocality")) {
          this.Employee.City = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.Employee.State = address.short_name;
        } else if (address.types.includes("country")) {
          this.Employee.Country = address.long_name;
        } else if (address.types.includes("postal_code")) {
          this.Employee.ZipCode = address.long_name;
        }
      }
    }
    else {
      event.target.value = null;
      this.IsWorkerLocation = false;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }


  inputEmployeeAddress(event) {
    this.getAddress(event)
  }

  inputAssignEmployeeAddress(event) {
    this.getAssignAddress(event);
  }
  getAssignAddress(event) {
    let data = event.address_components;
    this.zone.run(() => {
      this.Assignment.WLAddress2 = null;
      this.Assignment.WLAddress1 = null;
      this.Assignment.WLCity = null;
      this.Assignment.WLState = null;
      this.Assignment.WLCountry = null;
      this.Assignment.WLZipCode = null;
    });

    if (data && data.length > 0) {
      console.log(data);
      for (let address of data) {
        if (address.types.includes("route")) {
          this.Assignment.WLAddress1 = address.long_name;
          this.zone.run(() => this.Assignment.WLAddress1 = address.long_name);

        } else if (address.types.includes("locality") || address.types.includes("sublocality")) {
          this.Assignment.WLCity = address.long_name;
        }
        else if (address.types.includes("administrative_area_level_1")) {
          this.Assignment.WLState = address.short_name;
        } else if (address.types.includes("country")) {
          this.Assignment.WLCountry = address.short_name;
        } else if (address.types.includes("postal_code")) {
          this.Assignment.WLZipCode = address.long_name;
        }
      }
    }
    else {
      event.target.value = null;

    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  PhonenumberFormate(type) {
    switch (type) {
      case 'emp':
        this.Employee.PrimaryPhoneNumber = this.PhoneValid(this.Employee.PrimaryPhoneNumber);
        break;
    }
  }
  private PhoneValid(phone) {
    //normalize string and remove all unnecessary characters
    if (phone) {
      phone = phone.replace(/[^\d]/g, "");
      //check if number length equals to 10
      if (phone.length == 10) {
        //reformat and return phone number
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      } else {
        return null;
      }
    } else {
      return null;
    }
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
  reset() {
    this.AddEmployeeFormGroup.reset();
  }

  OnDateChange(event, modelType: string) {
    let FormattedDate: any = moment(event.value).format("YYYY-MM-DDTHH:mm:ss.ms");
    if (modelType == 'I94ExpiryDate')
      this.Employee.I94ExpiryDate = FormattedDate;
    else if (modelType == 'WorkStatusEffective')
      this.Employee.WorkStatusEffective = FormattedDate;
    else if (modelType == 'EmpStartDate')
      this.Employee.EmpStartDate = FormattedDate;
    else if (modelType == 'WorkStatusExpiry')
      this.Employee.WorkStatusExpiry = FormattedDate;

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
}
