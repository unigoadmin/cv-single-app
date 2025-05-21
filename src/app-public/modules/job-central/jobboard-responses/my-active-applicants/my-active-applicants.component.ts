import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FilterTableColumn, TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginUser } from 'src/@shared/models';
import { merge, Observable, ReplaySubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { JobCentralService } from '../../core/http/job-central.service';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CandidateResumeViewComponent } from '../../JC-Common/candidate-resume-view/candidate-resume-view.component';
import { iconsFA } from 'src/static-data/icons-fa';
import { ApplicantsMapping, RecruiterMappings, RecruiterObject } from '../../core/model/applicantrecruitermapping';
import { assign } from 'src/@shared/models/assign';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { debounceTime, distinct } from 'rxjs/operators';
import { ApplicantMaster } from '../../core/model/applicantmaster';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { ResponseViewComponent } from '../response-view/response-view.component';
import { AccountTypes } from 'src/static-data/accounttypes';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatMenuTrigger } from '@angular/material/menu';
import { IconService } from 'src/@shared/services/icon.service';
import { JobMaster } from '../../core/model/jobmaster';
import { ManagerEditStatusLabels } from 'src/static-data/aio-table-data';
import { MatSelectChange } from '@angular/material/select';
import { ApplicationStatus } from '../../core/model/applicantstatus';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import { ApplicantNotesComponent } from 'src/@shared/components/notes-components/applicant-notes/applicant-notes.component';
import { ActivityLogCandidate } from 'src/@shared/models/candidateActivityLog';

