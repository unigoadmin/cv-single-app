import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { iconsFA } from 'src/static-data/icons-fa';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IconService } from 'src/@shared/services/icon.service';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { JobsHotList } from '../core/model/jobshotlist';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { JobsHotListService } from '../core/http/jobs-hotlist.service';
import { AddJobComponent } from '../jobs-dashboard/add-job/add-job.component';
import { ExistingJobsComponent } from '../requisitions-responses/existing-jobs/existing-jobs.component';
import { JobsHotlistEmailSettingsComponent } from './jobs-hotlist-email-settings/jobs-hotlist-email-settings.component';
import { MatSidenav } from '@angular/material/sidenav';

@UntilDestroy()
@Component({
  selector: 'cv-jobs-hot-list',
  templateUrl: './jobs-hot-list.component.html',
  styleUrls: ['./jobs-hot-list.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms
  ],
  providers: [JobsHotListService]
})
export class JobsHotListComponent implements OnInit {

  loginUser: LoginUser;
  subject$: ReplaySubject<JobsHotList[]> = new ReplaySubject<JobsHotList[]>(1);
  data$: Observable<JobsHotList[]> = this.subject$.asObservable();
  dataSource = new MatTableDataSource<JobsHotList>();
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
  IsLoading: boolean = false;
  searchCtrl = new FormControl();
  filteredIcons: string;
  DialogResponse: ConfirmDialogModelResponse;
  jobsHotListData: JobsHotList[] = [];
  currentHotlist: JobsHotList = new JobsHotList();
  IsSubLoading: boolean = false;
  dialogRef: any;
  @ViewChild('hotlistModal') rsDialog = {} as TemplateRef<any>;
  @ViewChild('activitylog', { static: true }) activitylog: MatSidenav;
  HotlistForm: FormGroup;
  StatusColorCodes = [];
  ActivityLogs: any[];
  selectedHotListId: number;
  @Input()
  columns: TableColumn<JobsHotList>[] = [
    { label: 'Sno', property: 'HotListId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Hotlist Name', property: 'HotListName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Description', property: 'Description', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Jobs', property: 'MappedJobs', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Created Date', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium', 'textcgs'] },
    { label: 'Status', property: 'StatusName', type: 'button', visible: true },
    { label: 'Notes', property: 'ActivityLogs', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    public iconService: IconService,
    private _jobscentralService: JobsHotListService,
    private jobhotlistService: JobsHotListService,

  ) {
    this.dataSource = new MatTableDataSource();
    this.HotlistForm = this._formBuilder.group({
      'HotListName': ['', [Validators.required]],
      'Description': ['', [Validators.required]],
    });

  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  _updateemitter = EmitterService.get("UpdateJobHotListMapping");

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      EmitterService.get("JobCentral").emit("JobCentral");
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetJobsHotList();
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._updateemitter.subscribe(res => {
      this.GetJobsHotList();
    })
  }

  GetJobsHotList() {
    this._jobscentralService.GetJobsHotList(this.loginUser.Company.Id, this.loginUser.UserId).subscribe(response => {
      if (!response.IsError) {
        this.jobsHotListData = response.Data;
        this.jobsHotListData.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        this.dataSource.data = this.jobsHotListData;
      }
      this.setDataSourceAttributes();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }
  createHotList() {
    this.currentHotlist = new JobsHotList();
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });
    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetJobsHotList();
      }
    });
  }

  editHotList(tag: JobsHotList) {
    this.currentHotlist = tag;
    this.currentHotlist.HotListName = tag.HotListName;
    this.dialogRef = this.dialog.open(this.rsDialog,
      { width: '40%', panelClass: "dialog-class", disableClose: true });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response == true) {
        this.GetJobsHotList();
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

  SaveHotList() {debugger;
    this.IsSubLoading = true;
    if (this.currentHotlist.HotListName == null || this.currentHotlist.HotListName.trim() == '') {
      this._alertService.error("Please Enter HotList Name.");
      this.IsSubLoading = false;
      return;
    }

    if (this.currentHotlist.HotListId && this.currentHotlist.HotListId > 0) {
      this.currentHotlist.UpdatedBy = this.loginUser.UserId;
    }
    else {
      this.currentHotlist.CreatedBy = this.loginUser.UserId;
      this.currentHotlist.Status = 1;
    }

    this.currentHotlist.CompanyId = this.loginUser.Company.Id;

    this._jobscentralService.SaveJobsHotList(this.currentHotlist)
      .subscribe(
        response => {
          if (response.IsError == true) {
            this._alertService.error(response.ErrorMessage);
          }
          else {
            this._alertService.success(response.SuccessMessage);
            this.IsSubLoading = false;
            this.dialogRef.close(true);
          }
        },
        error => {
          this.IsSubLoading = false;
          this._alertService.error(error);
        }
      );
  }

  ViewJobs(row: JobsHotList) {
    this.dialog.open(ExistingJobsComponent, {
      data: { JobStatus: 3, RequisitionId: row.HotListId, IsMappingJobs: true, model: 'onlyjobs', src: 'hotlist' }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {

      }
    });
  }

  MapNewJob(row: JobsHotList) {
    this.dialog.open(AddJobComponent, {
      data: { RequisitionId: 1, model: 'single', mode: "Add Job", Id: 0 }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        debugger;
        this.MapNewJobToHotList(response, row.HotListId);
        
      }
    });
  }

  MapExistingJob(row: JobsHotList) {
    this.dialog.open(ExistingJobsComponent, {
      data: { JobStatus: 3, RequisitionId: row.HotListId, IsMappingJobs: false, model: 'single', src: 'hotlist' }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {

      }
    });
  }

  ShareJobList(row: JobsHotList) {
    this.dialog.open(JobsHotlistEmailSettingsComponent, {
      data: { HotListId: row.HotListId }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {

      }
    });
  }

  ViewLogs(row: JobsHotList) {
    this.ActivityLogs = [];
    this.activitylog.open();
    this.selectedHotListId = row.HotListId;
    this._jobscentralService.GetHotListActivityLogs(this.selectedHotListId, this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.ActivityLogs = response.Data;
          this.ActivityLogs.forEach(
            log => {
              log.CreatedDate = TimeZoneService.getLocalDateTime(log.CreatedDate, true);
            }
          )
          this.activitylog.open();
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        });
  }

  OnActiviyLogclose() {
    this.activitylog.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }


  MapNewJobToHotList(JobId: number, HotListId: number) {debugger;
    const HotListMapping = {
      JobId: JobId,
      HotListId: HotListId,
      MappingStatus: true,
      CreatedBy: this.loginUser.UserId,
      UpdatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id,
      IsPublishJob: true
    }

    this.jobhotlistService.MapJob_HotList(HotListMapping)
      .subscribe(response => {
        if (!response.IsError) {
          this.GetJobsHotList();
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        })
  }


}
