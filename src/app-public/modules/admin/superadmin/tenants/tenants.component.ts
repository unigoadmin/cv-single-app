import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { SuperAdminService } from '../../core/http/superadmin.service';
import { OnBoardingCompanies } from '../../core/models/onboard-comapines';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IconService } from 'src/@shared/services/icon.service'; 
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { ViewTenantDetailsComponent } from './view-tenant-details/view-tenant-details.component';
import { ManageTenantDetailsComponent } from './manage-tenant-details/manage-tenant-details.component';
import { SignUp } from 'src/app-public/modules/initial/core/models';
import { IdentityService } from 'src/app-public/modules/initial/core/http/identity.service';

@Component({
  selector: 'cv-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms,
    stagger40ms
  ]
})
export class TenantsComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<OnBoardingCompanies>();
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );
  tableData: OnBoardingCompanies[] = [];
  OnbardingNotes: string;
  DeleteNotes: String;
  singup: SignUp = new SignUp();
  onboardingStatus: string;
  @Input()
  columns: TableColumn<OnBoardingCompanies>[] = [
    { label: 'COMPANY NAME', property: 'CompanyName', type: 'text', visible: true, cssClasses: ['font-medium', 'textcgs'] },
    { label: 'WEBSITE', property: 'Website', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'EMAIL', property: 'PrimaryEmail', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'PHONE', property: 'PhoneNo', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'USERS', property: 'EmpCandidateCount', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'STATUS', property: 'IsActive', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'ONBOARD STATUS', property: 'onboarding_status', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'CREATED DATE', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  loginUser: LoginUser;
  companiesList: OnBoardingCompanies[];
  selectedStatus: string = "All";
  dialogRef: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('OnboardModal') rsDialog = {} as TemplateRef<any>;
  @ViewChild('DeleteModal') dsDialog = {} as TemplateRef<any>;
  @ViewChild('ResendModal') resendActivationDialog = {} as TemplateRef<any>;
  currentcompany: OnBoardingCompanies = new OnBoardingCompanies();
  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _adminService: SuperAdminService,
    private cdRef: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    public iconService: IconService,
    private _identityService: IdentityService) {
    this.dataSource = new MatTableDataSource();
    this.companiesList = [];
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getOnboardingCompanies();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOnboardingCompanies() {
    this._adminService.getOnboardingCompaines().subscribe(response => {
      if (response.IsError == false) {
        this.companiesList = response.Data;
        this.companiesList.forEach(element => {
          element.CreatedDate = TimeZoneService.getLocalDateTime_Date(element.CreatedDate, true);
        });
        this.dataSource.data = this.companiesList;
        this.setDataSourceAttributes();
        this.filterStatus(this.selectedStatus);
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }

    }, error => {
      this._alertService.error(error);
    });
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CreatedDate': return new Date(item.CreatedDate);
        default: return item[property];
      }
    };
  }

  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CreatedDate': return new Date(item.CreatedDate);
        default: return item[property];
      }
    };
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }


  filterStatus(status: String) {
    if (status == 'All') {
      this.dataSource.data = this.companiesList;
      this.selectedStatus = "All"
    }
    else if (status == 'Active') {
      this.dataSource.data = this.companiesList.filter(i => i.IsActive == true);
      this.selectedStatus = "Active"
    }
    else if (status == 'Inactive') {
      this.dataSource.data = this.companiesList.filter(i => i.IsActive == false);
      this.selectedStatus = "Inactive"
    }
    else if (status == 'ActivationPending') {
      this.dataSource.data = this.companiesList.filter(i => i.IsEmailConfirmed == false);
      this.selectedStatus = "ActivationPending"
    }
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  ViewCompany(user: OnBoardingCompanies) {
    this.dialog.open(ViewTenantDetailsComponent, {
      data: { CompanyID: user.CompanyID, Mode: 'view' },
      maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe((action) => {
      if (action) {
        if (action === "Edit") {
          this.ManageCompany(user);
        }
      }
    });

  }

  ManageCompany(company: OnBoardingCompanies) {
    this.currentcompany = company;
    this.dialog.open(ManageTenantDetailsComponent, {
      data: { CompanyID: company.CompanyID, Mode: 'view', RootUser: company.SuperAdminId },
      maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    });
  }

  ActivateCompany(company: OnBoardingCompanies) {
    this.currentcompany = company;
    this.dialogRef = this.dialog.open(this.resendActivationDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        //this._alertService.success('Keyword saved successfully');
      }
    });
  }

  DeleteCompany(company: OnBoardingCompanies) {
    this.currentcompany = company;
    this.dialogRef = this.dialog.open(this.dsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        //this._alertService.success('Keyword saved successfully');
      }
    });
  }

  OnboardCompany(company: OnBoardingCompanies) {
    this.currentcompany = company;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        //this._alertService.success('Keyword saved successfully');
      }
    });
  }

  ClosePopup() {
    this.dialogRef.close(false);
  }

  UpdateOnbaordStatus() {
    const companyDetails = {
      CompanyId: this.currentcompany.CompanyID,
      onbaord_status: this.onboardingStatus,
      OnbardingNotes: this.OnbardingNotes,
      UpdatedBy: this.loginUser.UserId,
      Action:'Onboard'
    }
    this._adminService.updateCompanyStatus(companyDetails)
      .subscribe(
        response => {
          if (response.IsError === false) {
            this._alertService.success(response.SuccessMessage);
            this.dialogRef.close();
            this.getOnboardingCompanies();
          } else {
            this._alertService.error(response.ErrorMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  OnCompanyDelete() {
    const companyDetails = {
      CompanyId: this.currentcompany.CompanyID,
      IsDelete: true,
      DeleteNotes: this.DeleteNotes,
      UpdatedBy: this.loginUser.UserId,
      Action:'Delete'
    }
   
    this._adminService.updateCompanyStatus(companyDetails)
      .subscribe(
        response => {
          if (response.IsError === false) {
            this._alertService.success(response.SuccessMessage);
            this.dialogRef.close();
            this.getOnboardingCompanies();
          } else {
            this._alertService.error(response.ErrorMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }


  SendActivationLink() {debugger;
      this.singup.FirstName = this.currentcompany.FirstName,
      this.singup.LastName = this.currentcompany.LastName,
      this.singup.Email = this.currentcompany.PrimaryEmail,
      this.singup.PhoneNumber = this.currentcompany.PhoneNo,
      this.singup.Role = 1

    this._identityService.SendCompanyActivationLink(this.singup)
      .subscribe(
        response => {
          this._alertService.success("Activation link sent successfully");
          this.dialogRef.close();
        },
        error => {
          this._alertService.success("Error in while resending Activation link");
        });
  }



}
