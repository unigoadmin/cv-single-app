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
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation'; 
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import icMap from '@iconify/icons-ic/twotone-map';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { iconsFA } from 'src/static-data/icons-fa';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { Router } from '@angular/router';
import { PlacementService } from '../core/http/placement.service';
import { AddTimesheetComponent } from './add-timesheet/add-timesheet.component';
import { TimesheetList } from '../core/models/timesheetlist';
import { TimeSheetFilter } from '../core/models/timesheetfilter';
import { ViewTimesheetComponent } from './view-timesheet/view-timesheet.component';
import { TimesheetNotesComponent } from './timesheet-notes/timesheet-notes.component';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import icComment from '@iconify/icons-ic/twotone-comment';
import { TimesheetActivityLog } from '../core/models/timesheetactivitylog';
import { TimesheetService } from '../core/http/timesheet.service';
import icClose from '@iconify/icons-ic/twotone-close';
import icEvent from '@iconify/icons-ic/event';

@UntilDestroy()
@Component({
  selector: 'cv-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TimeZoneService, PlacementService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class TimesheetsComponent implements OnInit {
  loginUser: LoginUser;
  subject$: ReplaySubject<TimesheetList[]> = new ReplaySubject<TimesheetList[]>(1);
  data$: Observable<TimesheetList[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<TimesheetList>();
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
  icClose=icClose;
  icFormattedList=icFormattedList;
  icEye = icEye;
  icvieweye = icEye;
  icComment=icComment;
  icEvent=icEvent;
  filteredIcons: string;
  timesheetList: TimesheetList[] = [];
  timeSheetFilter: TimeSheetFilter = new TimeSheetFilter();
  status_textClass: any = 'text-amber-contrast';
  status_bgClass: any = 'bg-amber';
  selectedTimesheetId:number;
  ActivityLogs:TimesheetActivityLog[];
  selectedStatus:string = "All";
  @Input()
  columns: TableColumn<TimesheetList>[] = [
    { label: 'ID', property: 'CompanyTimesheetID', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'STATUS', property: 'StatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'PERIOD', property: 'DatePeriod', type: 'text', visible: true, cssClasses: ['font-medium', 'textcgs'] },
    { label: 'ASSIGNMENT NAME', property: 'AssignmentName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'STANDARD HOURS', property: 'StdHours', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'OVERTIME HOURS', property: 'OTHours', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'TOTAL HOURS', property: 'TotalHours', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  @ViewChild('activitylog',{static: true}) activitylog: MatSidenav;
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private placementService: PlacementService,
    private timesheetService:TimesheetService
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
      this.GetTimesheets();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetTimesheets() {
    this.timeSheetFilter.CompanyId = this.loginUser.Company.Id;
    this.timeSheetFilter.EmployeeId = this.loginUser.EmployeeID;
    this.timeSheetFilter.UserId = this.loginUser.UserId;
    this.placementService.GetTimesheets(this.timeSheetFilter).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.timesheetList = response.Data;
        this.timesheetList.forEach(ele => {
          ele.StartDate = TimeZoneService.getLocalDateTime_Date(ele.StartDate, false);
          ele.EndDate = TimeZoneService.getLocalDateTime_Date(ele.EndDate, false);
          ele.DatePeriod = ele.StartDate + " - " + ele.EndDate;
        })
        this.dataSource.data = this.timesheetList;
        this.setDataSourceAttributes();
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  AddTimeSheet(row:TimesheetList) {
    this.dialog.open(AddTimesheetComponent, { panelClass: "dialog-class" ,data:row.TimesheetID,disableClose: true,width: '80%'}).afterClosed().subscribe((res) => {
      if (res) {
        this.GetTimesheets();
      }
    });
  }
  viewTimeSheet(row) {
    this.dialog.open(ViewTimesheetComponent, { panelClass: "dialog-class" ,data:row.TimesheetID,disableClose: true,width: '80%'}).afterClosed().subscribe((res) => {
      if (res) {
       if(res==="Edit" || res==="Revise"){
         this.AddTimeSheet(row);
       }
      }
    });
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  sortData(sort: MatSort) {
    this.sort = sort;
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

  ViewNotes(currenttimesheet: TimesheetList){
    this.dialog.open(TimesheetNotesComponent, {
      data: currenttimesheet, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
       // this.GetAllCompanyInterviews(this.loginUser.Company.Id,this.loginUser.UserId);
      }
    });
  }

  ViewLogs(currenttimesheet: TimesheetList){
    this.ActivityLogs=[];
    this.selectedTimesheetId = currenttimesheet.TimesheetID;
    this.timesheetService.GetTimesheetActivityLogs(currenttimesheet.TimesheetID,this.loginUser.Company.Id)
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

  OnActiviyLogclose(){
    this.activitylog.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  filterStatus(status:number){
    if(status==2){
      this.selectedStatus="Approved";
      this.dataSource.data = this.timesheetList.filter(i=>i.status==2);
    }
    else if(status==3){
     this.selectedStatus="Rejected";
     this.dataSource.data = this.timesheetList.filter(i=>i.status==3);
    }
    else if(status==4){
     this.selectedStatus="Submitted";
     this.dataSource.data = this.timesheetList.filter(i=>i.status==4);
    }
    else if(status==5){
     this.selectedStatus="Draft";
     this.dataSource.data = this.timesheetList.filter(i=>i.status==5);
    }
    else if(status==6){
      this.selectedStatus="Invoiced";
      this.dataSource.data = this.timesheetList.filter(i=>i.status==6);
     }
    else if(status==0){
     this.selectedStatus="All";
     this.dataSource.data = this.timesheetList;
    }
    
    if (!this.cdRef["distroyed"]) {
     this.cdRef.detectChanges();
   }
 }



 
}
