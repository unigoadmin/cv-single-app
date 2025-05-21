import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { merge, Observable, of, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { BenchPriorityLabels } from 'src/static-data/aio-table-data';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSelectChange } from '@angular/material/select';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { SubmissionService } from '../core/http/submissions.service';
import { SubmissionsList } from '../core/models/submissionlist';
import { MaterSubmissionStatus } from  '../core/models/matersubmissionstatus';
import { EditSubmitComponent } from '../bench-candidates/edit-submit/edit-submit.component';
import { ActivityLogSubmission } from '../core/models/submissionactivitylog';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { MigrateConfirmationComponent } from './migrate-confirmation/migrate-confirmation.component';
import { UserModules, UserRoles } from 'src/@cv/models/accounttypeenum';
import { iconsFA } from 'src/static-data/icons-fa';
import { assign } from 'src/@shared/models/assign';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { BenchCandidateService } from '../bench-candidates/bench-candidates.service';
import { debounceTime, distinct } from 'rxjs/operators';
import { QuickSubmitComponent } from '../bench-candidates/quick-submit/quick-submit.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { IconService } from 'src/@shared/services/icon.service';

@UntilDestroy()
@Component({
  selector: 'cv-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService, SubmissionService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class SubmissionsComponent implements OnInit {
  loginUser: LoginUser;
  subject$: ReplaySubject<SubmissionsList[]> = new ReplaySubject<SubmissionsList[]>(1);
  data$: Observable<SubmissionsList[]> = this.subject$.asObservable();
  submissions: SubmissionsList[] = [];
  dataSource = new MatTableDataSource<SubmissionsList>();
  currentPage = 0;
  totalRows = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];


  searchCtrl = new FormControl();
  labels = BenchPriorityLabels;
  filteredIcons: string;
  SubmissionStatusList: MaterSubmissionStatus[];
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  selectedSubmissionId: number;
  ActivityLogs: ActivityLogSubmission[];
  public candidateName: string;
  //MigrationPermission: boolean = false;
  assignees: assign[] = [];
  benchSubUsers: SubUsers[];
  selectedAssignee: string = "All";
  SelectedAssingValue: string = null;
  searchLoaded: boolean = false;
  isLoadpage:boolean=false;
  @Input()
  columns: TableColumn<SubmissionsList>[] = [
    { label: 'Id', property: 'CompanySubmissionID', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Type', property: 'SubmissionTypeName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Candidate', property: 'candidateName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Client / Vendor', property: 'Client', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Location', property: 'Location', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Sub Date', property: 'SubmittedDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'SchedulesCount', property: 'SchedulesCount', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Rate ($/hr)', property: 'SubmissionRate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'SubmissionStatusName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Sales Rep', property: 'SubmittedByName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Activity', property: 'actions', type: 'button', visible: true }
  ];
  @ViewChild('interviewslistpanel', { static: true }) interviewslistpanel: MatSidenav;
  @ViewChild('activitylog', { static: true }) activitylog: MatSidenav;
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private submissionService: SubmissionService,
    private _eventemitterservice: EventEmitterService,
    private _service: BenchCandidateService,
    private permissionsService: NgxPermissionsService,
    public iconService: IconService,
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();
    this.ActivityLogs = [];
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }



  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.getSubmissionStatusList(this.loginUser.Company.Id);
      this.getSubmissionsData(null);
      //this.MigrationPermission = this.CheckConvertToConfirmationPermission();

    }
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._eventemitterservice.submissionUpdateEvent.subscribe(() => {
      this.getSubmissionsData(null);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setDataSourceAttributes();
  }

  getSubmissionsData(SearchValue: string) {
    this.isLoadpage = true;
    this.submissions = [];
    const submissionVM = {
      CompanyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      POC: this.SelectedAssingValue,
      SearchByText: SearchValue,
      PageIndex: this.currentPage,
      PageSize: this.pageSize
    }
    this.submissionService.GetAllSubmissions(submissionVM).subscribe(response => {
      if (response.IsError == false && response.Data != null) {
        this.totalRows = response.TotalRecords;
        this.submissions = response.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.submissions.forEach(element => {
          element.SubmittedDate = TimeZoneService.getLocalDateTime_Date(element.SubmittedDate, true);
        });

        this.dataSource.data = this.submissions;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadpage = false;
        if (!this.cdr["distroyed"]) {
          this.cdr.detectChanges();
        }
      }
      else {
        this.isLoadpage = false;
        this.submissions = [];
        this.dataSource.data = this.submissions;
        if (!this.cdr["distroyed"]) {
          this.cdr.detectChanges();
        }
      }

    }, error => {
      this._alertService.error(error);
      this.isLoadpage = false;
    });

  }

  editSubmission(CurrentSubmission: SubmissionsList) {
    var editPermission = this.permissionsService.getPermission('ACTION_SUBMISSIONS_MODIFY');
    if (editPermission) {
      this.dialog.open(QuickSubmitComponent, {
        data: { candidateId: 0, submissionId: CurrentSubmission.SubmissionId, srcmode: 'edit' }, width: '80%', disableClose: true
      }).afterClosed().subscribe(response => {
        if (response) {
          this.getSubmissionsData(this.searchCtrl.value);
        }
      });
    }

  }

  addInterview(CurrentSubmission: SubmissionsList) {
    var editPermission = this.permissionsService.getPermission('ACTION_SUBMISSIONS_MODIFY');
    if (editPermission) {
      const Intvsubmission = {
        SubmissionID: CurrentSubmission.SubmissionId,
        CandidateId: CurrentSubmission.CandidateId,
        ScheduleId: 0,
      };
      this.dialog.open(AddInterviewComponent, {
        data: Intvsubmission, width: '60%', disableClose: true
      }).afterClosed().subscribe(response => {
        if (response) {
          this.getSubmissionsData(this.searchCtrl.value);
        }
      });
    }

  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'SubmittedDate': return new Date(item.SubmittedDate);
        default: return item[property];
      }
    };
  }
  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.submissions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'SubmittedDate': return new Date(item.SubmittedDate);
        default: return item[property];
      }
    };
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {
      this.searchLoaded = true;
      const trimmedValue = value.trim().toLowerCase();
      this.getSubmissionsData(trimmedValue);
    } else if (value.length === 0 && this.searchLoaded == true) {
      this.getSubmissionsData(null);
      this.searchLoaded = false;
    }
  }

  getSubmissionStatusList(CompanyId: number) {
    this.submissionService.GetSubmissionStatusList(CompanyId)
      .subscribe(response => {
        if (response.IsError == false)
          this.SubmissionStatusList = response.Data;
        this.getBenchSubUsers();
      },
        error => {
          this._alertService.error(error);
        }
      );
  }

  onLabelChange(change: MatSelectChange, submission: SubmissionsList) {
    const index = this.submissions.findIndex(c => c === submission);
    var selectedStatus = change.value;
    this.submissions[index].SubmissionStatusName = selectedStatus.StatusName;
    this.submissions[index].SubmissionStatus = selectedStatus.StatusId;
    const Psubmission = {
      SubmissionID: submission.SubmissionId,
      CompanyId: this.loginUser.Company.Id,
      Status: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this.submissionService.UpdateSubmissionStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            if (selectedStatus.StatusName == "Confirmed") {
              //if (this.MigrationPermission) { //removed this logic as this is not applicable
                const Migrationsubmission = {
                  SubmissionID: submission.SubmissionId,
                  JobId: submission.JobId,
                  CandidateId: submission.CandidateId,
                  CompanyId: this.loginUser.Company.Id,
                  UpdatedBy: this.loginUser.UserId
                };

                this.dialog.open(MigrateConfirmationComponent, {
                  data: Migrationsubmission, width: '60%', disableClose: false
                }).afterClosed().subscribe(response => {
                  if (response) {
                  }
                });
              //}
              // else {
              //   this._alertService.success(response.SuccessMessage);
              // }
            }
            else {
              this._alertService.success(response.SuccessMessage);
            }
            this.getSubmissionsData(this.searchCtrl.value);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  ViewLogs(submission: SubmissionsList) {
    this.ActivityLogs = [];
    this.selectedSubmissionId = submission.SubmissionId;
    this.submissionService.GetSbmissionActivityLog(this.selectedSubmissionId, this.loginUser.Company.Id)
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

  ViewInterviews(submission: SubmissionsList) {
    //this.IsCandidateDetail = false;
    this.selectedSubmissionId = submission.SubmissionId;
    this.candidateName = submission.candidateName + " - " + submission.Client;
    this.interviewslistpanel.open();
  }

  CloseQuickpopup(event) {
    this.selectedSubmissionId = 0;
    this.interviewslistpanel.close();
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  OnActiviyLogclose() {
    this.activitylog.close();
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  CheckConvertToConfirmationPermission(): boolean {
    debugger;
    var ModulesList = this.loginUser.ModulesList;
    let ATSModule = this.loginUser.ModulesList.find(x => x.ModuleId == UserModules.TalentCentral && x.HasAccess == true);
    let WCModule = this.loginUser.ModulesList.find(x => x.ModuleId == UserModules.WorkerCentral && x.HasAccess == true);
    if (WCModule && ATSModule) {
      if (ATSModule.RoleId == UserRoles.Administrator || ATSModule.RoleId == UserRoles.SalesManager) {
        return true;
      }
    }

    return false;
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.assignees.push({ name: 'ALL', value: null, email: null, mapping: false });
    this._service.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail, mapping: true });
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  filterByAssignee(selectedItem: assign) {
    this.selectedAssignee = selectedItem.name;
    this.SelectedAssingValue = selectedItem.value;
    this.getSubmissionsData(this.searchCtrl.value);
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getSubmissionsData(this.searchCtrl.value);
  }



}
