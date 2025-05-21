import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, OnChanges,Inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { BenchPriorityLabels } from 'src/static-data/aio-table-data';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSelectChange } from '@angular/material/select';
import { JobSearch } from '../../core/model/jobsearch';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { JobCentralService } from '../../core/http/job-central.service'
import { JobMaster } from '../../core/model/jobmaster';
import { AddJobComponent } from '../add-job/add-job.component';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { AddCandidateToJobComponent } from '../add-candidate-to-job/add-candidate-to-job.component';
import { ApplicantNewComponent } from '../../JC-Common/applicant-new/applicant-new.component';
import { ResponseViewComponent } from '../../jobboard-responses/response-view/response-view.component';
import { JobNotesDialogComponent } from '../job-notes-dialog/job-notes-dialog.component';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { IconService } from 'src/@shared/services/icon.service';  
import { ExistingRequisitionsComponent } from '../existing-requisitions/existing-requisitions.component';

@UntilDestroy()
@Component({
  selector: 'cv-jod-data-table',
  templateUrl: './jod-data-table.component.html',
  styleUrls: ['./jod-data-table.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class JodDataTableComponent implements OnInit, OnChanges {

  @Output('viewJob') selectedViewJob = new EventEmitter<JobMaster>();
  @Output('viewRequisition') selectedRequisition = new EventEmitter<JobMaster>();
  @Output() SelectededitJob = new EventEmitter<JobMaster>();
  @Output('addJobClick') addjob = new EventEmitter<any>();
  @Input() valueChange: boolean;
  @Input('JobStatus') JobStatus: number;
  subject$: ReplaySubject<JobMaster[]> = new ReplaySubject<JobMaster[]>(1);
  data$: Observable<JobMaster[]> = this.subject$.asObservable();
  jobs: JobMaster[];
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  _jobnotesemitter = EmitterService.get("JobNotescnt");
  _jobeditemitter = EmitterService.get("editJob");
  _updatejobreqemtter = EmitterService.get("UpdateJobToReqMapping");
  @Input()
  columns: TableColumn<JobMaster>[] = [
    { label: 'JobId', property: 'UniqueJobId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Source', property: 'JobSource', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Status', property: 'StatusName', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Category', property: 'JobCategoryName', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Job Type', property: 'JobTypeName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Location', property: 'Location', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Requisitions', property: 'MappedRequisitions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicants', property: 'MappedApplicants', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Client / Vendor', property: 'Accounts', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'WorkStatus', property: 'WorkStatus', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Duration(Months)', property: 'DurationInMonths', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Rate', property: 'Rate', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Experinece', property: 'Experience', type: 'text', visible: false },
    { label: 'Posting Date',property:'JobPostingDate',type:'text',visible:true},
    { label: 'Public Link',property:'PublishedJobUrl',type:'button',visible:false},
    { label: 'Notes', property: 'Notes', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'WorkActions', property: 'actions', type: 'button', visible: true },

  ];
  currentPage = 0;
  totalRows = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<JobMaster>();
  selection = new SelectionModel<JobMaster>(true, []);
  searchCtrl = new FormControl();
  labels = BenchPriorityLabels;

  public candidateName: string;
  public selectedJobId: number;
  public IsJobDetail: boolean = false;
  public IsSubmissionsList: boolean = false;
  searchLoaded:boolean=false;
  SearchValue:string=null;
  selecedJob = new JobMaster();

  @ViewChild(MatSort) sort: MatSort;
  //paginator: MatPaginator;
  DialogResponse: any;
  editPermission: any;
  @ViewChild('paginator') paginator: MatPaginator;
  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  //   this.setDataSourceAttributes();
  // }

  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.jobs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  @ViewChild('quickpanel', { static: true }) quickpanel: MatSidenav;
  public candidateFilters: JobSearch = new JobSearch();
  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private permissionsService: NgxPermissionsService,
    private jobCentralService: JobCentralService,
    public iconService: IconService
  ) {
    
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

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._jobnotesemitter.subscribe(res => {
      let NotesItem = this.jobs.find(x => x.JobID == res);
      if (NotesItem != null)
        NotesItem.NotesCount += 1;

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })

    this._jobeditemitter.subscribe(res => {
      this.getData();
    })
    this._updatejobreqemtter.subscribe(res =>{
      this.getData();
    })
    this.editPermission = this.permissionsService.getPermission('ACTION_JC_EDIT_JOB');
  }
  ngOnChanges(...args: any[]) {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getData();
    }
  }


  getData() {
    this.candidateFilters.CompanyId = this.loginUser.Company.Id;
    this.candidateFilters.EmployeeId = this.loginUser.UserId;
    this.candidateFilters.PageIndex = this.currentPage;
    this.candidateFilters.PageSize = this.pageSize;
    this.candidateFilters.SearchByStatus = this.JobStatus;
    this.candidateFilters.SearchByText = this.SearchValue;
    this.jobCentralService.getAllBenchJobs(this.candidateFilters).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {debugger;
        this.jobs = result.Data;
        this.totalRows = result.TotalRecords;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        if (this.jobs.length > 0) {
          this.jobs.forEach(x => {
            if (x.Location == '' || x.Location == null)
              x.Location = 'Not Defined';
            if (x.MaxExperience && x.MinExperience)
              x.Experience = `${x.MaxExperience} - ${x.MinExperience}`;
            if (x.MaxExperience && !x.MinExperience)
              x.Experience = `${x.MaxExperience} - N/A`;
            if (!x.MaxExperience && x.MinExperience)
              x.Experience = `N/A - ${x.MinExperience}`;
            if (x.BillingRate && x.BillingType)
              x.Rate = `${x.BillingRate} / ${x.BillingTypeName}`;
            x.Duration = `${x.DurationInMonths}`
            x.JobPostingDate = x.JobPostingDate!=null? TimeZoneService.getRangeBaseTimeDisplay(x.JobPostingDate, true): null;
          })
        }
        this.dataSource.data = this.jobs;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string) {debugger;
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {  
      const trimmedValue = value.trim().toLowerCase();
      this.searchLoaded=true;
      this.SearchValue=trimmedValue;
      this.getData();
    } else if (value.length === 0 && this.searchLoaded==true) {
      this.SearchValue=null;
      this.getData();
      this.searchLoaded=false;
    }

    // if (!this.dataSource) {
    //   return;
    // }
    // value = value.trim();
    // value = value.toLowerCase();
    // this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: JobMaster) {
    const index = this.jobs.findIndex(c => c === row);
    this.jobs[index].labels = [];
    this.jobs[index].labels.push(change.value);
    this.subject$.next(this.jobs);
  }

  CloseQuickpopup(event) {
    this.IsSubmissionsList = false;
    this.quickpanel.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  OnCloseCandidateDetail(event) {
    this.IsJobDetail = false;
    this.getData();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  OnRadioChange(event) {
    console.log(event);
  }
  updateCustomer(row: JobMaster) {

  }
  updateJob(row: JobMaster) {
    if (this.editPermission) {
      this.dialog.open(AddJobComponent, {
        maxWidth: '95vw', width: '95vw',
        disableClose: true,
        data: { mode: "Edit Job", Id: row.JobID }
      }).afterClosed().subscribe(response => {

        if (response) {

        }
      });
    }
  }
  onAddClick() {
    this.addjob.emit(true);
  }
  ViewCandidates(row: JobMaster) {
    if (this.editPermission) {
      this.selectedViewJob.emit(row);
    }
  }

  ViewRequisitions(row: JobMaster) {
    this.dialog.open(ExistingRequisitionsComponent, {
      data: {JobId:row.JobID,mode:'ByJob'}, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        
      }
    });
  }

  addCandidates(row: JobMaster) {

  }

  OnCnadidateClick() {
    this.dialog.open(ApplicantNewComponent, {
      data: 0, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  OnExistingCnadidateClick() {
    this.dialog.open(AddCandidateToJobComponent, { maxWidth: '95vw', width: '95vw', height: '90vh', data: { jobID: this.selection.selected[0].JobID,RequisitionId:0 } })
      .afterClosed().subscribe(result => {
        if (result) {
          this.selection.clear();
          this.getData();
        }
      })
  }

  ViewNotes(row: JobMaster) {
    this.dialog.open(JobNotesDialogComponent, {
      data: { jobId: row.JobID }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  MapExistingApplicant(row: JobMaster) {
    this.selection.clear();
    this.dialog.open(AddCandidateToJobComponent, { maxWidth: '95vw', width: '95vw', height: '90vh', data: { jobID: row.JobID,RequisitionId:0 } })
      .afterClosed().subscribe(result => {
        if (result) {
          //this.getData();
          let JobIndex = this.jobs.findIndex(x => x.JobID == row.JobID);
          if (JobIndex != -1) {
            this.jobs[JobIndex].MappedApplicants = this.jobs[JobIndex].MappedApplicants + 1;
          }
        }
      })
  }

  MapNewApplicant(row: JobMaster) {
    this.dialog.open(ResponseViewComponent, {
      data: { ResponseId: 0, Source: 'Job' }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {
      if (Number(response) > 0) {
        //Map Applicant to JobId
        this.ApplicantJobMaping(response, row.JobID);
      }
    });
  }

  ApplicantJobMaping(ApplicantId, JobId) {
    const JobAPPMapping = {
      ApplicantId: ApplicantId,
      JobId: JobId,
      MappingStatus: true,
      CreatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id
    }

    this.jobCentralService.ApplicantJobMaping(JobAPPMapping).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success("Applicant Mapped to Job Successfully");
        let JobIndex = this.jobs.findIndex(x => x.JobID == JobId);
        if (JobIndex != -1) {
          this.jobs[JobIndex].MappedApplicants = this.jobs[JobIndex].MappedApplicants + 1;
        }
      }

    }, error => {
      this._alertService.error(error);
    })
  }

  InactiveJob(row: JobMaster) {
    this.selection.clear();
    const message = 'Job with title ' + row.JobTitle + " " + "(" + row.UniqueJobId + ") will be moved to inactive jobs! Please provide a reason";
    const dialogData = new ConfirmDialogModel("Update Job Status", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmInactiveJob(row, this.DialogResponse.Notes);
      }
    });
  }

  ConfirmInactiveJob(applicant: JobMaster, DeleteNotes: string) {
    if (applicant.JobID > 0) {
      const pfilters = {
        JobId: applicant.JobID,
        CompanyId: this.loginUser.Company.Id,
        updatedby: this.loginUser.UserId,
        notes: DeleteNotes,
        Status: 5,
      };
      this.jobCentralService.UpdateJobStatus(pfilters).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success(response.SuccessMessage);
          this.getData();
        }
      },
        error => {
          this._alertService.error(error);
        })
    }
  }

  ConfirmPublishJob(applicant: JobMaster, PublishNotes: string) {
    if (applicant.JobID > 0) {
      const pfilters = {
        JobId: applicant.JobID,
        CompanyId: this.loginUser.Company.Id,
        updatedby: this.loginUser.UserId,
        notes: PublishNotes,
        Status: 6
      };
      this.jobCentralService.UpdateJobStatus(pfilters).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success(response.SuccessMessage);
          this.getData();
        }
      },
        error => {
          this._alertService.error(error);
        })
    }
  }

  MapRequisition(row: JobMaster){
    this.dialog.open(ExistingRequisitionsComponent, {
      data: {JobId:row.JobID}, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.getData();
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getData();
  }

  PublishJob(row: JobMaster) {
    this.selection.clear();
    const message = 'Job with title ' + row.JobTitle + " " + "(" + row.UniqueJobId + ") will be published.";
    const dialogData = new ConfirmDialogModel("Update Job Status", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmPublishJob(row, this.DialogResponse.Notes);
      }
    });
  }
}
