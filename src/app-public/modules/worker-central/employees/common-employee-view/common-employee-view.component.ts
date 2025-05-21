import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { PlacementService } from '../../core/http/placement.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { InvoiceCycle } from '../../core/models/onboardingEnum';
import { FileStoreService } from 'src/@shared/services/file-store.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDocuments } from '../../core/models/employeedocuments';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeMaster } from '../../core/models/employeemaster';
import { EmployerProfile } from '../../core/models/employerprofile';
import { DocViewerComponent } from '../doc-viewer/doc-viewer.component';
import { IconService } from 'src/@shared/services/icon.service';

@Component({
  selector: 'cv-common-employee-view',
  templateUrl: './common-employee-view.component.html',
  styleUrls: ['./common-employee-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService, InvoiceCycle, FileStoreService]
})
export class CommonEmployeeViewComponent implements OnInit {
@Input() EmployeeID:number
  empdisplayedColumns: string[] = ['position', 'name', 'type', 'actions'];

  public manageEmployerProfile: EmployerProfile[] = [];
  public financeEmployerProfile: EmployerProfile[] = [];
  public trainingEmployerProfile: EmployerProfile[] = [];
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
  isPageload: boolean = true;
  isempdocloading: boolean = false;
  isempDocumentType: boolean = true;
  employeeList:EmployeeMaster[]=[];
  formattedAddress:string;

  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private invoiceCycle: InvoiceCycle,
    private fileStoreService: FileStoreService,
    private _sanitizer: DomSanitizer,
    public iconService: IconService) {
    this.Employee.EmployeeType="Consultant";
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.isPageload = true;
      this.getEmployeeCentralUsers();
      this.GetEmployees();
    }
  }
  GetEmployees() {
    this.Employee = new EmployeeMaster();
    this._service.GetEmployeeByID(this.EmployeeID,this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.Employee=response.Data;
        const Addoutput = [this.Employee.Address1, this.Employee.Address2,this.Employee.City, this.Employee.State,this.Employee.ZipCode].filter(Boolean).join(", ");
        this.formattedAddress = Addoutput;
        if (!isNullOrUndefined(this.Employee.WebsiteUser)) {
          this.Employee.CreateUserAccount = true;
        }
        if(this.Employee.HealthInsuranceEnrolled==null){
          this.Employee.HealthInsuranceEnrolled=false;
        } 
        if(this.Employee && this.Employee.EmployeeDocuments && this.Employee.EmployeeDocuments.length>0){
          this.employeeDocuments=this.Employee.EmployeeDocuments;
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
      this.manageEmployerProfile = response.Data.filter(item => item.UserRole == "HR Manager");
      this.financeEmployerProfile = response.Data.filter(item => item.UserRole == "Finance Manager");
      this.trainingEmployerProfile = response.Data.filter(item => item.UserRole == "Training Manager");
      // this.manageEmployerProfile = response;
    }, error => {
      this.isPageload = false;
      this._alertService.error(error);
    })
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

}