@UntilDestroy()
@Component({
  selector: 'cv-my-active-applicants',
  templateUrl: './my-active-applicants.component.html',
  styleUrls: ['./my-active-applicants.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],
  providers: [AccountTypes, TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class MyActiveApplicantsComponent implements OnInit {

  @Input('ViewType') ViewType: string;
  @Input('SrcJobId') SrcJobId: number = 0;
  @Input('SelectedJob') SelectedJob: JobMaster;
  @Output('backClick') backBtn = new EventEmitter<boolean>();
  @Output('onBackToRequitions') backToRequisition = new EventEmitter<boolean>();
  @Input('SrcRequisitionId') SrcRequisitionId: number = 0;
  subject$: ReplaySubject<ApplicantMaster[]> = new ReplaySubject<ApplicantMaster[]>(1);
  data$: Observable<ApplicantMaster[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  confirmresult: string = '';
  filteredIcons: string;
  applicantsMapping: RecruiterMappings[] = [];
  public assignees: assign[] = [];
  public benchSubUsers: SubUsers[];
  public selectedAssignee: string = "All";
  public SelectedAssingValue: string = null;
  ApplicantStausList: ApplicationStatus[];
  EditApplicantStatusList: ApplicationStatus[];
  WorkPermitList: any[];
  customStatusModel: number = 0;
  customSourceModel: string = "ALL";
  customRCModel: string = "ALL";
  customManagerModel: string = "ALL";
  customWPModel: string = "ALL";
  customJTModel: string = null;
  customdummy: string;
  nameFilter = new FormControl('');
  editPermission: any;
  currentPage = 0;
  totalRows = 0;
  localDFW: Boolean = false;
  RecruiterObjectList: RecruiterObject[] = [];
  isMenuOpen = false;
  ApplicantsMappingList: ApplicantsMapping[] = [];
  statusLabels = ManagerEditStatusLabels;
  currentApplicant: JobboardResponses = new JobboardResponses();
  dataLoading: boolean = false;
  searchLoaded: boolean = false;
  ActivityLogs: ActivityLogCandidate[];
  selectedResponseId: number | null = null;
  ReportResponseIds:string= null;
  InputSrc:string=null;
  @Input()
  columns: TableColumn<JobboardResponses>[] = [
    { label: 'Source', property: 'ApplicantSource', type: 'text', visible: true, filterlabel: 'source-filter', cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Id', property: 'JobId', type: 'text', visible: false, filterlabel: 'JobId-filter', cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, filterlabel: 'JobTitle-filter', cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, filterlabel: 'FirstName-filter', cssClasses: ['font-medium'] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, filterlabel: 'LastName-filter', cssClasses: ['font-medium'] },
    { label: 'Applicant Email', property: 'Email', type: 'text', visible: false, filterlabel: 'Email-filter', cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Phone', property: 'Phno', type: 'text', visible: false, filterlabel: 'Phone-filter', cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Location', property: 'ApplicantLocation', type: 'button', filterlabel: 'Location-filter', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Resume', property: 'Resume', type: 'button', visible: true, filterlabel: 'Resume-filter', cssClasses: ['text-secondary', 'font-medium', 'text-center'] },
    { label: 'Work Permit', property: 'WorkPermit', type: 'button', visible: true, filterlabel: 'WorkPermit-filter', cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Employment Type', property: 'EmploymentType', type: 'button', visible: false, filterlabel: 'emptype-filter', cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Recruiter', property: 'Recruiter', type: 'button', visible: true, filterlabel: 'Recruiter-filter', cssClasses: ['text-secondary', 'font-medium', 'text-center'] },
    { label: 'Assignee', property: 'Assignee', type: 'button', visible: true, filterlabel: 'Assignee-filter', cssClasses: ['text-secondary', 'font-medium', 'text-center'] },
    { label: 'Viewed', property: 'ApplicantViews', type: 'button', visible: false, filterlabel: 'Viewed-filter', },
    { label: 'Date Applied', property: 'CreatedDate', type: 'text', visible: true, filterlabel: 'CreatedDate-filter', cssClasses: ['text-secondary', 'font-medium', 'text-center'] },
    { label: 'Status', property: 'ApplicantStatusName', type: 'button', visible: true, filterlabel: 'Status-filter', cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true, filterlabel: 'Notes-filter', cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'ActivityLogs', property: 'ActivityLogs', type: 'button', visible: true, filterlabel: 'Activity-filter' },
    { label: 'Actions', property: 'Actions', type: 'date', visible: true, filterlabel: 'Actions-filter', cssClasses: ['text-secondary', 'font-medium', 'text-center'] },

  ];

  filtercolumns: FilterTableColumn<JobboardResponses>[] = [
    { filter: true, filterName: 'source-filter', visible: true },
    { filter: false, filterName: 'JobId-filter', visible: false },
    { filter: true, filterName: 'JobTitle-filter', visible: true },
    { filter: false, filterName: 'FirstName-filter', visible: true },
    { filter: false, filterName: 'LastName-filter', visible: true },
    { filter: false, filterName: 'Email-filter', visible: false },
    { filter: false, filterName: 'Phone-filter', visible: false },
    { filter: false, filterName: 'Location-filter', visible: true },
    { filter: false, filterName: 'Resume-filter', visible: true },
    { filter: true, filterName: 'WorkPermit-filter', visible: true },
    { filter: false, filterName: 'emptype-filter', visible: false },
    { filter: true, filterName: 'Recruiter-filter', visible: true },
    { filter: true, filterName: 'Assignee-filter', visible: true },
    { filter: false, filterName: 'Viewed-filter', visible: false },
    { filter: false, filterName: 'CreatedDate-filter', visible: true },
    { filter: true, filterName: 'Status-filter', visible: true },
    { filter: false, filterName: 'Notes-filter', visible: true },
    { filter: false, filterName: 'Activity-filter', visible: true },
    { filter: false, filterName: 'Actions-filter', visible: true },

  ];


  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<JobboardResponses>();
  selection = new SelectionModel<JobboardResponses>(true, []);
  searchCtrl = new FormControl();
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator;
  DialogResponse: any;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  Rchilliinboxlist: JobboardResponses[] = [];
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: { respIds: string,InputSrc:string },
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private jobCentralService: JobCentralService,
    private _eventemitterservice: EventEmitterService,
    private accountTypes: AccountTypes,
    private permissionsService: NgxPermissionsService,
    public iconService: IconService) {
    this.dataSource = new MatTableDataSource();
    //this.ApplicantStausList = this.accountTypes.ApplicantStatusList;
    this.WorkPermitList = this.accountTypes.workStatusFields;
  }

  _upnotesemitter = EmitterService.get("AppNotescnt");

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.ReportResponseIds = this.dialogData ? this.dialogData.respIds : null;
      this.InputSrc = this.dialogData ? this.dialogData.InputSrc : null;
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      EmitterService.get("JobCentral").emit("JobCentral");
      this.getBenchSubUsers();
      this.FetchData();
    }

    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._upnotesemitter.subscribe(res => {
      let NotesItem = this.Rchilliinboxlist.find(x => x.ResponseId == res);
      if (NotesItem != null)
        NotesItem.NotesCount += 1;

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })

    this._eventemitterservice.OtherSourceResponseEvent.subscribe(() => {
      this.FetchData();
    })

    this.editPermission = this.permissionsService.getPermission('ACTION_EDIT_APPLICANT');

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getApplicantStatusLabels() {
    this.jobCentralService.fetchApplicantStatus(this.loginUser.Company.Id)
      .subscribe(response => {
        this.ApplicantStausList = response.Data;
        this.EditApplicantStatusList = this.ApplicantStausList.filter(item => item.IsDefault != true);
      });
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  get filteredColumns() {
    return this.filtercolumns.filter(column => column.visible).map(column => column.filterName);
  }

  FetchData() {
    if (this.SrcJobId > 0 || this.SrcRequisitionId > 0) {
      this.GetJobApplicants(this.searchCtrl.value);
    }
    else if(this.ReportResponseIds!=null){
       this.GetReportApplicants(this.searchCtrl.value);
    } 
    else {
      this.MyActiveApplicants(this.searchCtrl.value);
    }
  }

  FetchDataWithSearchValue(SearchValue: string) {
    if (this.SrcJobId > 0 || this.SrcRequisitionId > 0) {
      this.GetJobApplicants(SearchValue);
    } else if(this.ReportResponseIds!=null){
      this.GetReportApplicants(this.searchCtrl.value);
   } 
    else {
      this.MyActiveApplicants(SearchValue);
    }
  }

  MyActiveApplicants(SearchValue: string) {
    this.Rchilliinboxlist = [];
    this.dataLoading = true;
    this.dataSource = new MatTableDataSource();
    const appFilter = {
      companyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      AssigneeId: this.loginUser.UserId,
      Source: this.customSourceModel != 'ALL' ? this.customSourceModel : null,
      JobTitle: (this.customJTModel != null || this.customJTModel != undefined) ? this.customJTModel : null,
      WorkPermit: this.customWPModel != 'ALL' ? this.customWPModel : null,
      Manager: this.customManagerModel != 'ALL' ? this.customManagerModel : null,
      ApplicantStatus: this.customStatusModel != 0 ? this.customStatusModel : null,
      Recruiter: this.customRCModel != 'ALL' ? this.customRCModel : null,
      SearchText: SearchValue,
      IsReviewFurther: false,
      LocaltoDFW: this.localDFW,
      PageIndex: this.currentPage,
      PageSize: this.pageSize,
    }
    this.jobCentralService.getMyApplicants(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.totalRows = result.TotalRecords;
        this.Rchilliinboxlist = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.Rchilliinboxlist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        if (this.SelectedAssingValue != null) {
          var filtereddata = this.Rchilliinboxlist.filter(x => x.AssignId == this.SelectedAssingValue);
          this.dataSource = new MatTableDataSource(filtereddata);
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
          this.dataSource.paginator = this.paginator;
        }
        this.dataLoading = false;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      this.dataLoading = false;
    });
  }

  GetJobApplicants(SearchValue: string) {
    this.Rchilliinboxlist = [];
    this.dataLoading = true;
    this.dataSource = new MatTableDataSource();
    const appFilter = {
      companyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      AssigneeId: this.loginUser.UserId,
      Source: this.customSourceModel != 'ALL' ? this.customSourceModel : null,
      JobTitle: (this.customJTModel != null || this.customJTModel != undefined) ? this.customJTModel : null,
      WorkPermit: this.customWPModel != 'ALL' ? this.customWPModel : null,
      Manager: this.customManagerModel != 'ALL' ? this.customManagerModel : null,
      ApplicantStatus: this.customStatusModel != 0 ? this.customStatusModel : null,
      Recruiter: this.customRCModel != 'ALL' ? this.customRCModel : null,
      SearchText: SearchValue,
      IsReviewFurther: false,
      PageIndex: this.currentPage,
      PageSize: this.pageSize,
      JobId: this.SrcJobId,
      RequisitionId: this.SrcRequisitionId,
      LocaltoDFW: this.localDFW,
    }
    this.jobCentralService.GetApplicantsByJob(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.totalRows = result.TotalRecords;
        this.Rchilliinboxlist = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.Rchilliinboxlist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        if (this.SelectedAssingValue != null) {
          var filtereddata = this.Rchilliinboxlist.filter(x => x.AssignId == this.SelectedAssingValue);
          this.dataSource = new MatTableDataSource(filtereddata);
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
          this.dataSource.paginator = this.paginator;
        }
        this.dataLoading = false;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      this.dataLoading = false;
    });
  }

  GetReportApplicants(SearchValue: string){
    this.Rchilliinboxlist = [];
    this.dataLoading = true;
    this.dataSource = new MatTableDataSource();
    const ApplicantsFilter = {
      CompanyId: this.loginUser.Company.Id,
      ResponseIds: this.ReportResponseIds,
      SearchText: SearchValue,
      UserId: this.loginUser.UserId,
      AssigneeId: this.loginUser.UserId,
      Source: this.customSourceModel != 'ALL' ? this.customSourceModel : null,
      JobTitle: (this.customJTModel != null || this.customJTModel != undefined) ? this.customJTModel : null,
      WorkPermit: this.customWPModel != 'ALL' ? this.customWPModel : null,
      Manager: this.customManagerModel != 'ALL' ? this.customManagerModel : null,
      ApplicantStatus: this.customStatusModel != 0 ? this.customStatusModel : null,
      Recruiter: this.customRCModel != 'ALL' ? this.customRCModel : null,
      IsReviewFurther: false,
      PageIndex: this.currentPage,
      PageSize: this.pageSize,
      LocaltoDFW: this.localDFW,
    }
    this.jobCentralService.GetApplicantsByReports(ApplicantsFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.totalRows = result.TotalRecords;
        this.Rchilliinboxlist = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.Rchilliinboxlist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        if (this.SelectedAssingValue != null) {
          var filtereddata = this.Rchilliinboxlist.filter(x => x.AssignId == this.SelectedAssingValue);
          this.dataSource = new MatTableDataSource(filtereddata);
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
          this.dataSource.paginator = this.paginator;
        }
        this.dataLoading = false;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      this.dataLoading = false;
    });
  }


  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {
      const trimmedValue = value.trim().toLowerCase();
      this.searchLoaded = true;
      this.FetchDataWithSearchValue(trimmedValue);
    } else if (value.length === 0 && this.searchLoaded == true) {
      this.FetchDataWithSearchValue(null);
      this.searchLoaded = false;
    }
  }


  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  UpdateColumnEvent(column, event) {
    let childColumn = this.filtercolumns.find(x => x.filterName == column.filterlabel)
    if (childColumn) {
      childColumn.visible = !column.visible;
    }

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator != undefined ? this.dataSource.paginator.length : this.pageSize;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
    //this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  trackByfilterProperty<T>(index: number, column: FilterTableColumn<T>) {
    return column.filterName;
  }

  ViewResume(row: JobboardResponses) {
    if (row.AttachedFileName) {
      this.dialog.open(CandidateResumeViewComponent, {
        data: row, width: '60%'
      }).afterClosed().subscribe(response => {
        if (response) {
          // this.UpdateViewedStatus(this.loginUser.Company.Id, row.ApplicantId);
        }
      });
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }


  closeMenu(menuTrigger: MatMenuTrigger): void {
    if (menuTrigger && menuTrigger.menuOpen) {
      menuTrigger.closeMenu();
    }
  }


  getBenchSubUsers() {
    this.assignees = [];
    this.jobCentralService.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail, mapping: false });
            });

          this.getApplicantStatusLabels();
        },
        error => {
          this._alertService.error(error);
        });
  }


  ViewNotes(rowApplicant: JobboardResponses) {
    this.dialog.open(ApplicantNotesComponent, {
      data: { ResponseId: rowApplicant.ResponseId, candidateId: 0, inputsrc: 'MyApp', Notesmode: 'Dialog' }, maxWidth: '95vw', width: '95vw',
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  sortData(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sortingDataAccessor = (item, key) => item[key] || 'Z';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CreatedDate': return new Date(item.ActualDate);
        default: return item[property];
      }
    };
  }

  ViewApplicant(row: JobboardResponses) {
    if (this.editPermission) {
      this.dialog.open(ResponseViewComponent, {
        data: { ResponseId: row.ResponseId, Source: 'ACP' }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          // this.UpdateViewedStatus(this.loginUser.Company.Id, row.CandidateInboxId);
        }
      });
    }
  }


  createApplicant() {
    this.dialog.open(ResponseViewComponent, {
      data: { ResponseId: 0, Source: 'ACP' }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        this.FetchData();
      }
    });
  }

  CustomTableFilters() {
    this.currentPage = 0;
    this.FetchData();
    //this.MyActiveApplicants(this.searchCtrl.value);
  }


  changeKeypress(event) {
    if (event.target.value.length > 2) {
      this.CustomTableFilters();
    }
    else if (event.target.value.length == 0) {
      this.customJTModel = null;
      this.CustomTableFilters();
    }

  }

  ResetFilters() {
    this.customStatusModel = 0;
    this.customSourceModel = "ALL";
    this.customRCModel = "ALL";
    this.customManagerModel = "ALL";
    this.customWPModel = "ALL";
    this.customJTModel = null;
    this.CustomTableFilters();
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.FetchData();
  }

  onBackClick() {
    this.backBtn.emit(true);
  }

  onBackToRequitions() {
    this.backToRequisition.emit(true);
  }

  onModalClose(){
    
  }

  onLabelChange(change: MatSelectChange, rowApplicant: JobboardResponses) {
    var selectedStatus = change.value;
    this.currentApplicant.ApplicantStatusName = selectedStatus.text;
    this.currentApplicant.ApplicantStatus = selectedStatus.StatusId;
    const Psubmission = {
      ApplicantId: rowApplicant.ResponseId,
      companyId: this.loginUser.Company.Id,
      ApplicantStatus: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this.jobCentralService.UpdateApplicantStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            let applicantIndex = this.Rchilliinboxlist.findIndex(x => x.ResponseId == rowApplicant.ResponseId);
            if (applicantIndex != -1) {
              this.Rchilliinboxlist[applicantIndex].ApplicantStatus = selectedStatus.StatusId;
              this.Rchilliinboxlist[applicantIndex].ApplicantStatusName = selectedStatus.StatusName;
              this.Rchilliinboxlist[applicantIndex].bgClass = selectedStatus.bgclass;

              if (!this.cdRef["distroyed"]) {
                this.cdRef.detectChanges();
              }
            }
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  LocalDFWStatus(event) {
    this.selection.clear();
    this.localDFW = event.checked;
    this.FetchData();
  }

  ViewLogs(rowApplicant: JobboardResponses): void {
    this.selectedResponseId = rowApplicant.ResponseId;
    this.jobCentralService.GetApplicantsActivityLog(this.selectedResponseId, this.loginUser.Company.Id)
      .subscribe({
        next: (response) => {
          if (!response.IsError) {
            this.ActivityLogs = response.Data.map(log => ({
              ...log,
              CreatedDate: TimeZoneService.getLocalDateTime(log.CreatedDate, true),
            }));
          } else {
            this._alertService.error(response.ErrorMessage);
          }
        },
        error: (error) => {
          this._alertService.error(error);
        }
      });
  }

  OnActiviyLogclose(): void {
    this.selectedResponseId = null;
  }

  onRefreshData(): void {
    console.log('Refreshing parent data...');
    this.FetchData(); // Call the parent’s data loading method
  }

}
