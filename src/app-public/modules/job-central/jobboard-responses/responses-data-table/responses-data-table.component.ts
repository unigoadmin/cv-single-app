import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
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
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { JobCentralService } from '../../core/http/job-central.service';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CandidateResumeViewComponent } from '../../JC-Common/candidate-resume-view/candidate-resume-view.component';
import { iconsFA } from 'src/static-data/icons-fa';
import { ApplicantAssignComponent } from '../../JC-Common/applicant-assign/applicant-assign.component';
import { ApplicantsMapping, RecruiterMappings, RecruiterObject } from '../../core/model/applicantrecruitermapping';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { MatSelectChange } from '@angular/material/select';
import { ApplicantStatusLabels } from 'src/static-data/aio-table-data';
import { ApplicantCandidateComponent } from '../../JC-Common/applicant-candidate/applicant-candidate.component';
import { ShareApplicantComponent } from '../../JC-Common/share-applicant/share-applicant.component';
import { AssignMyselfComponent } from '../../JC-Common/assign-myself/assign-myself.component';
import { ResponseViewComponent } from '../response-view/response-view.component';
import { assign } from 'src/@shared/models/assign';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { debounceTime, distinct } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { ApplicantIgnoreComponent } from '../../JC-Common/applicant-ignore/applicant-ignore.component';
import { DuplicateResponsesComponent } from '../duplicate-responses/duplicate-responses.component';
import { IconService } from 'src/@shared/services/icon.service';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ApplicationStatus } from '../../core/model/applicantstatus';
import { ApplicantNotesComponent } from 'src/@shared/components/notes-components/applicant-notes/applicant-notes.component';
import { ResumeInsightsComponent } from '../resume-insights/resume-insights.component';

