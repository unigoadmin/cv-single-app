import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { InterviewsService } from '../core/http/interviews.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InterviewList } from '../core/models/interviewslist';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { InterviewStatus } from '../core/models/Interviewstatuslist';
import iclocationon from '@iconify/icons-ic/location-on';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import { MatSelectChange } from '@angular/material/select';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icSearch from '@iconify/icons-ic/twotone-search';
import { ActivityLogSubmission } from '../core/models/submissionactivitylog';
import {SubmissionService} from '../core/http/submissions.service';
import { MatSidenav } from '@angular/material/sidenav';
import icClose from '@iconify/icons-ic/twotone-close';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { EditInterviewComponent } from './edit-interview/edit-interview.component';
import { InterviewNotesComponent } from './interview-notes/interview-notes.component';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import icFormattedList from '@iconify/icons-ic/twotone-format-list-bulleted';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { iconsFA } from 'src/static-data/icons-fa';
import icschedule from '@iconify/icons-ic/schedule';
import { SubUsers } from  'src/@shared/models/common/subusers';
import { assign } from 'src/@shared/models/assign';
import { BenchCandidateService } from '../bench-candidates/bench-candidates.service';
import { merge } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';

@UntilDestroy()
@Component({
  selector: 'cv-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService, InterviewsService]
})
export class InterviewsComponent implements OnInit {

  loginUser: LoginUser;
  InterviewStatusList:InterviewStatus[];
  schedules: InterviewList[] = [];
  dataSource = new MatTableDataSource<InterviewList>();
  sort: MatSort;
  paginator: MatPaginator;
  pageSize = 10;
  statusLabels : any[] =[];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  searchCtrl = new FormControl();
  status_textClass:any='text-amber-contrast';
  status_bgClass:any='bg-amber';
  iclocationon=iclocationon;
  icMoreHoriz=icMoreHoriz;
  icEdit=icEdit;
  icFilterList=icFilterList;
  icSearch=icSearch;
  icClose=icClose;
  icInsertComment=icInsertComment;
  icFormattedList=icFormattedList;
  ActivityLogs:ActivityLogSubmission[];
  selectedSubmissionId:number;
  filteredIcons: string;
  icschedule=icschedule;
  assignees: assign[] =[];
  benchSubUsers: SubUsers[];
  selectedAssignee:string ="All";
  SelectedAssingValue:string=null;
  @Input()
  columns: TableColumn<InterviewList>[] = [
    { label: 'Candidate', property: 'CandidateName', type: 'text', visible: true, cssClasses: [ 'font-medium', 'textcgs'] },
    { label: 'Client / Vendor', property: 'Client', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Location', property: 'Location', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Intv Type', property: 'InterviewTypeName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Intv Date', property: 'InterviewDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Duration', property: 'InterviewDuration', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Intv Round', property: 'InterviewRoundName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Status', property: 'InterviewStatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'POC', property: 'SubmittedByName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  @ViewChild('activitylog',{static: true}) activitylog: MatSidenav;
  constructor(
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private interviewService: InterviewsService,
    private submissionService:SubmissionService,
    private _service: BenchCandidateService,
    private permissionsService: NgxPermissionsService
  ) {
    this.dataSource = new MatTableDataSource();
    this.InterviewStatusList=[];
   }

   get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.getBenchSubUsers();
      this.getInterviewStatusList(this.loginUser.Company.Id);
      
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'InterviewDate': return new Date(item.InterviewDate);
        default: return item[property];
      }
    };
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'InterviewDate': return new Date(item.InterviewDate);
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



  getInterviewStatusList(CompanyId: number) {
    this.interviewService.GetInterviewStatusLabels(CompanyId)
      .subscribe(response => {
        if(response.IsError==false)
        this.statusLabels = response.Data;
        this.GetAllCompanyInterviews();
      },
        error => {
          this._alertService.error(error); 
        }
      );
  }

  GetAllCompanyInterviews() {
    const interviewVM = {
      CompanyId:this.loginUser.Company.Id,
      UserId:this.loginUser.UserId,
      POC:this.SelectedAssingValue
    }
    this.interviewService.GetAllInterviews(interviewVM).subscribe(response => {
      if (response.IsError == false) {
        this.schedules = response.Data;
        this.schedules.forEach(element => {
          element.LastUpdatedDate = TimeZoneService.getLocalDateTime_Date(element.LastUpdatedDate, true);
          element.InterviewDate = TimeZoneService.getFormattedDateTime(element.InterviewDate);
        });
        this.dataSource.data = this.schedules;
        this.setDataSourceAttributes();
        if (!this.cdr["distroyed"]) {
          this.cdr.detectChanges();
        }
      }

    }, error => {
      this._alertService.error(error);
    }
    );
  }

  editInterview(CurrentInterview: InterviewList){
    var editPermission = this.permissionsService.getPermission('ACTION_INTERVIEWS_MODIFY');
    if(editPermission){
      this.dialog.open(EditInterviewComponent, {
        data: CurrentInterview, width: '60%',disableClose:true
      }).afterClosed().subscribe(response => {
        if (response) {
          this.GetAllCompanyInterviews();
        }
      });
    }
   
  }

  ViewNotes(CurrentInterview: InterviewList){
    this.dialog.open(InterviewNotesComponent, {
      data: CurrentInterview, width: '60%',disableClose:true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.GetAllCompanyInterviews();
      }
    });
  }

  ViewLogs(CurrentInterview: InterviewList){
    this.ActivityLogs=[];
    this.selectedSubmissionId = CurrentInterview.SubmissionId;
    this.interviewService.GetInterviewActivityLog(this.loginUser.Company.Id,CurrentInterview.ScheduleId)
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

  onLabelChange(change: MatSelectChange,CurrentInterview:InterviewList){
    const index = this.schedules.findIndex(c => c === CurrentInterview);
    var selectedStatus = change.value;
    this.schedules[index].InterviewStatusName = selectedStatus.StatusName;
    this.schedules[index].InterviewStatus = selectedStatus.Id;
    this.schedules[index].bgClass = selectedStatus.bgClass;
    const Psubmission = {
      ScheduleID:CurrentInterview.ScheduleId,
      SubmissionID: CurrentInterview.SubmissionId,
      CompanyId: this.loginUser.Company.Id,
      Status: selectedStatus.Id,
      UpdatedBy: this.loginUser.UserId
    };
    this.interviewService.UpdateInterviewStatus(Psubmission)
      .subscribe(
        response => {
          if(response.IsError==false){
            this._alertService.success(response.SuccessMessage);
          }
         
        },
        error => {
          this._alertService.error(error);
        }
      );

      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
  }


  OnActiviyLogclose(){
    this.activitylog.close();
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.assignees.push({name:'ALL',value:null,email:null,mapping:false});
    this._service.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId,email:y.PrimaryEmail,mapping:true });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  filterByAssignee(selectedItem:assign){
    this.selectedAssignee=selectedItem.name;
    this.SelectedAssingValue = selectedItem.value;
    this.GetAllCompanyInterviews();
  }


 
}
