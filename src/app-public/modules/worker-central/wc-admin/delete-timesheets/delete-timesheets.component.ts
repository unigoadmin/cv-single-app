import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icSearch from '@iconify/icons-ic/twotone-search';
import icClose from '@iconify/icons-ic/twotone-close';
import icComment from '@iconify/icons-ic/twotone-comment';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { TimesheetManagerList } from '../../core/models/tsmanagerlist';
import { TimeSheetFilter } from '../../core/models/timesheetfilter';
import { TimesheetService } from '../../core/http/timesheet.service';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import { TimesheetActivityLog } from '../../core/models/timesheetactivitylog';
import { MatSidenav } from '@angular/material/sidenav';
import { iconsFA } from 'src/static-data/icons-fa';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { TimesheetNotesComponent } from '../../timesheets/timesheet-notes/timesheet-notes.component';
import { AddTimesheetComponent } from '../../timesheets/add-timesheet/add-timesheet.component';
import { ManagerViewComponent } from '../../timesheets/manager-view/manager-view.component';
import { DeleteConformDialogComponent } from '../delete-conform-dialog/delete-conform-dialog.component';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel' ;
import { Router } from '@angular/router';


@UntilDestroy()
@Component({
  selector: 'cv-delete-timesheets',
  templateUrl: './delete-timesheets.component.html',
  styleUrls: ['./delete-timesheets.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class DeleteTimesheetsComponent implements OnInit {

  loginUser: LoginUser;
  timesheetList: TimesheetManagerList[] = [];
  timeSheetFilter: TimeSheetFilter = new TimeSheetFilter();
  icFilterList = icFilterList;
  icEdit = icEdit;
  icSearch = icSearch;
  icEye = icEye;
  icFormattedList = icFormattedList;
  icClose = icClose;
  icComment = icComment;
  icLayers=icLayers;
  icBack=icBack;
  subject$: ReplaySubject<TimesheetManagerList[]> = new ReplaySubject<TimesheetManagerList[]>(1);
  data$: Observable<TimesheetManagerList[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<TimesheetManagerList>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selection = new SelectionModel<TimesheetManagerList>(true, []);
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  searchCtrl = new FormControl();
  DialogResponse:ConfirmDialogModelResponse;
  dashboardtype: any = "0";
  ActivityLogs: TimesheetActivityLog[];
  selectedTimesheetId: number;
  selectedStatus: string = "Pending Approvals";
  selectedStatusValue:number = 4;
  @Input()
  columns: TableColumn<TimesheetManagerList>[] = [  
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'STATUS', property: 'StatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'ID', property: 'CompanyTimesheetID', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'PERIOD', property: 'StartDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'WORKER NAME', property: 'EmployeeName', type: 'text', visible: true, cssClasses: ['font-medium', 'textcgs'] },
    { label: 'ASSIGNMENT NAME', property: 'AssignmentName', type: 'text', visible: true, cssClasses: ['font-medium', 'textcgs'] },
    { label: 'STD HOURS', property: 'StdHours', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs',] },
    { label: 'OT HOURS', property: 'OTHours', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'TOTAL HOURS', property: 'TotalHours', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
   
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  @ViewChild('activitylog', { static: true }) activitylog: MatSidenav;
  filteredIcons: string;
  StartDate: Date = null;
  EndDate: Date = null;
  start: FormControl = new FormControl();
  end: FormControl = new FormControl();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  isLoadpage:boolean=false;
  constructor(
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private timeSheetService: TimesheetService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      //this.GetPendingApprovals();
      this.GetTimesheetData();
    }
    var date = new Date();
    //this.StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    //this.EndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  GetAllTimeSheet() {
    this.isLoadpage=true;
    this.timeSheetFilter.CompanyId = this.loginUser.Company.Id;
    this.timeSheetFilter.ManagerId =this.loginUser.UserId; 
    this.timeSheetFilter.StartDate = this.StartDate;
    this.timeSheetFilter.EndDate = this.EndDate;
    this.timeSheetService.GetTimesheetsManagerView(this.timeSheetFilter).subscribe(response => {
      this.timesheetList = response.Data;
      this.dataSource.data = this.timesheetList;
      this.setDataSourceAttributes();
      this.isLoadpage=false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }

    }, error => {
      this.isLoadpage=false;
      this._alertService.error(error);
    })
  }

  

  GetTimesheetData() {
    this.timeSheetFilter.CompanyId = this.loginUser.Company.Id;
    this.timeSheetFilter.ManagerId = this.loginUser.UserId;
    this.timeSheetFilter.Status = this.selectedStatusValue;
    if (this.StartDate != null) {
      let StDate: any = moment(this.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.timeSheetFilter.StartDate = StDate;
    }
    else {
      this.timeSheetFilter.StartDate = this.StartDate;
    }
    
    if (this.EndDate != null) {
      let ETDate: any = moment(this.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.timeSheetFilter.EndDate = ETDate;
    }
    else {
      this.timeSheetFilter.EndDate = this.EndDate;
    }
    this.timeSheetService.GetTimesheetsManagerView(this.timeSheetFilter).subscribe(response => {
      this.timesheetList = response.Data;
      this.dataSource.data = this.timesheetList;
      this.setDataSourceAttributes();
      this.isLoadpage=false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }

    }, error => {
      this.isLoadpage=false;
      this._alertService.error(error);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })
  }

  ClearFilterDates(){
    this.selection.clear();
    this.StartDate = null;
    this.EndDate = null;
    this.GetTimesheetData();
  }

  toggleChange(event) {
    this.selection.clear();
    this.isLoadpage=true;
    this.timeSheetFilter = new TimeSheetFilter();
    if (event === 0) {
      this.selectedStatus="All";
      this.selectedStatusValue=0;
      this.GetAllTimeSheet();
    }
    else if (event === 2) {
      this.selectedStatus="Approved";
      this.selectedStatusValue=2;
      this.GetTimesheetData();
    }
    else if(event === 3){
      this.selectedStatus="Rejected";
      this.selectedStatusValue=3;
      this.GetTimesheetData();
    }
    else if(event === 4){
      this.selectedStatus="Pending Approval";
      this.selectedStatusValue=4;
      this.GetTimesheetData();
    }
    else if(event === 5){
      this.selectedStatus="Draft";
      this.selectedStatusValue=5;
      this.GetTimesheetData();
    }
    else if(event === 6){
      this.selectedStatus="Invoiced";
      this.selectedStatusValue = 6;
      this.GetTimesheetData();
    }


  }

  ViewLogs(currenttimesheet: TimesheetManagerList){
    this.ActivityLogs=[];
    this.selectedTimesheetId = currenttimesheet.TimesheetID;
    this.timeSheetService.GetTimesheetActivityLogs(this.selectedTimesheetId,this.loginUser.Company.Id)
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
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  OnActiviyLogclose(){
    this.activitylog.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  ViewNotes(currenttimesheet: TimesheetManagerList){
    this.dialog.open(TimesheetNotesComponent, {
      data: currenttimesheet, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      
      }
    });
  }

  UpdateTimeSheet(row:TimesheetManagerList) {
    this.dialog.open(AddTimesheetComponent, { panelClass: "dialog-class" ,data:row.TimesheetID,width:'80%'}).afterClosed().subscribe((res) => {
      if (res) {
        if(this.selectedStatusValue!=0){
          this.GetTimesheetData();
        }
        else{
          this.GetAllTimeSheet();
        }
      }
    });
  }

  ManagerView(row:TimesheetManagerList){
    this.dialog.open(ManagerViewComponent, { panelClass: "dialog-class" ,data:row.TimesheetID,width:'80%'}).afterClosed().subscribe((res) => {
      if (res) {
        if(res==="Edit" || res==="Revise"){
          this.UpdateTimeSheet(row);
        }else{
          if(this.selectedStatusValue!=0){
            this.GetTimesheetData();
          }
          else{
            this.GetAllTimeSheet();
          }
        }
      }
    });
  }
  resetClick(){
    this.isLoadpage=true;
    this.searchCtrl.reset();
    this.StartDate=null;
    this.EndDate=null;
    this.selectedStatus="Pending Approvals";
    this.selectedStatusValue=4;
    this.GetTimesheetData();
  }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  ConfirmDeleteTimesheets() {
    if (this.selection.hasValue) {
      const message = 'The selected timesheets will be deleted ?'
      const dialogData = new ConfirmDialogModel("Timesheet Delete", message);

      const dialogRef = this.dialog.open(DeleteConformDialogComponent, {
        width: '60%',
        data: dialogData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.DialogResponse = dialogResult;
        if (this.DialogResponse.Dialogaction == true) {
          this.OnDeleteTimesheets(this.DialogResponse.Notes);
        }
      });
    }

  }

  OnDeleteTimesheets(DeleteNotes:string){
    if(this.selection.hasValue){
      const RemovedTimesheets = {
        UpdatedBy:this.loginUser.UserId,
        CompanyId:this.loginUser.Company.Id,
        TimesheetIDs:this.selection.selected.map(({ TimesheetID }) => TimesheetID),
        Notes:DeleteNotes
      }
      this.timeSheetService.DeleteTimesheets(RemovedTimesheets).subscribe(result => {
        if(result.IsError==false){
          this._alertService.success(result.SuccessMessage);
          this.selection.clear();
          if(this.selectedStatusValue!=0){
            this.GetTimesheetData();
          }
          else{
            this.GetAllTimeSheet();
          }
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        }
        else{
          this._alertService.error(result.ErrorMessage);
        }
      })
    }
  }
  backClick(){
this.router.navigateByUrl('/worker-central/wc-admin')
  }

}