@UntilDestroy()
@Component({
  selector: 'cv-responses-data-table',
  templateUrl: './responses-data-table.component.html',
  styleUrls: ['./responses-data-table.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
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
export class ResponsesDataTableComponent implements OnInit {
  @Input('InputSrc') InputSrc: string;
  @Input('InboxSourceKey') InboxSourceKey: string;
  @Input('ApplicantStatus') ApplicantStatus: number;
  @Input('IsMarketing') IsMarketing: boolean;
  @Input('IsUnderTechScreen') IsUnderTechScreen: boolean;
  subject$: ReplaySubject<JobboardResponses[]> = new ReplaySubject<JobboardResponses[]>(1);
  data$: Observable<JobboardResponses[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  confirmresult: string = '';
  filteredIcons: string;
  applicantsMapping: RecruiterMappings[] = [];
  currentPage = 0;
  totalRows = 0;
  selectedRepresentative: string = "All";
  SelectedRepValues: any = null;
  SelectedResponseFilter: any;
  localDFW: Boolean = false;
  statusLabels = ApplicantStatusLabels;
  assignees: assign[] = [];
  benchSubUsers: SubUsers[];
  selectedAssignee: string = "All";
  SelectedAssingValue: string = null;
  RecruiterObjectList: RecruiterObject[] = [];
  ApplicantsMappingList: ApplicantsMapping[] = [];
  IsUnassigned: boolean = false;
  editPermission: any;
  LastLoadedDateTime: any;
  dataLoading: boolean = false;
  searchLoaded: boolean = false;
  ApplicantStausList: ApplicationStatus[];
  EditApplicantStatusList: ApplicationStatus[];
  @Input() InboxSource: number;
  @Input()
  columns: TableColumn<JobboardResponses>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Job Id', property: 'JobId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'First Name', property: 'FirstName', type: 'text', visible: true, cssClasses: ['font-medium', 'textcgs'] },
    { label: 'Last Name', property: 'LastName', type: 'text', visible: true, cssClasses: ['font-medium', 'textcgs'] },
    { label: 'Applicant Email', property: 'Email', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Phone', property: 'Phno', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Applicant Location', property: 'ApplicantLocation', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Resume', property: 'Resume', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'CV-Insights', property: 'CV-Insights', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
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
  @ViewChild('paginator') paginator: MatPaginator;
  DialogResponse: any;

  setDataSourceAttributes() {
    this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  Rchilliinboxlist: JobboardResponses[] = [];
  constructor(private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private jobCentralService: JobCentralService,
    private router: Router,
    private _eventemitterservice: EventEmitterService,
    private permissionsService: NgxPermissionsService,
    public iconService: IconService) {
    this.dataSource = new MatTableDataSource();
  }
  _dicenotesemitter = EmitterService.get("DiceNotescnt");
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.SelectedResponseFilter = 0;
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      EmitterService.get("JobCentral").emit("JobCentral");
      this.getBenchSubUsers();
      this.GetRchilliCandidateInbox(null, this.SelectedResponseFilter);
    }
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    this._dicenotesemitter.subscribe(res => {
      let NotesItem = this.Rchilliinboxlist.find(x => x.ResponseId == res);
      if (NotesItem != null)
        NotesItem.NotesCount += 1;

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });

    this._eventemitterservice.DiceResponseEvent.subscribe(() => {
      this.RefreshTableData();
    })

    this.editPermission = this.permissionsService.getPermission('ACTION_EDIT_APPLICANT');

    // Dynamically set visibility based on the condition
    this.columns = this.columns.map((column) => {
      if (column.property === 'CV-Insights') {
        column.visible = this.InputSrc !== 'Marketing' && this.InputSrc !== 'JobPosting' && this.InputSrc !== 'TechScreen';
      }
      return column;
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setDataSourceAttributes();
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

  GetRchilliCandidateInbox(SearchValue: string, ApplicantFilter: number) {
    this.Rchilliinboxlist = [];
    this.dataSource = new MatTableDataSource();
    const appFilter = {
      companyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      Source: this.InboxSourceKey,
      IsReviewFurther: false,
      InboxSource: this.InboxSource,
      PageIndex: this.currentPage,
      PageSize: this.pageSize,
      SearchText: SearchValue,
      ApplicantType: ApplicantFilter,
      RepresentType: this.SelectedRepValues,
      LocaltoDFW: this.localDFW,
      Recruiter: this.SelectedAssingValue,
      IsUnAssigned: this.IsUnassigned,
      ApplicantStatus: this.ApplicantStatus != 0 ? this.ApplicantStatus : null,
      IsMarketing: this.IsMarketing,
      IsUnderTechScreen: this.IsUnderTechScreen
    }
    this.jobCentralService.JobboardResponses(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.totalRows = result.TotalRecords;
        this.Rchilliinboxlist = result.Data;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.totalRows;
        });
        this.LastLoadedDateTime = new Date();
        this.Rchilliinboxlist.forEach(element => {
          element.CreatedDate = TimeZoneService.getRangeBaseTimeDisplay(element.CreatedDate, true);
        })
        this.dataSource = new MatTableDataSource(this.Rchilliinboxlist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }


  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    if (value && value.length > 2) {
      this.searchLoaded = true;
      const trimmedValue = value.trim().toLowerCase();
      this.GetRchilliCandidateInbox(trimmedValue, this.SelectedResponseFilter);
    } else if (value.length === 0 && this.searchLoaded == true) {
      this.GetRchilliCandidateInbox(null, this.SelectedResponseFilter);
      this.searchLoaded = false;
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.pageSize;//this.dataSource.paginator != undefined ? this.dataSource.paginator.length : this.pageSize;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      //this.dataSource.connect().value.forEach(row => this.selection.select(row));
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  ViewResume(row: JobboardResponses) {
    if (row.ActualFileName) {
      this.dialog.open(CandidateResumeViewComponent, {
        data: row, width: '60%'
      }).afterClosed().subscribe(response => {
        if (response == 0) {
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
        data: { ResponseId: row.ResponseId, Source: 'Dice' }, maxWidth: '95vw', width: '95vw', disableClose: true
      }).afterClosed().subscribe(response => {
        if (response == 0) {
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
            this.selection.clear();
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

  AssignApplcant(rowApplicant: JobboardResponses) {
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
  AssignMyselfApplcant(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
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
        data: { responseId: row.ResponseId, Source: 'Dice' }, width: '60%', disableClose: true
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
    this.selection.clear();
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  OnResponseToogle(eventValue: any) {
    this.selection.clear();
    this.SelectedResponseFilter = eventValue;
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  filterByRepresent(selectedType: any) {
    this.selection.clear();
    this.selectedRepresentative = selectedType;
    if (selectedType == "All")
      this.SelectedRepValues = null;
    else if (selectedType = "Self")
      this.SelectedRepValues = 1;
    else if (selectedType = "Recruiter")
      this.SelectedRepValues = 2;

    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  LocalDFWStatus(event) {
    this.selection.clear();
    this.localDFW = event.checked;
    this.GetRchilliCandidateInbox(this.searchCtrl.value, this.SelectedResponseFilter);
  }

  GoToArchivedResponses() {
    this.router.navigate(['job-central/archived-responses']);
  }

  onLabelChange(change: MatSelectChange, row: JobboardResponses) {
    const index = this.Rchilliinboxlist.findIndex(c => c === row);
    var selectedStatus = change.value;
    this.Rchilliinboxlist[index].ApplicantStatusName = selectedStatus.StatusName;
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
      data: { ResponseId: rowApplicant.ResponseId, candidateId: 0, inputsrc: 'Dice', Notesmode: 'Dialog' }, width: '60%'
    }).afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  SaveToDB(row: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
      this.dialog.open(ApplicantCandidateComponent, {
        data: { applicantId: row.ResponseId, candidateId: 0 }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
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
        data: { resourceId: rowApplicant.ResponseId, resourceType: 'Inbox' },
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
          this.assignees.unshift({ name: 'Unassigned', value: null, email: 'Unassigned', mapping: false })
          this.assignees.unshift({ name: 'ALL', value: null, email: 'ALL', mapping: false });
          this.getApplicantStatusLabels();
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

  ViewApplicantHistory(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      this.selection.clear();
      this.dialog.open(DuplicateResponsesComponent, {
        data: { ResponseId: rowApplicant.ResponseId, Email: rowApplicant.Email, FirstName: rowApplicant.FirstName, LastName: rowApplicant.LastName }, maxWidth: '95vw', width: '95vw', height: '90vh', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {
        }
      });
    }
  }


  AssignForTechScreen(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      const message = 'Applicant <b><span class="displayEmail"> ' + rowApplicant.FirstName + ' ' + rowApplicant.LastName + ' </span></b> status will be changed to Under Tech Screen ?'
      const dialogData = new ConfirmDialogModel("Tech Screen", message);
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '60%',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.DialogResponse = dialogResult;
        if (this.DialogResponse.Dialogaction == true) {
          const Psubmission = {
            ApplicantId: rowApplicant.ResponseId,
            companyId: this.loginUser.Company.Id,
            ApplicantStatus: 10, //Under Tech Screen
            UpdatedBy: this.loginUser.UserId,
            IsUnderTechScreen: true
          };
          this.UpdateResponseStatus(Psubmission);
        }
      });
    }
  }

  AssignForMarketing(rowApplicant: JobboardResponses) {
    if (this.editPermission) {
      const message = 'Applicant <b><span class="displayEmail"> ' + rowApplicant.FirstName + ' ' + rowApplicant.LastName + ' </span></b> will be moved to Marketing Screen ?'
      const dialogData = new ConfirmDialogModel("Tech Screen", message);
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '60%',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.DialogResponse = dialogResult;
        if (this.DialogResponse.Dialogaction == true) {
          const Psubmission = {
            ApplicantId: rowApplicant.ResponseId,
            companyId: this.loginUser.Company.Id,
            ApplicantStatus: 14, //Marketing Status. 
            UpdatedBy: this.loginUser.UserId,
            IsMarketing: true,
          };
          this.UpdateResponseStatus(Psubmission);
        }
      });
    }
  }

  UpdateResponseStatus(ResponseStaus: any) {
    this.jobCentralService.UpdateApplicantStatusWithRecruiter(ResponseStaus)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            this.RefreshTableData();
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  getDynamicClass(column: any, row: any): string {
    return row.IsCandidateViewed === 1 ? column.cssclasses : '';
  }

  ViewCVInsights(row: JobboardResponses) {
    if (row.ActualFileName) {
      this.dialog.open(ResumeInsightsComponent, {
        data: { responseId: row.ResponseId }, maxWidth: '85vw', width: '85vw', height: '70vh', panelClass: 'custom-modal', disableClose: true
      }).afterClosed().subscribe(response => {
        if (response == 0) {

        }
      });
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

}
