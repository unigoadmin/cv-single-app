import {Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable,  ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface'; 
import { BenchPriorityLabels } from 'src/static-data/aio-table-data';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { iconsFA } from 'src/static-data/icons-fa';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { Router } from '@angular/router';
import { PlacementService } from '../core/http/placement.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { EditPlacementEmployeeComponent } from './edit-placement-employee/edit-placement-employee.component';
import { EmployeeMaster } from '../core/models/employeemaster';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { ViewPlacementEmployeeComponent } from './view-placement-employee/view-placement-employee.component';
import { EmployeeActivityLog } from '../core/models/employeeactivitylog';
import { TerminateEmployeeComponent } from './terminate-employee/terminate-employee.component';
import { UsersEditComponent } from 'src/app-public/modules/admin/users/users-edit/users-edit.component';
import { ConsultviteUser } from 'src/@shared/core/admin/models/consultvite-user';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { IconService } from 'src/@shared/services/icon.service';

@UntilDestroy()

@Component({
  selector: 'cv-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TimeZoneService,PlacementService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class EmployeesComponent implements OnInit {
  loginUser: LoginUser;
  subject$: ReplaySubject<EmployeeMaster[]> = new ReplaySubject<EmployeeMaster[]>(1);
  data$: Observable<EmployeeMaster[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<EmployeeMaster>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  searchCtrl = new FormControl();
  labels = BenchPriorityLabels;
  filteredIcons: string;
  employeeList:EmployeeMaster[]=[];
  
  ActivityLogs:EmployeeActivityLog[];
  selectedEmployeeId:number;
  selectedStatus:string = "Active";
  @ViewChild('activitylog',{static: true}) activitylog: MatSidenav;
  _refreshEmpListemitter = EmitterService.get("RefreshEmpList");
  @Input()
  columns: TableColumn<EmployeeMaster>[] = [
    { label: 'ID', property: 'ComapnyEmployeeID', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'WORKER NAME', property: 'WorkerName', type: 'button', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'TYPE', property: 'EmploymentType', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'WORK PERMIT', property: 'WorkStatus', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'WORK PERMIT EXP', property: 'WorkStatusExpiry', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'I94 Number', property: 'I94Number', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'I94 EXPIRY', property: 'I94ExpiryDate', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'PHONE', property: 'PrimaryPhoneNumber', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'EMAIL', property: 'Email', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'CV Website', property: 'WebsiteUser', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'STATUS', property: 'StatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private placementService:PlacementService,
    public iconService: IconService
  ) {
    this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetEmployees();
    }

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._refreshEmpListemitter.subscribe(res => {
      this.GetEmployees();
    })

  }
  GetEmployees() {
    this.placementService.GetEmployees(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.employeeList = response.Data;
        this.employeeList.forEach(ele=>{
          ele.WorkStatusExpiry=TimeZoneService.getLocalDateTime_Date(ele.WorkStatusExpiry, false);
          if (ele.I94ExpiryDate) {
            ele.I94ExpiryDate = TimeZoneService.getLocalDateTime_Date(ele.I94ExpiryDate, false);
          }
        })
        this.dataSource.data = this.employeeList;
        this.setDataSourceAttributes();
        this.filterStatus(1); //Active status 
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  AddEmployee() {
    this.dialog.open(AddEmployeeComponent, { width: '80%', panelClass: "dialog-class",disableClose:true }).afterClosed().subscribe((employee) => {
      if (employee) {
        this.GetEmployees();
      }
    });
  }
  updateEmployee(Employee:EmployeeMaster) {
    if(Employee.AssignmentStatus===1){
      this.dialog.open(EditPlacementEmployeeComponent, { width: '80%', panelClass: "dialog-class",data:Employee.EmployeeID,disableClose:true }).afterClosed().subscribe((employee) => {
        if (employee) {
          this.GetEmployees();
        }
      });
    
    }else{
      this.dialog.open(EditEmployeeComponent, { width: '80%', panelClass: "dialog-class",data:Employee.EmployeeID,disableClose:true }).afterClosed().subscribe((employee) => {
        if (employee) {
          this.GetEmployees();
        }
      });
    }
  }
  viewEmployee(Employee:EmployeeMaster){
    if(Employee.AssignmentStatus===1){
      this.dialog.open(ViewPlacementEmployeeComponent, { maxWidth: '95vw', width: '95vw', panelClass: "dialog-class",data:Employee.EmployeeID,disableClose:true }).afterClosed().subscribe((employee) => {
        if (employee) {
          if(employee==="Edit"){
            this.updateEmployee(Employee);
          }else if(employee==="Delete"){
          this.terminateEmployee(Employee);
          }
          else if(employee == "CreateUser"){
            this.addconsultantUser(Employee);
          }
          else if(employee == "LinkUser"){debugger;
            const empdata ={
              UserId:null,
              EmployeeId:Employee.EmployeeID,
              Email:Employee.Email,
              CompanyId:this.loginUser.Company.Id,
              UpdatedBy:this.loginUser.UserId
            }
            this.LinkWorkerToUser(empdata);
          }
        }
      });
    
    }else{
      this.dialog.open(ViewEmployeeComponent, {maxWidth: '95vw', width: '95vw', panelClass: "dialog-class",data:Employee.EmployeeID,disableClose:true }).afterClosed().subscribe((employee) => {
        if (employee) {
          if(employee==="Edit"){
            this.updateEmployee(Employee);
          }else if(employee==="Delete"){
          this.terminateEmployee(Employee);
          }
          else if(employee == "CreateUser"){
           this.addconsultantUser(Employee);
          }
          else if(employee == "LinkUser"){debugger;
            const empdata ={
              UserId:null,
              EmployeeId:Employee.EmployeeID,
              Email:Employee.Email,
              CompanyId:this.loginUser.Company.Id,
              UpdatedBy:this.loginUser.UserId
            }
            this.LinkWorkerToUser(empdata);
          }
        }
      });
    }
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'WorkerName': return item.LastName.toLowerCase(); // Ensuring case-insensitive sorting
        case 'WorkStatusExpiry': return new Date(item.WorkStatusExpiry);
        case 'I94ExpiryDate': return item.I94ExpiryDate ? new Date(item.I94ExpiryDate).getTime() : Number.MAX_VALUE;
        default: return item[property] || 'Z'; // Fallback for undefined values
      }
    };
  }
  
  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'WorkerName': return item.LastName.toLowerCase();
        case 'WorkStatusExpiry': return new Date(item.WorkStatusExpiry);
        case 'I94ExpiryDate': return item.I94ExpiryDate ? new Date(item.I94ExpiryDate).getTime() : Number.MAX_VALUE;
        default: return item[property] || 'Z';
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

  OnActiviyLogclose(){
    this.activitylog.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  ViewLogs(employee:EmployeeMaster){
    this.ActivityLogs=[];
    this.selectedEmployeeId = employee.EmployeeID;
    this.placementService.getEmployeeActiviyLog(this.selectedEmployeeId,this.loginUser.Company.Id)
    .subscribe(response =>{
      if(response.IsError==false){
        this.ActivityLogs = response.Data;
        this.ActivityLogs.forEach(
          log =>{
            log.CreatedDate = TimeZoneService.getLocalDateTime(log.CreatedDate, true);
          }
        )
        this.activitylog.open();
      }
      else{
        this._alertService.error(response.ErrorMessage);
      }
    },
    error => {
      this._alertService.error(error);
    });
  }

  filterStatus(status:number){
    if(status==1){
      this.selectedStatus="Active";
      this.dataSource.data = this.employeeList.filter(i=>i.Status==1);
    }
    else if(status==2){
     this.selectedStatus="Inactive";
     this.dataSource.data = this.employeeList.filter(i=>i.Status==2);
    }
    else if(status==0){
     this.selectedStatus="All";
     this.dataSource.data = this.employeeList;
    }
    
    if (!this.cdRef["distroyed"]) {
     this.cdRef.detectChanges();
   }
 }
 terminateEmployee(Employee:EmployeeMaster){
  this.dialog.open(TerminateEmployeeComponent, { width: '80%', panelClass: "dialog-class",data:Employee.EmployeeID,disableClose:true }).afterClosed().subscribe((employee) => {
    if (employee) {
      this.GetEmployees();
    }
  });
 }

 addconsultantUser(Employee:EmployeeMaster){
  let user = <ConsultviteUser>{};
      user.UserType = 0; //consultantuser
      user.FirstName = Employee.FirstName;
      user.LastName = Employee.LastName;
      user.Email= Employee.Email;
      user.PhoneNo = Employee.PrimaryPhoneNumber.replace(/\D+/g, "");
  this.dialog.open(UsersEditComponent, { 
    width: '60%', 
    panelClass: "dialog-class",
    data:user,
    disableClose:true }).afterClosed().subscribe((employee) => {
    if (employee) {
      const empdata ={
        UserId:employee.data.UserId,
        EmployeeId:Employee.EmployeeID,
        Email:Employee.Email,
        CompanyId:this.loginUser.Company.Id,
        UpdatedBy:this.loginUser.UserId
      }
      this.UpdateEmployeeWebsiteStatus(empdata);
    }
  });
 }

 UpdateEmployeeWebsiteStatus(empdata:any){
  this.placementService.UpdateEmployeeWebsiteStatus(empdata)
  .subscribe(response =>{
    if(response.IsError==false){
      this.GetEmployees();
    }
    else{
      this._alertService.error(response.ErrorMessage);
    }
  },
  error => {
    this._alertService.error(error);
  });
 }

 LinkWorkerToUser(empdata:any){
  this.placementService.LinkWorkerWithUser(empdata)
  .subscribe(response =>{
    if(response.IsError==false){
      this.GetEmployees();
      this._alertService.success(response.SuccessMessage);
    }
    else{
      this._alertService.error(response.ErrorMessage);
    }
  },
  error => {
    this._alertService.error(error);
  });
 }
}
