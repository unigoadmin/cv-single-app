import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';
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
import { EmployeeMaster } from '../../core/models/employeemaster';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { EmployerProfile } from '../../core/models/employerprofile';
import { DocViewerComponent } from '../doc-viewer/doc-viewer.component';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ValidationService } from 'src/@cv/services/validation.service';
import { IconService } from 'src/@shared/services/icon.service';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@Component({
  selector: 'cv-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService, InvoiceCycle, FileStoreService]
})
export class EditEmployeeComponent implements OnInit {

  empdisplayedColumns: string[] = ['position', 'name', 'type', 'actions'];

  public manageEmployerProfile: EmployerProfile[] = [];
  public financeEmployerProfile: EmployerProfile[] = [];
  public trainingEmployerProfile: EmployerProfile[] = [];
  public AddEmployeeFormGroup: FormGroup;
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
  public workStatusFields: SelectItem[] = [];
  isPageload: boolean = true;
  isempdocloading: boolean = false;
  isempDocumentType: boolean = true;
  employeeList: EmployeeMaster[] = [];
  DialogResponse: ConfirmDialogModelResponse;
  IsWorkerLocation: boolean = false;
  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<EditEmployeeComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private invoiceCycle: InvoiceCycle,
    private fileStoreService: FileStoreService,
    private _sanitizer: DomSanitizer,
    public zone: NgZone,
    public iconService: IconService,
    private workStatusService: WorkStatusService) {
    this.AddEmployeeFormGroup = this.fb.group({
      EmployeeId: [{ value: '', disabled: true }], EmployeeType: [null],
      FirstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      MiddleName: [null, [ValidationService.onlyAlphabetsValidator]],
      LastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      Email: [{ value: '', disabled: true }],
      PrimaryPhoneNumber: [null],
      dob: [null], Address1: [null],
      Address2: [null], City: [null], State: [null], EmploymentType: [null],
      ZipCode: [null], Gender: [null], MaritalStatus: [null], Designation: [null],
      WorkStatus: [null], WorkStatusExpiry: [null], WorkStatusEffective: [null],
      EmpStartDate: [null], assignmentStatus: [null], CreateUserAccount: [null],
      HealthInsuranceEnrolled: [null], HRManager: [null], TrainingManager: [null], ImmigrationManager: [null],
      FinanceManager: [null], DocumentType: [null], Department: [null], empDocumentType: [null],
      EmployeeFileName: [null], I94Number: [null], I94ExpiryDate: [null]
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
          this.workStatusFields = workStatusFields;
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


  GetEmployees() {
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
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  getEmployeeCentralUsers() {
    this._service.getEmloyeeCentralUsers(this.loginUser.Company.Id).subscribe(response => {
      this.manageEmployerProfile = response.Data;
      this.GetEmployees();
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
    this.Employee.Address1 = isNullOrUndefined(event.target.value) ? "" : event.target.value;
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
