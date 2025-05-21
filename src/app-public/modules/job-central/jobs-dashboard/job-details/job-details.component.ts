import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { JobMaster } from '../../core/model/jobmaster';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger20ms } from 'src/@cv/animations/stagger.animation'; 
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JobCentralService } from '../../core/http/job-central.service';
import { LoginUser } from 'src/@shared/models';
import { BenchCandidate } from 'src/@shared/core/ats/models/benchcandidate';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCandidateToJobComponent } from '../add-candidate-to-job/add-candidate-to-job.component';
//import { EditCandidateComponent } from 'src/app-ats/talent-central/bench-candidates/edit-candidate/edit-candidate.component';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { ResponseViewComponent } from '../../jobboard-responses/response-view/response-view.component';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CandidateResumeViewComponent } from '../../JC-Common/candidate-resume-view/candidate-resume-view.component';
import { ApplicantAssignComponent } from '../../JC-Common/applicant-assign/applicant-assign.component';
import { ShareApplicantComponent } from '../../JC-Common/share-applicant/share-applicant.component';
import { ApplicantsMapping, RecruiterMappings, RecruiterObject } from '../../core/model/applicantrecruitermapping';
import { ApplicantIgnoreComponent } from '../../JC-Common/applicant-ignore/applicant-ignore.component';
import { MatSelectChange } from '@angular/material/select';
import { ApplicantCandidateComponent } from '../../JC-Common/applicant-candidate/applicant-candidate.component';
import { AssignMyselfComponent } from '../../JC-Common/assign-myself/assign-myself.component';
import { assign } from 'src/@shared/models/assign';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { Observable, ReplaySubject, merge } from 'rxjs';
import { distinct } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import { NgxPermissionsService } from 'ngx-permissions';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { IconService } from 'src/@shared/services/icon.service';
import { ApplicantNotesComponent } from 'src/@shared/components/notes-components/applicant-notes/applicant-notes.component';
@UntilDestroy()
@Component({
  selector: 'cv-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger20ms
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
export class JobDetailsComponent implements OnInit {
  @Input('jobId') selectedJobId: number;
  @Output('backClick') backBtn = new EventEmitter<boolean>();
  @Output('editClick') editBtn = new EventEmitter<number>();
  @Output('showCandidate') candidate = new EventEmitter<BenchCandidate>();

  subject$: ReplaySubject<JobboardResponses[]> = new ReplaySubject<JobboardResponses[]>(1);
  data$: Observable<JobboardResponses[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;

  status_textClass: any = 'text-amber-contrast';
  status_bgClass: any = 'bg-amber';
  loginUser: LoginUser;
  priority_textClass: any = 'text-warn';
  priority_bgClass: any = 'bg-warn-light';
  job: JobMaster = new JobMaster();
  isApplicants: boolean = false;
  isSummary: boolean = false;
  isnotes: boolean = false;
  currentPage = 0;
  totalRows = 0;
  localDFW: Boolean = false;
  SelectedAssingValue: string = null;
  IsUnassigned: boolean = false;
  SelectedResponseFilter: any;
  editPermission: any;
  SelectedApplicant:JobboardResponses = new JobboardResponses();
  RecruiterObjectList: RecruiterObject[] = [];
  ApplicantsMappingList: ApplicantsMapping[] = [];
  applicantsMapping: RecruiterMappings[] = [];
  selectedAssignee: string = "All";
  assignees: assign[] = [];
  benchSubUsers: SubUsers[];
  @Input()
  columns: TableColumn<JobboardResponses>[] = [
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true },
    { label: 'Applicant Email', property: 'Email', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Phone', property: 'Phno', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Location', property: 'ApplicantLocation', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Resume', property: 'Resume', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Work Permit', property: 'WorkPermit', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Employment Type', property: 'EmploymentType', type: 'button', visible: false },
    { label: 'Recruiter', property: 'Recruiter', type: 'button', visible: true },
    { label: 'Manager', property: 'Assignees', type: 'button', visible: true },
    { label: 'Viewed', property: 'ApplicantViews', type: 'button', visible: false },
    { label: 'Date Applied', property: 'CreatedDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'ApplicantStatusName', type: 'button', visible: true },
    { label: 'Notes', property: 'Notes', type: 'button', visible: true },
    { label: 'Actions', property: 'Actions', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },

  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource<JobboardResponses>();
  selection = new SelectionModel<JobboardResponses>(true, []);
  searchCtrl = new FormControl();
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator;
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
  constructor(
    private dialog: MatDialog,
    private _service: JobCentralService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
    private jobCentralService: JobCentralService,
    private permissionsService: NgxPermissionsService,
    public iconService: IconService
  ) { this.dataSource = new MatTableDataSource();}
  
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      EmitterService.get("JobCentral").emit("JobCentral");
      this.GetBenchJobById();
      this.GetRchilliCandidateInbox(null, this.SelectedResponseFilter);
    }
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
   
    this.editPermission = this.permissionsService.getPermission('ACTION_EDIT_APPLICANT');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  onBackClick() {
    this.backBtn.emit(true);
  }
  onEditClick() {
    this.editBtn.emit(this.selectedJobId);
  }
  
  GetBenchJobById() {
    this._service.GetBenchJobById(this.loginUser.Company.Id, this.selectedJobId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.job = response.Data;
        this.job.CreatedDate = TimeZoneService.getRelativeTime(this.job.CreatedDate, true);
        this.isSummary = true;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })
  }
  onSelectedCandidate(applicant) {debugger;
    //this.candidate.emit(candidate);
    this.SelectedApplicant = applicant;
    
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  OnExistingCnadidateClick() {
    this.dialog.open(AddCandidateToJobComponent, { width: "80vw",data: {jobID:this.selectedJobId}})
      .afterClosed().subscribe(result => {
        if (result) {
          this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
        }
      })
  }

  OnCnadidateClick() {
    this.dialog.open(ResponseViewComponent, { 
      data: { ResponseId: 0, Source: 'Job' }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {
      if (response > 0 ) {
        //Map Applicant to JobId
        //JobID:this.selectedJobId
        this.ApplicantJobMaping(response,this.selectedJobId);
      }
    });
  }

  OnEditCandidate(SelectedCandidate:BenchCandidate) {
    // this.dialog.open(EditCandidateComponent, {
    //   data: SelectedCandidate.CandidateID, width: '60%',disableClose:true
    // }).afterClosed().subscribe(response => {
      
    //   if (response) {
       
    //   }
    // });
  }

  ApplicantJobMaping(ApplicantId,JobId) {
    const JobAPPMapping = {
      ApplicantId:ApplicantId,
      JobId: JobId,
      MappingStatus: true,
      CreatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id
    }

    this._service.ApplicantJobMaping(JobAPPMapping).subscribe(response => {
      if (!response.IsError) {
        this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
      }

    }, error => {
      this._alertService.error(error);
    })
  }

  contentLoaded() {
    document.getElementById("progressBar").style.display = "none";
  }

  GetRchilliCandidateInbox(SearchValue: string, ApplicantFilter: number) {
    this.Rchilliinboxlist = [];
    this.dataSource = null;
    const appFilter = {
      JobId:this.selectedJobId,
      companyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      IsReviewFurther: false,
      InboxSource: 0,
      PageIndex: this.currentPage,
      PageSize: this.pageSize,
      SearchText: SearchValue,
      ApplicantType: ApplicantFilter,
      RepresentType: null,
      LocaltoDFW: this.localDFW,
      Recruiter: this.SelectedAssingValue,
      IsUnAssigned: this.IsUnassigned
    }
    this.jobCentralService.GetApplicantsByJob(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {debugger;
        this.totalRows = result.TotalRecords;
        this.Rchilliinboxlist = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.Rchilliinboxlist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
        this.dataSource.paginator = this.paginator;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    if (value != null && value != "" && value.length > 2) {
      value = value.trim();
      value = value.toLowerCase();
      this.GetRchilliCandidateInbox(value, this.SelectedResponseFilter);
    }
    else if (value == null || value == "") {
      value = value.trim();
      value = value.toLowerCase();
      this.GetRchilliCandidateInbox(null, this.SelectedResponseFilter);
    }
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  UpdateColumnEvent(column, event) {
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {debugger;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator != undefined ? this.dataSource.paginator.length : this.pageSize;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {debugger;
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
    //this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  ViewResume(row: JobboardResponses) {
    if (row.ActualFileName) {
      this.dialog.open(CandidateResumeViewComponent, {
        data: row, width: '60%'
      }).afterClosed().subscribe(response => {
        if (response) {
          this.UpdateViewedStatus(this.loginUser.Company.Id, row.ResponseId);
          let applicantIndex = this.Rchilliinboxlist.findIndex(x => x.ResponseId == row.ResponseId);
          if (applicantIndex != -1) {
            this.Rchilliinboxlist[applicantIndex].IsCandidateViewed = true;
          }
        }
      });
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }

  }

  downloadResume(row: JobboardResponses) {
    if (row.ActualFileName) {
      this.jobCentralService.DownloadInboxResume(row.CompanyId, row.ResponseId)
        .subscribe(response => {
          let filename = row.AttachedFileName;
          FileSaver.saveAs(response, filename);
        }),
        error => {
          this._alertService.error("Error while downloading the file.");
        }
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

  ViewApplicant(row: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
      this.dialog.open(ResponseViewComponent, {
        data: { ResponseId: row.ResponseId, Source: 'Monster' }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {
        /**
         * Customer is the updated customer (if the user pressed Save - otherwise it's null)
         */
        if (response==0) {
          this.UpdateViewedStatus(this.loginUser.Company.Id, row.ResponseId);
        }
      });
    }
  }

  UpdateViewedStatus(companyId: number, applicantId: number) {
    const viewdata = {
      ApplicantId: applicantId,
      CompanyId: companyId,
      UpdatedBy: this.loginUser.UserId,
      Notes: null,
      ActionType: 1,
      Action: "Viewed"
    }
    this.jobCentralService.UpdateApplicantViewed(viewdata).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      }
      else {
        //this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
        let applicantIndex = this.Rchilliinboxlist.findIndex(x => x.ResponseId == applicantId);
        if (applicantIndex != -1) {
          this.Rchilliinboxlist[applicantIndex].IsCandidateViewed = true;
        }
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }

      }
    }, error => {
      this._alertService.error(error);
    });
  }

  //Multiple assingess will be.
  OnAssignApplicants() {
    if (this.editPermission) {
      this.dialog.open(ApplicantAssignComponent, {
        data: { responses: this.selection.selected, model: 'multiple', responseId: 0 }, width: '60%', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.selection.clear();
          this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
        }
      });
    }
  }

  OnAssignMySelf() {
    if (this.editPermission) {
      if (this.selection.selected.length > 0) {

        var applicant = new RecruiterObject();
        applicant.RecruiterId = this.loginUser.UserId;
        applicant.MappingStatus = true;
        applicant.RecruiterEmail = this.loginUser.Email;
        applicant.RecruiterName = this.loginUser.FullName;
        this.RecruiterObjectList.push(applicant);

        this.selection.selected.forEach(element => {
          var applicant = new ApplicantsMapping();
          applicant.ApplicantId = element.ResponseId;
          applicant.ApplicantName = element.FirstName + " " + element.LastName;
          applicant.Recruiters = this.RecruiterObjectList;
          this.ApplicantsMappingList.push(applicant);
        })
        const applicants = {
          companyId: this.loginUser.Company.Id,
          Applicants: this.ApplicantsMappingList,
          AssignedBy: this.loginUser.UserId,
          Notes: null,
          Action: 'Assign',
          UpdateBy: this.loginUser.UserId
        }
        this.jobCentralService.AssignMultipleApplicants(applicants).subscribe(response => {
          if (!response.IsError) {
            this._alertService.success(response.SuccessMessage);
            this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
          }
          else {
            this._alertService.error(response.ErrorMessage);
          }
        }, error => {
          this._alertService.error(error);
        })
      }
      else {
        this._alertService.error("Please select Applicants");
      }
    }

  }

  AssignApplcant(rowApplicant: JobboardResponses) {debugger;
    if (this.editPermission) {
      this.selection.clear();
      let rowdata = [];
      rowdata.push(rowApplicant);
      this.dialog.open(ApplicantAssignComponent, {
        data: { responses: rowdata, model: 'single', responseId: rowApplicant.ResponseId }, width: '60%', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
        }
      });
    }
  }
  AssignMyselfApplcant(rowApplicant: JobboardResponses) {debugger;
    if (this.editPermission) {
      var applicant = new RecruiterMappings();
      applicant.ID = 1;
      applicant.RecruiterId = this.loginUser.UserId;
      applicant.ApplicantId = rowApplicant.ResponseId;
      applicant.MappingStatus = true;
      applicant.RecruiterEmail = this.loginUser.Email;
      applicant.RecruiterName = this.loginUser.FullName;
      this.applicantsMapping.push(applicant);
      const applicants = {
        companyId: this.loginUser.Company.Id,
        ResponseId: rowApplicant.ResponseId,
        applicantRecruiters: this.applicantsMapping,
        AssignedBy: this.loginUser.UserId,
        Notes: null,
        Action: 'Assign',
        UpdateBy: this.loginUser.UserId
      }
      this.jobCentralService.AssignSingleApplicants(applicants).subscribe(response => {
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          let applicantIndex = this.Rchilliinboxlist.findIndex(x => x.ResponseId == rowApplicant.ResponseId);
          if (applicantIndex != -1) {
            this.Rchilliinboxlist[applicantIndex].ApplicantStatus = 2;
            this.Rchilliinboxlist[applicantIndex].ApplicantStatusName = "Under Review";
          }
          this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
          this.applicantsMapping = [];
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      }, error => {
        this._alertService.error(error);
      })
    }
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

  IgnoreApplicant(row: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
      this.dialog.open(ApplicantIgnoreComponent, {
        data: { responseId: row.ResponseId, Source: 'Monster' }, width: '60%', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
        }
      });
    }
  }

  RefreshTableData() {
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  OnResponseToogle(eventValue: any) {
    this.selection.clear();
    this.SelectedResponseFilter = eventValue;
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }



  LocalDFWStatus(event) {
    this.selection.clear();
    this.localDFW = event.checked;
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  
  onLabelChange(change: MatSelectChange, row: JobboardResponses) {
    const index = this.Rchilliinboxlist.findIndex(c => c === row);
    var selectedStatus = change.value;
    this.Rchilliinboxlist[index].ApplicantStatusName = selectedStatus.text;
    this.Rchilliinboxlist[index].ApplicantStatus = selectedStatus.StatusId;
    const Psubmission = {
      ApplicantId: row.ResponseId,
      companyId: this.loginUser.Company.Id,
      ApplicantStatus: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this.jobCentralService.UpdateApplicantStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  ViewNotes(rowApplicant: JobboardResponses) {
    this.dialog.open(ApplicantNotesComponent, {
      data: { ResponseId: rowApplicant.ResponseId, candidateId: 0, inputsrc: 'Monster',Notesmode:'Dialog' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  SaveToDB(row: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
      this.dialog.open(ApplicantCandidateComponent, {
        data: { applicantId: row.ResponseId, candidateId: 0 }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          //written logic in stored procedure.
          //this.UpdateApplicantDBStatus(this.loginUser.Company.Id, row.ApplicantId, response);
          this.RefreshTableData();
        }
      });
    }
  }

  ShareApplcant(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
      this.dialog.open(ShareApplicantComponent, {
        data: { resourceId: rowApplicant.ResponseId, resourceType: 'Applicant' }, width: '60%', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
        }
      });
    }
  }

  ReviewApplcant(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
      this.dialog.open(AssignMyselfComponent, {
        data: {resourceId:rowApplicant.ResponseId,resourceType: 'Inbox'},
        maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
          this.RefreshTableData();
        }
      });
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
          this.assignees.unshift({ name: 'Unassigned', value: null, email: 'Unassigned', mapping: false });
          this.assignees.unshift({ name: 'ALL', value: null, email: 'ALL', mapping: false });
        },
        error => {
          this._alertService.error(error);
        });
  }

  filterByAssignee(selectedItem: assign) {
    this.selection.clear();
    if (selectedItem.name == 'ALL') {
      this.selectedAssignee = selectedItem.name;
      this.SelectedAssingValue = selectedItem.value;
    }
    else if (selectedItem.name == 'Unassigned') {
      this.selectedAssignee = selectedItem.name;
      this.SelectedAssingValue = selectedItem.value;
      this.IsUnassigned = true;
    }
    else {
      this.selectedAssignee = selectedItem.name;
      this.SelectedAssingValue = selectedItem.value;
    }

    this.RefreshTableData();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }

  }

  validateRecruiter(rowApplicant: JobboardResponses) {

    if (rowApplicant.RecruiterList != null)
      return rowApplicant.RecruiterList.find(x => x.UserId == this.loginUser.UserId);
    else
      return false;

  }

}


