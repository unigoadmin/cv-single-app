import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { BenchPriorityLabels } from 'src/static-data/aio-table-data';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import iclocationon from '@iconify/icons-ic/location-on';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSelectChange } from '@angular/material/select';
import icMap from '@iconify/icons-ic/twotone-map';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import { iconsFA } from 'src/static-data/icons-fa';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { Router } from '@angular/router';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { PlacementService } from '../core/http/placement.service';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { AssignmentList } from '../core/models/assignmentlist';
import { ViewAssignmentComponent } from './view-assignment/view-assignment.component';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import { AssignmentActivityLog } from '../core/models/assignmentActivityLog';
import icClose from '@iconify/icons-ic/twotone-close';

@UntilDestroy()

@Component({
  selector: 'cv-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
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
export class AssignmentsComponent implements OnInit {
  loginUser: LoginUser;
  subject$: ReplaySubject<AssignmentList[]> = new ReplaySubject<AssignmentList[]>(1);
  data$: Observable<AssignmentList[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<AssignmentList>();
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
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  iclocationon = iclocationon;
  icPersonAdd = icPersonAdd;
  icDoneAll = icDoneAll;
  icEye = icEye;
  icFormattedList=icFormattedList;
  icClose=icClose;
  icAssigment=icAssigment;
  filteredIcons: string;
  //confirmationList:AssignmentMaster[]=[];
  public assignmentList: AssignmentList[]=[];
  status_textClass:any='text-amber-contrast';
  status_bgClass:any='bg-amber';
  ActivityLogs:AssignmentActivityLog[];
  selectedAssignmentId:number;
  @ViewChild('activitylog',{static: true}) activitylog: MatSidenav;
  selectedStatus:string = "Active";
  @Input()
  columns: TableColumn<AssignmentList>[] = [
    { label: 'ID', property: 'CompanyAssignmentId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'CATEGORY', property: 'AsmtCategoryName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Name', property: 'AssignmentName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'FIRST NAME', property: 'FirstName', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'LAST NAME', property: 'LastName', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'START DATE', property: 'StartDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'END DATE', property: 'EndDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'STATUS', property: 'StatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'TIMESHEET', property: 'Timesheet', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'CLASSIFICATION', property: 'AsmtClassification', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
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
    private placementService:PlacementService
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
      this.GetAllAssignments();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetAllAssignments() {
    this.placementService.GetAllAssignments(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.assignmentList = response.Data;
        this.assignmentList.forEach(element => {
          element.StartDate = TimeZoneService.getLocalDateTime_Date(element.StartDate, false);
          if(element.EndDate){
            element.EndDate = TimeZoneService.getLocalDateTime_Date(element.EndDate, false);
          }
          element.FirstName=element.EmployeeMaster.FirstName;
          element.LastName=element.EmployeeMaster.LastName;
        });
        this.dataSource.data = this.assignmentList;
        this.filterStatus(1); //Actve status
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  updateCustomer(row) {

  }
  AddAssignment() {
    this.dialog.open(AddAssignmentComponent, { width: '80%', panelClass: "dialog-class",disableClose:true }).afterClosed().subscribe((emp) => {
      if (emp) {
       this.GetAllAssignments();
      }
    });
  }
  updateAssignment(Assign:AssignmentList) {
    this.dialog.open(EditAssignmentComponent, { width: '80%', panelClass: "dialog-class",data:Assign.AssignmentID,disableClose:true }).afterClosed().subscribe((ass) => {
      if (ass) {
        //this._alertService.success('Assignment updated successfully');
        this.GetAllAssignments();
      }
    });
  }
  viewAssignment(Assign:AssignmentList){
    this.dialog.open(ViewAssignmentComponent, { width: '80%', panelClass: "dialog-class",data:Assign.AssignmentID,disableClose:true }).afterClosed().subscribe((ass) => {
      if (ass) {
        if(ass==="Edit"){
          this.updateAssignment(Assign)
        }
      }
    });
    
  }
  
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
         case 'EndDate': return new Date(item.EndDate);
         case 'StartDate':return new Date(item.StartDate);
         default: return item[property];
      }
    };
  }
  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'EndDate': return new Date(item.EndDate);
        case 'StartDate':return new Date(item.StartDate);
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

  OnActiviyLogclose(){
    this.activitylog.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  ViewLogs(Assign:AssignmentList){
    this.ActivityLogs=[];
    this.selectedAssignmentId = Assign.AssignmentID;
    this.placementService.getAssignmentActiviyLog(this.selectedAssignmentId,this.loginUser.Company.Id)
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
      this.dataSource.data = this.assignmentList.filter(i=>i.Status==1);
    }
    else if(status==2){
     this.selectedStatus="Inactive";
     this.dataSource.data = this.assignmentList.filter(i=>i.Status==0);
    }
    else if(status==0){
     this.selectedStatus="All";
     this.dataSource.data = this.assignmentList;
    }
    
    if (!this.cdRef["distroyed"]) {
     this.cdRef.detectChanges();
   }
 }

}
